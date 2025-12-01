import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';

interface UserQuery {
  page?: string;
  limit?: string;
  role?: UserRole;
  search?: string;
}

// Get all users (admin only)
export const getAllUsers = async (req: Request<{}, {}, {}, UserQuery>, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      role,
      search
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              coursesCreated: true,
              enrollments: true,
              reviews: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users' }
    });
  }
};

// Get user by ID (admin only)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        coursesCreated: {
          select: {
            id: true,
            title: true,
            status: true,
            _count: {
              select: {
                enrollments: true
              }
            }
          }
        },
        enrollments: {
          select: {
            id: true,
            progress: true,
            isCompleted: true,
            enrolledAt: true,
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user' }
    });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: { user: updatedUser },
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update user role' }
    });
  }
};

// Deactivate/activate user (admin only)
export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'deactivate' or 'activate'

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const isActive = action === 'activate';

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: { user: updatedUser },
      message: `User ${action}d successfully`
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update user status' }
    });
  }
};

// Get user statistics (admin only)
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        coursesCreated: {
          include: {
            _count: {
              select: {
                enrollments: true,
                reviews: true
              }
            },
            enrollments: {
              select: {
                enrolledAt: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          }
        },
        enrollments: {
          include: {
            course: {
              select: {
                price: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    let stats: any = {
      totalEnrollments: user.enrollments.length,
      totalReviews: user.reviews.length
    };

    if (user.role === UserRole.INSTRUCTOR) {
      const totalStudents = user.coursesCreated.reduce((sum, course) => sum + course._count.enrollments, 0);
      const totalCourses = user.coursesCreated.length;
      const totalRevenue = user.coursesCreated.reduce((sum, course) => 
        sum + (course._count.enrollments * course.price), 0
      );
      
      const allRatings = user.coursesCreated.flatMap(course => course.reviews.map(r => r.rating));
      const averageRating = allRatings.length > 0
        ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
        : 0;

      stats = {
        ...stats,
        totalCourses,
        totalStudents,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10
      };
    }

    if (user.role === UserRole.STUDENT) {
      const totalSpent = user.enrollments.reduce((sum, enrollment) => sum + enrollment.course.price, 0);
      const averageRatingGiven = user.reviews.length > 0
        ? user.reviews.reduce((sum, review) => sum + review.rating, 0) / user.reviews.length
        : 0;

      stats = {
        ...stats,
        totalSpent,
        averageRatingGiven: Math.round(averageRatingGiven * 10) / 10
      };
    }

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user statistics' }
    });
  }
};

import { Request, Response } from 'express';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';

// Get admin dashboard statistics
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get user statistics
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalInstructors = await prisma.user.count({ where: { role: 'INSTRUCTOR' } });
    const activeUsers = await prisma.user.count({ where: { isActive: true } });

    // Get course statistics
    const totalCourses = await prisma.course.count();
    const publishedCourses = await prisma.course.count({ where: { status: 'PUBLISHED' } });
    const pendingCourses = await prisma.course.count({ where: { status: 'PENDING_APPROVAL' } });
    const draftCourses = await prisma.course.count({ where: { status: 'DRAFT' } });

    // Get enrollment statistics
    const totalEnrollments = await prisma.enrollment.count();
    const completedEnrollments = await prisma.enrollment.count({ where: { isCompleted: true } });

    // Get revenue statistics (simplified calculation)
    const revenueData = await prisma.enrollment.findMany({
      include: {
        course: {
          select: { price: true }
        }
      }
    });
    const totalRevenue = revenueData.reduce((sum, enrollment) => sum + enrollment.course.price, 0);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    const newCoursesThisMonth = await prisma.course.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          instructors: totalInstructors,
          active: activeUsers,
          newThisMonth: newUsersThisMonth
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          pending: pendingCourses,
          draft: draftCourses,
          newThisMonth: newCoursesThisMonth
        },
        enrollments: {
          total: totalEnrollments,
          completed: completedEnrollments,
          completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0
        },
        revenue: {
          total: totalRevenue,
          averagePerCourse: publishedCourses > 0 ? totalRevenue / publishedCourses : 0
        }
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get admin statistics' }
    });
  }
};

// Get all users with pagination and filtering
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = 'all',
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (role !== 'all') {
      where.role = role;
    }

    if (status !== 'all') {
      where.isActive = status === 'active';
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: offset,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              enrollments: true,
              coursesCreated: true,
              reviews: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalCount,
          hasNext: pageNum * limitNum < totalCount,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get users' }
    });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Prevent admins from deactivating themselves
    if (userId === req.user!.id && !isActive) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot deactivate your own account' }
      });
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });

    res.json({
      success: true,
      data: { user: updatedUser },
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update user status' }
    });
  }
};

// Delete user (soft delete by deactivating)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Prevent admins from deleting themselves
    if (userId === req.user!.id) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot delete your own account' }
      });
    }

    // Soft delete - deactivate user instead of actual deletion
    await prisma.user.update({
      where: { id: userId },
      data: { 
        isActive: false,
        email: `deleted_${user.email}` // Prevent email conflicts
      }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete user' }
    });
  }
};

// Get all courses with pagination and filtering
export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = 'all',
      category = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      where.status = status;
    }

    if (category !== 'all') {
      where.category = category;
    }

    // Get courses with pagination
    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: offset,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true,
              lessons: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        }
      }),
      prisma.course.count({ where })
    ]);

    // Calculate average ratings
    const coursesWithRatings = courses.map(course => {
      const avgRating = course.reviews.length > 0 
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0;
      
      return {
        ...course,
        averageRating: Math.round(avgRating * 10) / 10,
        enrollmentCount: course._count.enrollments,
        reviewCount: course._count.reviews,
        lessonCount: course._count.lessons
      };
    });

    res.json({
      success: true,
      data: {
        courses: coursesWithRatings,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalCount,
          hasNext: pageNum * limitNum < totalCount,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get courses' }
    });
  }
};

// Update course status (approve/reject/archive)
export const updateCourseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    const validStatuses = ['PUBLISHED', 'PENDING_APPROVAL', 'ARCHIVED', 'DRAFT'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid status' }
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: { name: true, email: true }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Update course status
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { 
        status: status as any,
        // If publishing, set isPublished to true
        isPublished: status === 'PUBLISHED'
      }
    });

    // TODO: Send notification to instructor about status change
    // This would typically involve an email service

    res.json({
      success: true,
      data: { course: updatedCourse },
      message: `Course ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    console.error('Update course status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update course status' }
    });
  }
};

// Get pending course approvals
export const getPendingApprovals = async (req: AuthRequest, res: Response) => {
  try {
    const pendingCourses = await prisma.course.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            lessons: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      success: true,
      data: { courses: pendingCourses }
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get pending approvals' }
    });
  }
};

// Get platform analytics for admin
export const getPlatformAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get daily user registrations
    const userRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    });

    // Get daily course creations
    const courseCreations = await prisma.course.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    });

    // Get daily enrollments
    const enrollments = await prisma.enrollment.groupBy({
      by: ['enrolledAt'],
      where: {
        enrolledAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    });

    // Get revenue by category
    const revenueByCategory = await prisma.course.groupBy({
      by: ['category'],
      _sum: {
        price: true
      },
      _count: {
        enrollments: true
      }
    });

    res.json({
      success: true,
      data: {
        userRegistrations,
        courseCreations,
        enrollments,
        revenueByCategory,
        period
      }
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get platform analytics' }
    });
  }
};

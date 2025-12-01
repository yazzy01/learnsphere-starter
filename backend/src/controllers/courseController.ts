import { Request, Response } from 'express';
import { CourseStatus, UserRole } from '@prisma/client';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';

interface CourseQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  level?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Get all courses (public)
export const getAllCourses = async (req: Request<{}, {}, {}, CourseQuery>, res: Response) => {
  try {
    const {
      page = '1',
      limit = '12',
      search,
      category,
      level,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      status: CourseStatus.PUBLISHED,
      isPublished: true
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build order clause
    const orderBy: any = {};
    if (sortBy === 'rating') {
      // For rating, we'll need to calculate average rating
      orderBy.reviews = { _count: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Get courses with related data
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true
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

    // Calculate average ratings and format response
    const coursesWithStats = courses.map(course => {
      const averageRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0;

      const { reviews, _count, ...courseData } = course;

      return {
        ...courseData,
        studentsCount: _count.enrollments,
        reviewsCount: _count.reviews,
        lessonsCount: _count.lessons,
        rating: Math.round(averageRating * 10) / 10
      };
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        courses: coursesWithStats,
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
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch courses' }
    });
  }
};

// Get course by ID (public)
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            _count: {
              select: {
                coursesCreated: true
              }
            }
          }
        },
        lessons: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true,
            type: true,
            isPreview: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            lessons: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Calculate average rating
    const averageRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : 0;

    // Format response
    const { _count, ...courseData } = course;
    const response = {
      ...courseData,
      studentsCount: _count.enrollments,
      reviewsCount: _count.reviews,
      lessonsCount: _count.lessons,
      rating: Math.round(averageRating * 10) / 10
    };

    res.json({
      success: true,
      data: { course: response }
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch course' }
    });
  }
};

// Create new course (instructor only)
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      longDescription,
      price,
      originalPrice,
      category,
      level,
      duration,
      thumbnail
    } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        longDescription,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        level,
        duration,
        thumbnail,
        instructorId: req.user!.id,
        status: CourseStatus.DRAFT
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            lessons: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: { course },
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create course' }
    });
  }
};

// Update course (instructor/admin only)
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if course exists and user has permission
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Check ownership (instructors can only edit their own courses, admins can edit any)
    if (req.user!.role === UserRole.INSTRUCTOR && existingCourse.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only edit your own courses' }
      });
    }

    // Parse numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            lessons: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { course },
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update course' }
    });
  }
};

// Delete course (instructor/admin only)
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if course exists and user has permission
    const existingCourse = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Check ownership
    if (req.user!.role === UserRole.INSTRUCTOR && existingCourse.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only delete your own courses' }
      });
    }

    // Prevent deletion if course has enrollments
    if (existingCourse._count.enrollments > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Cannot delete course with active enrollments' }
      });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete course' }
    });
  }
};

// Submit course for approval (instructor only)
export const submitCourseForApproval = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.id;

    // Check if course exists and user owns it
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    if (course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only submit your own courses for approval' }
      });
    }

    // Validate course completeness
    const validationErrors = [];
    
    if (!course.title || course.title.length < 10) {
      validationErrors.push('Title must be at least 10 characters');
    }
    
    if (!course.description || course.description.length < 50) {
      validationErrors.push('Description must be at least 50 characters');
    }
    
    if (course.lessons.length === 0) {
      validationErrors.push('Course must have at least one lesson');
    }
    
    if (!course.category) {
      validationErrors.push('Category is required');
    }
    
    if (!course.level) {
      validationErrors.push('Level is required');
    }
    
    if (course.price <= 0) {
      validationErrors.push('Price must be greater than 0');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: { 
          message: 'Course validation failed', 
          details: validationErrors 
        }
      });
    }

    if (course.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        error: { message: 'Only draft courses can be submitted for approval' }
      });
    }

    // Update course status and add submission timestamp
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { 
        status: 'PENDING_APPROVAL',
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: { course: updatedCourse },
      message: 'Course submitted for approval successfully'
    });
  } catch (error) {
    console.error('Submit course for approval error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit course for approval' }
    });
  }
};

// Get instructor's courses
export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.user!.id
      },
      include: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate average ratings for each course
    const coursesWithStats = courses.map(course => {
      const averageRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0;

      const { reviews, _count, ...courseData } = course;

      return {
        ...courseData,
        studentsCount: _count.enrollments,
        reviewsCount: _count.reviews,
        lessonsCount: _count.lessons,
        rating: Math.round(averageRating * 10) / 10
      };
    });

    res.json({
      success: true,
      data: { courses: coursesWithStats }
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch instructor courses' }
    });
  }
};

// Publish/unpublish course
export const publishCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'publish' or 'unpublish'

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Check ownership
    if (req.user!.role === UserRole.INSTRUCTOR && course.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only publish your own courses' }
      });
    }

    // Validate course has lessons before publishing
    if (action === 'publish' && course._count.lessons === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Course must have at least one lesson before publishing' }
      });
    }

    const newStatus = action === 'publish' ? CourseStatus.PUBLISHED : CourseStatus.DRAFT;
    const isPublished = action === 'publish';

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: newStatus,
        isPublished
      }
    });

    res.json({
      success: true,
      data: { course: updatedCourse },
      message: `Course ${action}ed successfully`
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update course status' }
    });
  }
};

// Get course statistics
export const getCourseStats = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: {
          select: {
            enrolledAt: true,
            progress: true,
            isCompleted: true
          }
        },
        reviews: {
          select: {
            rating: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Check ownership
    if (req.user!.role === UserRole.INSTRUCTOR && course.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only view stats for your own courses' }
      });
    }

    // Calculate statistics
    const totalEnrollments = course.enrollments.length;
    const completedEnrollments = course.enrollments.filter(e => e.isCompleted).length;
    const averageProgress = totalEnrollments > 0
      ? course.enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments
      : 0;

    const averageRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
      : 0;

    // Revenue calculation (simplified)
    const totalRevenue = totalEnrollments * course.price;

    const stats = {
      totalEnrollments,
      completedEnrollments,
      completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
      averageProgress: Math.round(averageProgress * 10) / 10,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: course.reviews.length,
      totalLessons: course._count.lessons,
      totalRevenue
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch course statistics' }
    });
  }
};

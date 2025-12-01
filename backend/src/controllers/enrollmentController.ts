import { Request, Response } from 'express';
import { CourseStatus, UserRole } from '@prisma/client';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';

interface EnrollmentQuery {
  page?: string;
  limit?: string;
  status?: 'active' | 'completed';
}

// Enroll in a course
export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user!.id;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true
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

    if (course.status !== CourseStatus.PUBLISHED || !course.isPublished) {
      return res.status(400).json({
        success: false,
        error: { message: 'Course is not available for enrollment' }
      });
    }

    // Check if user is trying to enroll in their own course
    if (course.instructorId === userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot enroll in your own course' }
      });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        error: { message: 'You are already enrolled in this course' }
      });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            instructor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: { enrollment },
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to enroll in course' }
    });
  }
};

// Get user's enrollments
export const getUserEnrollments = async (req: AuthRequest<{}, {}, {}, EnrollmentQuery>, res: Response) => {
  try {
    const {
      page = '1',
      limit = '12',
      status
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      userId: req.user!.id
    };

    if (status === 'completed') {
      where.isCompleted = true;
    } else if (status === 'active') {
      where.isCompleted = false;
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          course: {
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
                  lessons: true,
                  reviews: true
                }
              },
              reviews: {
                where: {
                  userId: req.user!.id
                },
                select: {
                  id: true,
                  rating: true,
                  comment: true
                }
              }
            }
          }
        },
        orderBy: {
          enrolledAt: 'desc'
        }
      }),
      prisma.enrollment.count({ where })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        enrollments,
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
    console.error('Get user enrollments error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch enrollments' }
    });
  }
};

// Get enrollment by ID
export const getEnrollmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
                bio: true
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
            _count: {
              select: {
                lessons: true,
                enrollments: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Enrollment not found' }
      });
    }

    // Check if user owns this enrollment or is admin
    if (req.user!.role !== UserRole.ADMIN && enrollment.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only access your own enrollments' }
      });
    }

    // Get lesson progress for this enrollment
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: enrollment.userId,
        lesson: {
          courseId: enrollment.courseId
        }
      },
      select: {
        lessonId: true,
        isCompleted: true,
        completedAt: true,
        watchTime: true
      }
    });

    // Merge lesson progress with course lessons
    const lessonsWithProgress = enrollment.course.lessons.map(lesson => ({
      ...lesson,
      progress: lessonProgress.find(p => p.lessonId === lesson.id) || {
        isCompleted: false,
        completedAt: null,
        watchTime: 0
      }
    }));

    const enrichedEnrollment = {
      ...enrollment,
      course: {
        ...enrollment.course,
        lessons: lessonsWithProgress
      }
    };

    res.json({
      success: true,
      data: { enrollment: enrichedEnrollment }
    });
  } catch (error) {
    console.error('Get enrollment by ID error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch enrollment' }
    });
  }
};

// Update enrollment progress
export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Enrollment not found' }
      });
    }

    // Check ownership
    if (enrollment.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only update your own enrollment progress' }
      });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        progress: Math.min(100, Math.max(0, progress))
      }
    });

    res.json({
      success: true,
      data: { enrollment: updatedEnrollment },
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update progress' }
    });
  }
};

// Complete course
export const completeCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Enrollment not found' }
      });
    }

    // Check ownership
    if (enrollment.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only complete your own enrollments' }
      });
    }

    if (enrollment.isCompleted) {
      return res.status(400).json({
        success: false,
        error: { message: 'Course is already completed' }
      });
    }

    // Update enrollment to completed
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        progress: 100
      }
    });

    // Create certificate
    await prisma.certificate.create({
      data: {
        userId: enrollment.userId,
        courseId: enrollment.courseId
      }
    });

    res.json({
      success: true,
      data: { enrollment: updatedEnrollment },
      message: 'Congratulations! Course completed successfully'
    });
  } catch (error) {
    console.error('Complete course error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to complete course' }
    });
  }
};

// Get enrollments for a course (instructor only)
export const getCourseEnrollments = async (req: AuthRequest<{courseId: string}, {}, {}, EnrollmentQuery>, res: Response) => {
  try {
    const { courseId } = req.params;
    const {
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Check if course exists and user has permission
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Check ownership (instructors can only view enrollments for their courses)
    if (req.user!.role === UserRole.INSTRUCTOR && course.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only view enrollments for your own courses' }
      });
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { courseId },
        skip,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        },
        orderBy: {
          enrolledAt: 'desc'
        }
      }),
      prisma.enrollment.count({ where: { courseId } })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        enrollments,
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
    console.error('Get course enrollments error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch course enrollments' }
    });
  }
};

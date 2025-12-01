import { Request, Response } from 'express';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';

// Update lesson progress
export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { isCompleted, watchTime, progress } = req.body;
    const userId = req.user!.id;

    // Validate lesson exists and user has access
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' }
      });
    }

    // Check if user is enrolled in the course
    const enrollment = lesson.course.enrollments[0];
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: { message: 'You must be enrolled in this course to track progress' }
      });
    }

    // Update or create lesson progress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        isCompleted: isCompleted ?? undefined,
        watchTime: watchTime ?? undefined,
        completedAt: isCompleted ? new Date() : undefined,
        updatedAt: new Date()
      },
      create: {
        userId,
        lessonId,
        isCompleted: isCompleted ?? false,
        watchTime: watchTime ?? 0,
        completedAt: isCompleted ? new Date() : null
      }
    });

    // Recalculate course progress
    await updateCourseProgress(userId, lesson.courseId);

    res.json({
      success: true,
      data: { lessonProgress },
      message: 'Lesson progress updated successfully'
    });
  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update lesson progress' }
    });
  }
};

// Get lesson progress for a user
export const getLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user!.id;

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            duration: true,
            type: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { progress }
    });
  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get lesson progress' }
    });
  }
};

// Get course progress overview
export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.id;

    // Get enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Enrollment not found' }
      });
    }

    // Get all lessons in the course
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        progress: {
          where: { userId },
          select: {
            id: true,
            isCompleted: true,
            watchTime: true,
            completedAt: true,
            updatedAt: true
          }
        }
      }
    });

    // Calculate overall progress
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(lesson => 
      lesson.progress[0]?.isCompleted
    ).length;
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Format lesson progress data
    const lessonProgress = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      type: lesson.type,
      order: lesson.order,
      isPreview: lesson.isPreview,
      progress: lesson.progress[0] || null
    }));

    res.json({
      success: true,
      data: {
        enrollment,
        overallProgress,
        totalLessons,
        completedLessons,
        lessons: lessonProgress
      }
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get course progress' }
    });
  }
};

// Mark lesson as completed
export const markLessonComplete = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user!.id;

    // Validate lesson access
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!lesson || !lesson.course.enrollments[0]) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    // Mark lesson as completed
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    // Update course progress
    await updateCourseProgress(userId, lesson.courseId);

    res.json({
      success: true,
      data: { lessonProgress },
      message: 'Lesson marked as completed'
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to mark lesson as completed' }
    });
  }
};

// Helper function to update course progress
async function updateCourseProgress(userId: string, courseId: string) {
  try {
    // Get all lessons in the course
    const totalLessons = await prisma.lesson.count({
      where: { courseId }
    });

    // Get completed lessons count
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: { courseId },
        isCompleted: true
      }
    });

    // Calculate progress percentage
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const isCompleted = progress === 100;

    // Update enrollment
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      data: {
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      }
    });

    return { progress, isCompleted, completedLessons, totalLessons };
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
}

// Get user's overall learning statistics
export const getUserLearningStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get enrollments with progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            category: true
          }
        }
      }
    });

    // Get total lessons completed
    const totalLessonsCompleted = await prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true
      }
    });

    // Get total study time (in minutes)
    const totalWatchTime = await prisma.lessonProgress.aggregate({
      where: { userId },
      _sum: {
        watchTime: true
      }
    });

    // Get certificates earned
    const certificatesCount = await prisma.certificate.count({
      where: { userId }
    });

    // Calculate completion stats
    const completedCourses = enrollments.filter(e => e.isCompleted).length;
    const inProgressCourses = enrollments.filter(e => !e.isCompleted && e.progress > 0).length;
    const averageProgress = enrollments.length > 0 
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length 
      : 0;

    res.json({
      success: true,
      data: {
        totalEnrollments: enrollments.length,
        completedCourses,
        inProgressCourses,
        totalLessonsCompleted,
        totalStudyTimeMinutes: Math.round((totalWatchTime._sum.watchTime || 0) / 60),
        certificatesEarned: certificatesCount,
        averageProgress: Math.round(averageProgress * 100) / 100,
        recentCourses: enrollments
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get user learning stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get learning statistics' }
    });
  }
};

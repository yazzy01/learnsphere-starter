import { Request, Response, NextFunction } from 'express';
import { LessonType, UserRole } from '@prisma/client';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';

// Middleware to check if user owns the course for lesson operations
export const getCourseInstructor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Check ownership (instructors can only modify lessons in their courses)
    if (req.user!.role === UserRole.INSTRUCTOR && course.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only create lessons for your own courses' }
      });
    }

    next();
  } catch (error) {
    console.error('Get course instructor error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to verify course ownership' }
    });
  }
};

// Create new lesson
export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      content,
      videoUrl,
      fileUrl,
      duration,
      order,
      type,
      isPreview = false,
      courseId
    } = req.body;

    // Check if order already exists for this course
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        courseId,
        order
      }
    });

    if (existingLesson) {
      return res.status(400).json({
        success: false,
        error: { message: `A lesson with order ${order} already exists in this course` }
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        videoUrl,
        fileUrl,
        duration,
        order,
        type: type as LessonType,
        isPreview,
        courseId
      }
    });

    res.status(201).json({
      success: true,
      data: { lesson },
      message: 'Lesson created successfully'
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create lesson' }
    });
  }
};

// Update lesson
export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Get the lesson to check course ownership
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true
      }
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' }
      });
    }

    // Check ownership
    if (req.user!.role === UserRole.INSTRUCTOR && existingLesson.course.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only update lessons in your own courses' }
      });
    }

    // If updating order, check for conflicts
    if (updateData.order && updateData.order !== existingLesson.order) {
      const conflictingLesson = await prisma.lesson.findFirst({
        where: {
          courseId: existingLesson.courseId,
          order: updateData.order,
          id: { not: id }
        }
      });

      if (conflictingLesson) {
        return res.status(400).json({
          success: false,
          error: { message: `A lesson with order ${updateData.order} already exists in this course` }
        });
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: { lesson },
      message: 'Lesson updated successfully'
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update lesson' }
    });
  }
};

// Delete lesson
export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get the lesson to check course ownership
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true
      }
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' }
      });
    }

    // Check ownership
    if (req.user!.role === UserRole.INSTRUCTOR && existingLesson.course.instructorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only delete lessons from your own courses' }
      });
    }

    await prisma.lesson.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete lesson' }
    });
  }
};

// Mark lesson as complete (student)
export const markLessonComplete = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true
      }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' }
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: { message: 'You must be enrolled in this course to mark lessons complete' }
      });
    }

    // Create or update lesson progress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: id
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date()
      },
      create: {
        userId,
        lessonId: id,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    // Update overall course progress
    const totalLessons = await prisma.lesson.count({
      where: { courseId: lesson.courseId }
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          courseId: lesson.courseId
        }
      }
    });

    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId
        }
      },
      data: {
        progress: Math.round(progress * 10) / 10
      }
    });

    res.json({
      success: true,
      data: { lessonProgress },
      message: 'Lesson marked as complete'
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to mark lesson complete' }
    });
  }
};

// Update lesson progress (for video watch time, etc.)
export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;
    const userId = req.user!.id;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' }
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: { message: 'You must be enrolled in this course to track progress' }
      });
    }

    // Update lesson progress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: id
        }
      },
      update: {
        ...(watchTime !== undefined && { watchTime })
      },
      create: {
        userId,
        lessonId: id,
        ...(watchTime !== undefined && { watchTime })
      }
    });

    res.json({
      success: true,
      data: { lessonProgress },
      message: 'Lesson progress updated'
    });
  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update lesson progress' }
    });
  }
};

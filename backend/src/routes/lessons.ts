import express from 'express';
import { body, param } from 'express-validator';
import {
  createLesson,
  updateLesson,
  deleteLesson,
  getCourseInstructor,
  markLessonComplete,
  updateLessonProgress
} from '@/controllers/lessonController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All lesson routes require authentication
router.use(authenticate);

// Lesson validation rules
const lessonValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 50000 })
    .withMessage('Content must not exceed 50000 characters'),
  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
  body('fileUrl')
    .optional()
    .isURL()
    .withMessage('File URL must be a valid URL'),
  body('duration')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Duration must not exceed 50 characters'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('type')
    .isIn(['VIDEO', 'TEXT', 'PDF', 'QUIZ'])
    .withMessage('Type must be VIDEO, TEXT, PDF, or QUIZ'),
  body('isPreview')
    .optional()
    .isBoolean()
    .withMessage('isPreview must be a boolean'),
  body('courseId')
    .isString()
    .notEmpty()
    .withMessage('Course ID is required')
];

// Parameter validation
const idValidation = [
  param('id')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Lesson ID is required')
];

// Instructor routes - create, update, delete lessons
router.post('/', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  lessonValidation, 
  validateRequest, 
  getCourseInstructor,
  createLesson
);

router.put('/:id', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  idValidation.concat(lessonValidation), 
  validateRequest, 
  updateLesson
);

router.delete('/:id', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  idValidation, 
  validateRequest, 
  deleteLesson
);

// Student routes - mark lesson complete, update progress
router.patch('/:id/complete', 
  idValidation, 
  validateRequest, 
  markLessonComplete
);

router.patch('/:id/progress', 
  idValidation.concat([
    body('watchTime').optional().isInt({ min: 0 }).withMessage('Watch time must be a positive integer')
  ]), 
  validateRequest, 
  updateLessonProgress
);

export default router;

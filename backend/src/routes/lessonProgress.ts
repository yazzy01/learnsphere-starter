import express from 'express';
import { body, param } from 'express-validator';
import {
  updateLessonProgress,
  getLessonProgress,
  getCourseProgress,
  markLessonComplete,
  getUserLearningStats
} from '@/controllers/lessonProgressController';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const lessonIdValidation = [
  param('lessonId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Valid lesson ID is required')
];

const courseIdValidation = [
  param('courseId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Valid course ID is required')
];

const progressUpdateValidation = [
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),
  body('watchTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('watchTime must be a non-negative integer'),
  body('progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('progress must be between 0 and 100')
];

// Update lesson progress (watch time, completion status)
router.put('/lessons/:lessonId/progress',
  lessonIdValidation,
  progressUpdateValidation,
  validateRequest,
  updateLessonProgress
);

// Get specific lesson progress
router.get('/lessons/:lessonId/progress',
  lessonIdValidation,
  validateRequest,
  getLessonProgress
);

// Mark lesson as completed (shortcut endpoint)
router.post('/lessons/:lessonId/complete',
  lessonIdValidation,
  validateRequest,
  markLessonComplete
);

// Get complete course progress overview
router.get('/courses/:courseId/progress',
  courseIdValidation,
  validateRequest,
  getCourseProgress
);

// Get user's overall learning statistics
router.get('/stats',
  getUserLearningStats
);

export default router;

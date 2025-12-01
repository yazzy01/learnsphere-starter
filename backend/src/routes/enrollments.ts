import express from 'express';
import { body, param, query } from 'express-validator';
import {
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentById,
  updateProgress,
  completeCourse,
  getCourseEnrollments
} from '@/controllers/enrollmentController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All enrollment routes require authentication
router.use(authenticate);

// Student routes
router.post('/enroll', [
  body('courseId').isString().notEmpty().withMessage('Course ID is required')
], validateRequest, enrollInCourse);

router.get('/my-enrollments', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['active', 'completed']).withMessage('Status must be active or completed')
], validateRequest, getUserEnrollments);

router.get('/:id', [
  param('id').isString().notEmpty().withMessage('Enrollment ID is required')
], validateRequest, getEnrollmentById);

router.patch('/:id/progress', [
  param('id').isString().notEmpty().withMessage('Enrollment ID is required'),
  body('progress').isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
], validateRequest, updateProgress);

router.patch('/:id/complete', [
  param('id').isString().notEmpty().withMessage('Enrollment ID is required')
], validateRequest, completeCourse);

// Instructor routes - view enrollments for their courses
router.get('/course/:courseId', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN),
  [
    param('courseId').isString().notEmpty().withMessage('Course ID is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  validateRequest,
  getCourseEnrollments
);

export default router;

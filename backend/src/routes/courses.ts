import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  publishCourse,
  getCourseStats,
  submitCourseForApproval
} from '@/controllers/courseController';
import { authenticate, authorize, AuthRequest } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Course validation rules
const courseValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('Description must be between 20 and 500 characters'),
  body('longDescription')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Long description must not exceed 2000 characters'),
  body('price')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Price must be between 0 and 10000'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Original price must be between 0 and 10000'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('level')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be Beginner, Intermediate, or Advanced'),
  body('duration')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Duration must not exceed 50 characters')
];

// Query validation for course listing
const courseQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query must not exceed 100 characters'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),
  query('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be Beginner, Intermediate, or Advanced'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('sortBy')
    .optional()
    .isIn(['title', 'price', 'createdAt', 'rating'])
    .withMessage('Sort by must be title, price, createdAt, or rating'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Parameter validation
const idValidation = [
  param('id')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Course ID is required')
];

// Public routes
router.get('/', courseQueryValidation, validateRequest, getAllCourses);
router.get('/:id', idValidation, validateRequest, getCourseById);

// Protected routes - Instructors and Admins
router.use(authenticate);

// Instructor routes
router.post('/', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  courseValidation, 
  validateRequest, 
  createCourse
);

router.put('/:id', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  idValidation.concat(courseValidation), 
  validateRequest, 
  updateCourse
);

router.delete('/:id', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  idValidation, 
  validateRequest, 
  deleteCourse
);

router.get('/instructor/my-courses', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  getInstructorCourses
);

router.patch('/:id/publish', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  idValidation, 
  validateRequest, 
  publishCourse
);

router.get('/:id/stats', 
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN), 
  idValidation, 
  validateRequest, 
  getCourseStats
);

// Submit course for approval (instructor only)
router.post('/:courseId/submit-for-approval',
  authenticate,
  authorize(UserRole.INSTRUCTOR),
  courseIdValidation,
  validateRequest,
  submitCourseForApproval
);

export default router;

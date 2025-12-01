import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getUserReviews
} from '@/controllers/reviewController';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = express.Router();

// All review routes require authentication
router.use(authenticate);

// Review validation rules
const reviewValidation = [
  body('courseId')
    .isString()
    .notEmpty()
    .withMessage('Course ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters')
];

// Parameter validation
const idValidation = [
  param('id')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Review ID is required')
];

const courseIdValidation = [
  param('courseId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Course ID is required')
];

// Review CRUD operations
router.post('/', 
  reviewValidation, 
  validateRequest, 
  createReview
);

router.put('/:id', 
  idValidation.concat([
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters')
  ]), 
  validateRequest, 
  updateReview
);

router.delete('/:id', 
  idValidation, 
  validateRequest, 
  deleteReview
);

// Get reviews for a course (public)
router.get('/course/:courseId', 
  courseIdValidation.concat([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating filter must be between 1 and 5')
  ]), 
  validateRequest, 
  getCourseReviews
);

// Get user's reviews
router.get('/my-reviews', 
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ], 
  validateRequest, 
  getUserReviews
);

export default router;

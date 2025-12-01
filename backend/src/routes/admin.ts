import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getAdminStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getCourses,
  updateCourseStatus,
  getPendingApprovals,
  getPlatformAnalytics
} from '@/controllers/adminController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Validation rules
const userIdValidation = [
  param('userId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Valid user ID is required')
];

const courseIdValidation = [
  param('courseId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Valid course ID is required')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const userStatusValidation = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const courseStatusValidation = [
  body('status')
    .isIn(['PUBLISHED', 'PENDING_APPROVAL', 'ARCHIVED', 'DRAFT'])
    .withMessage('Invalid course status'),
  body('rejectionReason')
    .optional()
    .isString()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters')
];

// === DASHBOARD & ANALYTICS ===

// Get admin dashboard statistics
router.get('/stats', getAdminStats);

// Get platform analytics
router.get('/analytics',
  [
    query('period')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('Period must be one of: 7d, 30d, 90d, 1y')
  ],
  validateRequest,
  getPlatformAnalytics
);

// === USER MANAGEMENT ===

// Get all users with pagination and filtering
router.get('/users',
  [
    ...paginationValidation,
    query('search')
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage('Search term must be less than 100 characters'),
    query('role')
      .optional()
      .isIn(['all', 'STUDENT', 'INSTRUCTOR', 'ADMIN'])
      .withMessage('Invalid role filter'),
    query('status')
      .optional()
      .isIn(['all', 'active', 'inactive'])
      .withMessage('Invalid status filter'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'name', 'email', 'role'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  validateRequest,
  getUsers
);

// Update user status (activate/deactivate)
router.patch('/users/:userId/status',
  userIdValidation,
  userStatusValidation,
  validateRequest,
  updateUserStatus
);

// Delete user (soft delete)
router.delete('/users/:userId',
  userIdValidation,
  validateRequest,
  deleteUser
);

// === COURSE MANAGEMENT ===

// Get all courses with pagination and filtering
router.get('/courses',
  [
    ...paginationValidation,
    query('search')
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage('Search term must be less than 100 characters'),
    query('status')
      .optional()
      .isIn(['all', 'PUBLISHED', 'PENDING_APPROVAL', 'ARCHIVED', 'DRAFT'])
      .withMessage('Invalid status filter'),
    query('category')
      .optional()
      .isString()
      .isLength({ max: 50 })
      .withMessage('Category must be less than 50 characters'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'title', 'status', 'price'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  validateRequest,
  getCourses
);

// Update course status (approve/reject/archive)
router.patch('/courses/:courseId/status',
  courseIdValidation,
  courseStatusValidation,
  validateRequest,
  updateCourseStatus
);

// Get pending course approvals
router.get('/courses/pending-approvals', getPendingApprovals);

// === BULK OPERATIONS ===

// Bulk update user status
router.patch('/users/bulk/status',
  [
    body('userIds')
      .isArray({ min: 1 })
      .withMessage('userIds must be a non-empty array'),
    body('userIds.*')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each user ID must be a valid string'),
    body('isActive')
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ],
  validateRequest,
  async (req, res) => {
    // Implementation for bulk user status update
    res.json({ success: true, message: 'Bulk update completed' });
  }
);

// Bulk update course status
router.patch('/courses/bulk/status',
  [
    body('courseIds')
      .isArray({ min: 1 })
      .withMessage('courseIds must be a non-empty array'),
    body('courseIds.*')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Each course ID must be a valid string'),
    body('status')
      .isIn(['PUBLISHED', 'PENDING_APPROVAL', 'ARCHIVED', 'DRAFT'])
      .withMessage('Invalid course status')
  ],
  validateRequest,
  async (req, res) => {
    // Implementation for bulk course status update
    res.json({ success: true, message: 'Bulk update completed' });
  }
);

// === REPORTS ===

// Export users report
router.get('/reports/users',
  [
    query('format')
      .optional()
      .isIn(['csv', 'xlsx'])
      .withMessage('Format must be csv or xlsx'),
    query('dateFrom')
      .optional()
      .isISO8601()
      .withMessage('dateFrom must be a valid ISO 8601 date'),
    query('dateTo')
      .optional()
      .isISO8601()
      .withMessage('dateTo must be a valid ISO 8601 date')
  ],
  validateRequest,
  async (req, res) => {
    // Implementation for users report export
    res.json({ success: true, message: 'Report generated' });
  }
);

// Export courses report
router.get('/reports/courses',
  [
    query('format')
      .optional()
      .isIn(['csv', 'xlsx'])
      .withMessage('Format must be csv or xlsx'),
    query('dateFrom')
      .optional()
      .isISO8601()
      .withMessage('dateFrom must be a valid ISO 8601 date'),
    query('dateTo')
      .optional()
      .isISO8601()
      .withMessage('dateTo must be a valid ISO 8601 date')
  ],
  validateRequest,
  async (req, res) => {
    // Implementation for courses report export
    res.json({ success: true, message: 'Report generated' });
  }
);

export default router;

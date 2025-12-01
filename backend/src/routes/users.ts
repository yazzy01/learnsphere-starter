import express from 'express';
import { param, query } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  getUserStats
} from '@/controllers/userController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', 
  authorize(UserRole.ADMIN), 
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('role').optional().isIn(['STUDENT', 'INSTRUCTOR', 'ADMIN']).withMessage('Invalid role'),
    query('search').optional().trim().isLength({ max: 100 }).withMessage('Search query too long')
  ],
  validateRequest,
  getAllUsers
);

router.get('/:id', 
  authorize(UserRole.ADMIN), 
  [param('id').isString().notEmpty().withMessage('User ID is required')],
  validateRequest,
  getUserById
);

router.patch('/:id/role', 
  authorize(UserRole.ADMIN), 
  [
    param('id').isString().notEmpty().withMessage('User ID is required'),
    query('role').isIn(['STUDENT', 'INSTRUCTOR', 'ADMIN']).withMessage('Invalid role')
  ],
  validateRequest,
  updateUserRole
);

router.patch('/:id/deactivate', 
  authorize(UserRole.ADMIN), 
  [param('id').isString().notEmpty().withMessage('User ID is required')],
  validateRequest,
  deactivateUser
);

router.get('/:id/stats', 
  authorize(UserRole.ADMIN), 
  [param('id').isString().notEmpty().withMessage('User ID is required')],
  validateRequest,
  getUserStats
);

export default router;

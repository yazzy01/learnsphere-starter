import express from 'express';
import { param } from 'express-validator';
import {
  generateCertificate,
  downloadCertificate,
  getUserCertificates,
  deleteCertificate
} from '@/controllers/certificateController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All certificate routes require authentication
router.use(authenticate);

// Parameter validation
const certificateIdValidation = [
  param('certificateId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Certificate ID is required')
];

// Generate certificate for completed course
router.post('/generate/:enrollmentId', 
  [param('enrollmentId').isString().notEmpty().withMessage('Enrollment ID is required')],
  validateRequest,
  generateCertificate
);

// Download certificate
router.get('/:certificateId/download', 
  certificateIdValidation,
  validateRequest,
  downloadCertificate
);

// Get user's certificates
router.get('/my-certificates', getUserCertificates);

// Delete certificate (admin only)
router.delete('/:certificateId', 
  authorize(UserRole.ADMIN),
  certificateIdValidation,
  validateRequest,
  deleteCertificate
);

export default router;

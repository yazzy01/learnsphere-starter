import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';
import { CertificateService, CertificateData } from '@/services/certificateService';

// Generate certificate for completed course
export const generateCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user!.id;

    // Get enrollment with course and instructor data
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Enrollment not found' }
      });
    }

    // Check if user owns this enrollment
    if (enrollment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only generate certificates for your own enrollments' }
      });
    }

    // Check if course is completed
    if (!enrollment.isCompleted) {
      return res.status(400).json({
        success: false,
        error: { message: 'Course must be completed to generate certificate' }
      });
    }

    // Check if certificate already exists
    let certificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: enrollment.courseId
        }
      }
    });

    // If no certificate exists, create one
    if (!certificate) {
      certificate = await prisma.certificate.create({
        data: {
          userId,
          courseId: enrollment.courseId
        }
      });
    }

    // Prepare certificate data
    const certificateData: CertificateData = {
      student: {
        name: enrollment.user.name,
        email: enrollment.user.email
      },
      course: {
        title: enrollment.course.title,
        instructor: enrollment.course.instructor.name
      },
      completionDate: enrollment.completedAt || new Date(),
      certificateId: certificate.id
    };

    // Generate PDF certificate
    const filePath = await CertificateService.generateCertificate(certificateData);
    
    // Update certificate with file URL
    const certificateUrl = CertificateService.getCertificateUrl(certificate.id);
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: { certificateUrl }
    });

    res.json({
      success: true,
      data: { 
        certificate: {
          ...certificate,
          certificateUrl
        }
      },
      message: 'Certificate generated successfully'
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate certificate' }
    });
  }
};

// Download certificate PDF
export const downloadCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { certificateId } = req.params;

    // Get certificate and verify ownership
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: {
          select: { name: true }
        },
        course: {
          select: { title: true }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Certificate not found' }
      });
    }

    // Check if user owns this certificate (or is admin)
    if (certificate.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only download your own certificates' }
      });
    }

    // Construct file path
    const fileName = `certificate-${certificateId}.pdf`;
    const filePath = path.join(process.cwd(), 'certificates', fileName);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: { message: 'Certificate file not found' }
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="SmartLearn_Certificate_${certificate.user.name.replace(/\s+/g, '_')}.pdf"`);

    // Send file
    res.sendFile(filePath, (error) => {
      if (error) {
        console.error('Error sending certificate file:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: { message: 'Failed to download certificate' }
          });
        }
      }
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to download certificate' }
    });
  }
};

// Get user's certificates
export const getUserCertificates = async (req: AuthRequest, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user!.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: { certificates }
    });
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch certificates' }
    });
  }
};

// Delete certificate (admin only)
export const deleteCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { certificateId } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Certificate not found' }
      });
    }

    // Delete certificate file
    await CertificateService.deleteCertificate(certificateId);

    // Delete certificate record
    await prisma.certificate.delete({
      where: { id: certificateId }
    });

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete certificate' }
    });
  }
};

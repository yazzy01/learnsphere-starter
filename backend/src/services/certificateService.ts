import PDFDocument from 'pdfkit';
import { createWriteStream, promises as fs } from 'fs';
import path from 'path';
import { User, Course } from '@prisma/client';

export interface CertificateData {
  student: {
    name: string;
    email: string;
  };
  course: {
    title: string;
    instructor: string;
  };
  completionDate: Date;
  certificateId: string;
}

export class CertificateService {
  private static certificatesDir = path.join(process.cwd(), 'certificates');

  static async ensureCertificatesDir() {
    try {
      await fs.access(this.certificatesDir);
    } catch {
      await fs.mkdir(this.certificatesDir, { recursive: true });
    }
  }

  static async generateCertificate(data: CertificateData): Promise<string> {
    await this.ensureCertificatesDir();

    const fileName = `certificate-${data.certificateId}.pdf`;
    const filePath = path.join(this.certificatesDir, fileName);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          layout: 'landscape',
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Create write stream
        const stream = createWriteStream(filePath);
        doc.pipe(stream);

        // Certificate design
        this.designCertificate(doc, data);

        // Finalize the PDF
        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private static designCertificate(doc: PDFKit.PDFDocument, data: CertificateData) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background and border
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
       .strokeColor('#1e40af')
       .lineWidth(3)
       .stroke();

    doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
       .strokeColor('#3b82f6')
       .lineWidth(1)
       .stroke();

    // Header
    doc.fillColor('#1e40af')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('CERTIFICATE OF COMPLETION', 0, 80, {
         align: 'center',
         width: pageWidth
       });

    // SmartLearn logo/title
    doc.fillColor('#3b82f6')
       .fontSize(16)
       .font('Helvetica')
       .text('SmartLearn E-Learning Platform', 0, 120, {
         align: 'center',
         width: pageWidth
       });

    // Decorative line
    doc.moveTo(150, 160)
       .lineTo(pageWidth - 150, 160)
       .strokeColor('#e5e7eb')
       .lineWidth(2)
       .stroke();

    // Main content
    doc.fillColor('#374151')
       .fontSize(18)
       .font('Helvetica')
       .text('This is to certify that', 0, 200, {
         align: 'center',
         width: pageWidth
       });

    // Student name
    doc.fillColor('#1e40af')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text(data.student.name, 0, 240, {
         align: 'center',
         width: pageWidth
       });

    // Course completion text
    doc.fillColor('#374151')
       .fontSize(18)
       .font('Helvetica')
       .text('has successfully completed the course', 0, 300, {
         align: 'center',
         width: pageWidth
       });

    // Course title
    doc.fillColor('#1e40af')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text(data.course.title, 0, 340, {
         align: 'center',
         width: pageWidth
       });

    // Instructor
    doc.fillColor('#374151')
       .fontSize(16)
       .font('Helvetica')
       .text(`Instructor: ${data.course.instructor}`, 0, 390, {
         align: 'center',
         width: pageWidth
       });

    // Completion date
    const formattedDate = data.completionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.fillColor('#6b7280')
       .fontSize(14)
       .font('Helvetica')
       .text(`Completed on ${formattedDate}`, 0, 450, {
         align: 'center',
         width: pageWidth
       });

    // Certificate ID
    doc.fillColor('#9ca3af')
       .fontSize(10)
       .font('Helvetica')
       .text(`Certificate ID: ${data.certificateId}`, 0, 480, {
         align: 'center',
         width: pageWidth
       });

    // Footer decorative elements
    doc.moveTo(150, 520)
       .lineTo(pageWidth - 150, 520)
       .strokeColor('#e5e7eb')
       .lineWidth(1)
       .stroke();

    // Signature line (placeholder)
    doc.fillColor('#6b7280')
       .fontSize(12)
       .font('Helvetica')
       .text('SmartLearn Administration', pageWidth - 200, 540);

    doc.moveTo(pageWidth - 200, 555)
       .lineTo(pageWidth - 80, 555)
       .strokeColor('#9ca3af')
       .lineWidth(1)
       .stroke();
  }

  static async deleteCertificate(certificateId: string): Promise<void> {
    const fileName = `certificate-${certificateId}.pdf`;
    const filePath = path.join(this.certificatesDir, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting certificate:', error);
      // Don't throw error if file doesn't exist
    }
  }

  static getCertificateUrl(certificateId: string): string {
    return `/api/certificates/${certificateId}/download`;
  }
}

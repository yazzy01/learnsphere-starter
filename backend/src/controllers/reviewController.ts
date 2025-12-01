import { Request, Response } from 'express';
import prisma from '@/config/database';
import { AuthRequest } from '@/middleware/auth';

interface ReviewQuery {
  page?: string;
  limit?: string;
  rating?: string;
}

// Create a new review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user!.id;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { message: 'Course not found' }
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: { message: 'You must be enrolled in this course to leave a review' }
      });
    }

    // Check if user already reviewed this course
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: { message: 'You have already reviewed this course. Use update instead.' }
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        courseId,
        rating,
        comment: comment?.trim() || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: { review },
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create review' }
    });
  }
};

// Update a review
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Find the review and check ownership
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: { message: 'Review not found' }
      });
    }

    if (existingReview.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only update your own reviews' }
      });
    }

    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment: comment?.trim() || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { review },
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update review' }
    });
  }
};

// Delete a review
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Find the review and check ownership
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: { message: 'Review not found' }
      });
    }

    if (existingReview.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only delete your own reviews' }
      });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete review' }
    });
  }
};

// Get reviews for a course
export const getCourseReviews = async (req: Request<{courseId: string}, {}, {}, ReviewQuery>, res: Response) => {
  try {
    const { courseId } = req.params;
    const {
      page = '1',
      limit = '10',
      rating
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = { courseId };

    if (rating) {
      where.rating = parseInt(rating);
    }

    const [reviews, total, averageRating] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { courseId },
        _avg: {
          rating: true
        },
        _count: {
          rating: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    // Calculate rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { courseId },
      _count: {
        rating: true
      }
    });

    const distribution = Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1;
      const count = ratingDistribution.find(d => d.rating === rating)?._count.rating || 0;
      return {
        rating,
        count,
        percentage: averageRating._count.rating > 0 ? (count / averageRating._count.rating) * 100 : 0
      };
    });

    res.json({
      success: true,
      data: {
        reviews,
        statistics: {
          averageRating: averageRating._avg.rating ? Math.round(averageRating._avg.rating * 10) / 10 : 0,
          totalReviews: averageRating._count.rating,
          distribution
        },
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get course reviews error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch course reviews' }
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req: AuthRequest<{}, {}, {}, ReviewQuery>, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId: req.user!.id },
        skip,
        take: limitNum,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              instructor: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.review.count({ where: { userId: req.user!.id } })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user reviews' }
    });
  }
};

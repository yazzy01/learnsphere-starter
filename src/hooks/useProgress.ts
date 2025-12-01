import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface LessonProgress {
  id: string;
  isCompleted: boolean;
  watchTime: number;
  completedAt: string | null;
  updatedAt: string;
}

interface CourseProgress {
  enrollment: {
    id: string;
    progress: number;
    isCompleted: boolean;
    completedAt: string | null;
  };
  overallProgress: number;
  totalLessons: number;
  completedLessons: number;
  lessons: Array<{
    id: string;
    title: string;
    duration: string;
    type: string;
    order: number;
    isPreview: boolean;
    progress: LessonProgress | null;
  }>;
}

interface LearningStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  totalStudyTimeMinutes: number;
  certificatesEarned: number;
  averageProgress: number;
  recentCourses: Array<{
    id: string;
    progress: number;
    isCompleted: boolean;
    course: {
      id: string;
      title: string;
      thumbnail: string | null;
      category: string;
    };
  }>;
}

export const useProgress = () => {
  const { toast } = useToast();

  // Update lesson progress
  const updateLessonProgress = async (
    lessonId: string,
    data: {
      isCompleted?: boolean;
      watchTime?: number;
      progress?: number;
    }
  ) => {
    try {
      const response = await api.put(`/progress/lessons/${lessonId}/progress`, data);
      return response.data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to update progress",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mark lesson as completed
  const markLessonComplete = async (lessonId: string) => {
    try {
      const response = await api.post(`/progress/lessons/${lessonId}/complete`);
      toast({
        title: "Lesson Completed!",
        description: "Great job! You've completed this lesson.",
      });
      return response.data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to mark lesson as completed",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Get lesson progress
  const getLessonProgress = async (lessonId: string) => {
    try {
      const response = await api.get(`/progress/lessons/${lessonId}/progress`);
      return response.data.data.progress;
    } catch (error: any) {
      console.error('Failed to get lesson progress:', error);
      return null;
    }
  };

  // Get course progress
  const getCourseProgress = async (courseId: string): Promise<CourseProgress | null> => {
    try {
      const response = await api.get(`/progress/courses/${courseId}/progress`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get course progress:', error);
      return null;
    }
  };

  // Get user learning statistics
  const getLearningStats = async (): Promise<LearningStats | null> => {
    try {
      const response = await api.get('/progress/stats');
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get learning stats:', error);
      return null;
    }
  };

  return {
    updateLessonProgress,
    markLessonComplete,
    getLessonProgress,
    getCourseProgress,
    getLearningStats,
  };
};

// Hook for course-specific progress tracking
export const useCourseProgress = (courseId: string) => {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCourseProgress } = useProgress();

  const refreshProgress = async () => {
    setLoading(true);
    try {
      const data = await getCourseProgress(courseId);
      setProgress(data);
    } catch (error) {
      console.error('Failed to refresh course progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      refreshProgress();
    }
  }, [courseId]);

  return {
    progress,
    loading,
    refreshProgress,
  };
};

// Hook for lesson-specific progress tracking
export const useLessonProgress = (lessonId: string) => {
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { getLessonProgress, updateLessonProgress, markLessonComplete } = useProgress();

  const refreshProgress = async () => {
    if (!lessonId) return;
    
    setLoading(true);
    try {
      const data = await getLessonProgress(lessonId);
      setProgress(data);
    } catch (error) {
      console.error('Failed to refresh lesson progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (data: {
    isCompleted?: boolean;
    watchTime?: number;
    progress?: number;
  }) => {
    try {
      await updateLessonProgress(lessonId, data);
      await refreshProgress();
    } catch (error) {
      console.error('Failed to update lesson progress:', error);
    }
  };

  const completeLesson = async () => {
    try {
      await markLessonComplete(lessonId);
      await refreshProgress();
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  useEffect(() => {
    if (lessonId) {
      refreshProgress();
    }
  }, [lessonId]);

  return {
    progress,
    loading,
    updateProgress,
    completeLesson,
    refreshProgress,
  };
};

// Hook for user learning statistics
export const useLearningStats = () => {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { getLearningStats } = useProgress();

  const refreshStats = async () => {
    setLoading(true);
    try {
      const data = await getLearningStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to refresh learning stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return {
    stats,
    loading,
    refreshStats,
  };
};

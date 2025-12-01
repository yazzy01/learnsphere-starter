import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies (refresh tokens)
});

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAccessToken = () => accessToken;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post('/auth/refresh-token');
        const { accessToken: newToken } = refreshResponse.data.data;
        
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        setAccessToken(null);
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'STUDENT' | 'INSTRUCTOR';
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  category: string;
  level: string;
  duration?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'ARCHIVED';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  studentsCount: number;
  reviewsCount: number;
  lessonsCount: number;
  rating: number;
}

export interface CourseQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Enrollment Types
export interface Enrollment {
  id: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  isCompleted: boolean;
  course: Course;
}

// Review Types
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// API Functions

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; accessToken: string }> => {
    const response: AxiosResponse<ApiResponse<{ user: User; accessToken: string }>> = 
      await api.post('/auth/login', credentials);
    return response.data.data!;
  },

  register: async (userData: RegisterData): Promise<{ user: User; accessToken: string }> => {
    const response: AxiosResponse<ApiResponse<{ user: User; accessToken: string }>> = 
      await api.post('/auth/register', userData);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = 
      await api.get('/auth/profile');
    return response.data.data!.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = 
      await api.put('/auth/profile', data);
    return response.data.data!.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.put('/auth/change-password', data);
  },

  refreshToken: async (): Promise<{ accessToken: string; user: User }> => {
    const response: AxiosResponse<ApiResponse<{ accessToken: string; user: User }>> = 
      await api.post('/auth/refresh-token');
    return response.data.data!;
  }
};

// Course API
export const courseApi = {
  getAllCourses: async (query: CourseQuery = {}): Promise<PaginatedResponse<Course>> => {
    const response: AxiosResponse<ApiResponse<{ courses: Course[]; pagination: any }>> = 
      await api.get('/courses', { params: query });
    return {
      items: response.data.data!.courses,
      pagination: response.data.data!.pagination
    };
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response: AxiosResponse<ApiResponse<{ course: Course }>> = 
      await api.get(`/courses/${id}`);
    return response.data.data!.course;
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    const response: AxiosResponse<ApiResponse<{ course: Course }>> = 
      await api.post('/courses', courseData);
    return response.data.data!.course;
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    const response: AxiosResponse<ApiResponse<{ course: Course }>> = 
      await api.put(`/courses/${id}`, courseData);
    return response.data.data!.course;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  getInstructorCourses: async (): Promise<Course[]> => {
    const response: AxiosResponse<ApiResponse<{ courses: Course[] }>> = 
      await api.get('/courses/instructor/my-courses');
    return response.data.data!.courses;
  },

  publishCourse: async (id: string, action: 'publish' | 'unpublish'): Promise<Course> => {
    const response: AxiosResponse<ApiResponse<{ course: Course }>> = 
      await api.patch(`/courses/${id}/publish`, { action });
    return response.data.data!.course;
  }
};

// Enrollment API
export const enrollmentApi = {
  enrollInCourse: async (courseId: string): Promise<Enrollment> => {
    const response: AxiosResponse<ApiResponse<{ enrollment: Enrollment }>> = 
      await api.post('/enrollments/enroll', { courseId });
    return response.data.data!.enrollment;
  },

  getUserEnrollments: async (query: { page?: number; limit?: number; status?: string } = {}): Promise<PaginatedResponse<Enrollment>> => {
    const response: AxiosResponse<ApiResponse<{ enrollments: Enrollment[]; pagination: any }>> = 
      await api.get('/enrollments/my-enrollments', { params: query });
    return {
      items: response.data.data!.enrollments,
      pagination: response.data.data!.pagination
    };
  },

  updateProgress: async (enrollmentId: string, progress: number): Promise<Enrollment> => {
    const response: AxiosResponse<ApiResponse<{ enrollment: Enrollment }>> = 
      await api.patch(`/enrollments/${enrollmentId}/progress`, { progress });
    return response.data.data!.enrollment;
  },

  completeCourse: async (enrollmentId: string): Promise<Enrollment> => {
    const response: AxiosResponse<ApiResponse<{ enrollment: Enrollment }>> = 
      await api.patch(`/enrollments/${enrollmentId}/complete`);
    return response.data.data!.enrollment;
  }
};

// Review API
export const reviewApi = {
  createReview: async (data: { courseId: string; rating: number; comment?: string }): Promise<Review> => {
    const response: AxiosResponse<ApiResponse<{ review: Review }>> = 
      await api.post('/reviews', data);
    return response.data.data!.review;
  },

  updateReview: async (id: string, data: { rating: number; comment?: string }): Promise<Review> => {
    const response: AxiosResponse<ApiResponse<{ review: Review }>> = 
      await api.put(`/reviews/${id}`, data);
    return response.data.data!.review;
  },

  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },

  getCourseReviews: async (courseId: string, query: { page?: number; limit?: number; rating?: number } = {}): Promise<PaginatedResponse<Review>> => {
    const response: AxiosResponse<ApiResponse<{ reviews: Review[]; pagination: any }>> = 
      await api.get(`/reviews/course/${courseId}`, { params: query });
    return {
      items: response.data.data!.reviews,
      pagination: response.data.data!.pagination
    };
  },

  getUserReviews: async (query: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Review>> => {
    const response: AxiosResponse<ApiResponse<{ reviews: Review[]; pagination: any }>> = 
      await api.get('/reviews/my-reviews', { params: query });
    return {
      items: response.data.data!.reviews,
      pagination: response.data.data!.pagination
    };
  }
};

export default api;

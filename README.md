# 🎓 SmartLearn - E-Learning Platform

A modern, full-stack e-learning platform built with React, Node.js, and PostgreSQL. SmartLearn enables students to discover and enroll in courses while providing instructors with tools to create and manage educational content.

## ✨ Features

### 🎯 Phase 1 - MVP (COMPLETED)

#### Authentication & Authorization
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (Student, Instructor, Admin)
- ✅ Secure password hashing and validation
- ✅ User registration and login with role selection

#### Course Management
- ✅ Complete CRUD operations for courses
- ✅ Course publishing workflow (Draft → Published)
- ✅ Rich course information (title, description, pricing, categories)
- ✅ Course search and filtering by category, level, price range
- ✅ Instructor course ownership and management

#### Student Features
- ✅ Course browsing and detailed course pages
- ✅ Course enrollment system
- ✅ Progress tracking per course
- ✅ Student dashboard with enrolled courses
- ✅ Course reviews and ratings

#### Dashboard Systems
- ✅ Role-based dashboards
- ✅ Student: Track enrolled courses, progress, and certificates
- ✅ Instructor: Manage courses, view analytics, student enrollments
- ✅ Admin: User and course management capabilities

#### UI/UX
- ✅ Responsive design for all screen sizes
- ✅ Modern shadcn/ui component library
- ✅ Professional landing page with hero section
- ✅ Clean navigation and user experience
- ✅ Toast notifications for user feedback

### 🚀 Upcoming Phase 2 Features

- Progress tracking with lesson completion
- Certificate generation (PDF export)
- Advanced instructor analytics
- Multiple lesson types (video, PDF, quizzes)
- Admin dashboard for platform management
- Course approval workflow
- Enhanced UI with charts and animations

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Context + React Query
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs, rate limiting

### DevOps
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Render/Heroku
- **Database**: PostgreSQL (production)
- **Version Control**: Git

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smartlearn
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials and JWT secrets

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start backend server
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 3. Frontend Setup
```bash
# Navigate to frontend (from project root)
cd learnsphere-starter-main

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🧪 Test Accounts

Use these accounts to test different user roles:

- **Admin**: admin@smartlearn.com / Admin123!
- **Instructor**: instructor1@smartlearn.com / Instructor123!
- **Student**: student1@smartlearn.com / Student123!

## 📁 Project Structure

```
smartlearn/
├── learnsphere-starter-main/     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── contexts/            # React contexts (Auth)
│   │   ├── lib/                 # Utilities and API client
│   │   └── hooks/               # Custom React hooks
│   ├── public/                  # Static assets
│   └── package.json
│
├── backend/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── routes/              # Express routes
│   │   ├── middleware/          # Custom middleware
│   │   ├── utils/               # Utility functions
│   │   ├── config/              # Configuration files
│   │   └── prisma/              # Database schema and seed
│   └── package.json
│
└── README.md                    # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - List published courses (public)
- `GET /api/courses/:id` - Get course details (public)
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course (instructor/admin)
- `DELETE /api/courses/:id` - Delete course (instructor/admin)

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in course
- `GET /api/enrollments/my-enrollments` - Get user enrollments
- `PATCH /api/enrollments/:id/progress` - Update progress

### Reviews
- `POST /api/reviews` - Create course review
- `GET /api/reviews/course/:courseId` - Get course reviews

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`
3. Deploy automatically on git push

### Backend (Render/Heroku)
1. Create a new web service
2. Set environment variables (see backend/env.example)
3. Use the provided Procfile and render.yaml for configuration

## 🔧 Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Conventional commits for git messages

### Key Commands
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter

# Backend
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Frontend
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend
```env
DATABASE_URL="postgresql://username:password@localhost:5432/smartlearn_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

## 🎯 Phase 1 Achievement Summary

✅ **Complete MVP Implementation**
- Full-stack authentication system
- Course management with CRUD operations
- Student enrollment and progress tracking
- Role-based access control
- Modern, responsive UI
- Production-ready backend API
- Deployment configurations

✅ **Security Features**
- JWT authentication with refresh tokens
- Password hashing and validation
- Rate limiting and CORS protection
- Input validation and sanitization

✅ **Database Design**
- Comprehensive PostgreSQL schema
- Efficient relationships and indexing
- Data seeding for development

The platform is now ready for Phase 2 development with advanced features like lesson management, certificate generation, and enhanced analytics.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@smartlearn.com or create an issue on GitHub.

---

**🎉 SmartLearn Phase 1 Complete!** 
Ready to transform online education with our modern e-learning platform.
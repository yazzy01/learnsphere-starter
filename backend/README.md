# SmartLearn Backend API

A robust Node.js/Express backend for the SmartLearn e-learning platform with PostgreSQL database and Prisma ORM.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Student, Instructor, Admin)
- **Course Management**: Full CRUD operations for courses and lessons
- **Enrollment System**: Student enrollment and progress tracking
- **Review System**: Course ratings and comments
- **User Management**: Profile management and admin controls
- **Security**: Rate limiting, input validation, password hashing
- **Database**: PostgreSQL with Prisma ORM for type safety

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your database credentials and JWT secrets.

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 🗄️ Database Schema

### Users
- Roles: STUDENT, INSTRUCTOR, ADMIN
- Authentication and profile management

### Courses
- Course management with status (DRAFT, PUBLISHED, etc.)
- Instructor ownership and admin oversight

### Lessons
- Multiple lesson types: VIDEO, TEXT, PDF, QUIZ
- Ordered within courses

### Enrollments
- Student-course relationships
- Progress tracking

### Reviews
- Course ratings and comments
- One review per user per course

### Certificates
- Issued upon course completion

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Courses
- `GET /api/courses` - List all published courses (public)
- `GET /api/courses/:id` - Get course details (public)
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course (instructor/admin)
- `DELETE /api/courses/:id` - Delete course (instructor/admin)
- `GET /api/courses/instructor/my-courses` - Get instructor's courses
- `PATCH /api/courses/:id/publish` - Publish/unpublish course

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in course
- `GET /api/enrollments/my-enrollments` - Get user's enrollments
- `PATCH /api/enrollments/:id/progress` - Update progress
- `PATCH /api/enrollments/:id/complete` - Complete course

### Lessons
- `POST /api/lessons` - Create lesson (instructor/admin)
- `PUT /api/lessons/:id` - Update lesson (instructor/admin)
- `DELETE /api/lessons/:id` - Delete lesson (instructor/admin)
- `PATCH /api/lessons/:id/complete` - Mark lesson complete
- `PATCH /api/lessons/:id/progress` - Update lesson progress

### Reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/course/:courseId` - Get course reviews

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/deactivate` - Deactivate/activate user

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Test Accounts (from seed data)
- **Admin**: admin@smartlearn.com / Admin123!
- **Instructor**: instructor1@smartlearn.com / Instructor123!
- **Student**: student1@smartlearn.com / Student123!

## 🚀 Deployment

### Render/Heroku Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Strong secret for JWT signing
   - `JWT_REFRESH_SECRET`: Strong secret for refresh tokens
   - `NODE_ENV`: "production"
   - `FRONTEND_URL`: Your frontend URL for CORS

3. **Database migration** (run once):
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

### Environment Variables

Required environment variables:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
NODE_ENV="production"
PORT=5000
FRONTEND_URL="https://your-frontend-domain.com"
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Check database with Prisma Studio
npm run db:studio
```

## 📚 API Documentation

The API follows RESTful conventions and returns JSON responses in this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": "Additional error details"
  }
}
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Prisma for all database operations
3. Validate all inputs using express-validator
4. Add proper error handling
5. Follow the existing code structure

## 📄 License

MIT License - see LICENSE file for details.

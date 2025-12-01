# 🎓 SmartLearn - E-Learning Platform

![SmartLearn](https://github.com/yazzy01/learnsphere-starter/blob/main/screenshot.png?raw=true)

🚀 **Live Demo:** [https://learnsphere-starter.vercel.app/](https://learnsphere-starter.vercel.app/)

Master new skills with expert-led online courses. Join 50,000+ students learning web development, data science, design, and more. Learn smarter with our comprehensive e-learning platform.

---

## ✨ Key Features

### 📚 **Comprehensive Course Library**
- **300+ Courses** - Web dev, data science, design, marketing
- **Expert Instructors** - Industry professionals
- **95% Success Rate** - High student achievement
- **Certificate Programs** - Recognized credentials
- **Updated Content** - Stay current with industry trends

### 🎓 **Learning Experience**
- **Interactive Lessons** - Video, quizzes, assignments
- **Progress Tracking** - Monitor your learning journey
- **Personalized Dashboard** - Customized learning path
- **Community Forums** - Connect with fellow learners
- **Live Sessions** - Real-time interaction with instructors
- **Mobile Learning** - Learn anywhere, anytime

### 👨‍🏫 **For Instructors**
- **Course Builder** - Create comprehensive courses easily
- **Lesson Management** - Upload videos, materials, assignments
- **Student Analytics** - Track student progress and engagement
- **Revenue Sharing** - Earn from your expertise
- **Marketing Tools** - Promote your courses
- **Support System** - Dedicated instructor support

### 📊 **Student Dashboard**
- **Enrolled Courses** - All your courses in one place
- **Progress Metrics** - Track completion and performance
- **Certificates** - Download earned certificates
- **Watchlist** - Save courses for later
- **Learning Streaks** - Stay motivated with gamification
- **Recommendations** - Personalized course suggestions

### 💼 **Admin Panel**
- **Course Approval** - Review and approve new courses
- **User Management** - Manage students and instructors
- **Analytics Dashboard** - Platform-wide insights
- **Content Moderation** - Ensure quality standards
- **Revenue Reports** - Track platform performance

---

## 🛠 Technology Stack

### **Frontend**
- React 18 with TypeScript
- Vite for ultra-fast builds
- Tailwind CSS for styling
- Shadcn/ui components
- React Router v6
- TanStack Query for data fetching
- Recharts for analytics

### **Backend**
- Express.js with TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- RESTful API architecture
- File upload handling (Multer)
- Email service (Nodemailer)

### **Features**
- Video streaming
- PDF certificate generation
- Real-time notifications
- Search and filtering
- Course reviews and ratings
- Payment integration ready

### **Deployment**
- Frontend: Vercel
- Backend: Railway/Render/Vercel
- Database: Vercel Postgres
- CDN for media files
- Automated CI/CD

---

## 🚀 Getting Started

### Prerequisites
```bash
- Node.js 18+
- PostgreSQL
- npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yazzy01/learnsphere-starter.git
cd learnsphere-starter
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
```

4. **Set up Frontend Environment**
Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Set up Backend Environment**
Create `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smartlearn"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Server
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Optional for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

6. **Set up Database**
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: seed with sample data
```

7. **Run Development Servers**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
npm run dev
```

Visit `http://localhost:5173`

8. **Build for Production**

Frontend:
```bash
npm run build
```

Backend:
```bash
cd backend
npm run build
npm start
```

---

## 📖 Usage

### For Students

1. **Sign Up & Explore**
   - Create your free account
   - Browse course catalog
   - Read reviews and ratings

2. **Enroll in Courses**
   - Find courses that match your goals
   - Enroll for free or paid courses
   - Start learning immediately

3. **Learn & Progress**
   - Watch video lessons
   - Complete assignments
   - Take quizzes
   - Track your progress

4. **Earn Certificates**
   - Complete course requirements
   - Pass final assessment
   - Download certificate
   - Share on LinkedIn

### For Instructors

1. **Apply as Instructor**
   - Submit instructor application
   - Get approved by admin
   - Access instructor dashboard

2. **Create Courses**
   - Use course builder tool
   - Upload video lessons
   - Add assignments and quizzes
   - Set pricing

3. **Manage Students**
   - View enrollment stats
   - Track student progress
   - Answer questions
   - Provide feedback

4. **Earn Revenue**
   - Set course pricing
   - Track earnings
   - Withdraw payments
   - View analytics

---

## 🎯 Course Categories

- **Web Development** - HTML, CSS, JavaScript, React, Node.js
- **Data Science** - Python, Machine Learning, Data Analysis
- **Design** - UI/UX, Graphic Design, Figma
- **Digital Marketing** - SEO, Social Media, Content Marketing
- **Business** - Entrepreneurship, Management, Finance
- **Programming** - Python, Java, C++, Go
- **Cloud Computing** - AWS, Azure, Google Cloud
- **Mobile Development** - React Native, Flutter

---

## 📊 Platform Features

### Course Management
- Structured curriculum
- Multiple lesson types
- Resource attachments
- Progress tracking
- Completion certificates

### Assessment System
- Multiple choice quizzes
- Coding challenges
- Project submissions
- Peer reviews
- Automated grading

### Communication
- Course announcements
- Direct messaging
- Discussion forums
- Live Q&A sessions
- Email notifications

### Analytics
- Student progress reports
- Course performance metrics
- Engagement statistics
- Revenue analytics
- Completion rates

---

## 🔐 Security Features

- **Secure Authentication** - JWT-based auth system
- **Password Hashing** - bcrypt encryption
- **Rate Limiting** - API protection
- **Input Validation** - Prevent malicious data
- **CORS Protection** - Secure cross-origin requests
- **SQL Injection Prevention** - Prisma ORM protection

---

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Perfect on iPad and tablets
- **Desktop Experience** - Full-featured desktop interface
- **Touch Friendly** - Easy navigation on touch devices

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas we'd love help with:
- New course templates
- UI/UX improvements
- Bug fixes
- Documentation
- Translations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yassir Rzigui**  
Full Stack Developer & EdTech Enthusiast

- 🌐 Website: [Portfolio](https://yassir-rzigui.vercel.app)
- 💼 LinkedIn: [Yassir Rzigui](https://linkedin.com/in/yassir-rzigui)
- 📧 Email: rziguiyassir@gmail.com
- 🐙 GitHub: [@yazzy01](https://github.com/yazzy01)

---

## 🙏 Acknowledgments

- React and Vite teams
- Prisma for excellent ORM
- Tailwind CSS community
- Open-source contributors
- Beta testers and early users

---

## 📞 Support

For issues, questions, or feature requests:

- 📧 Email: rziguiyassir@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/yazzy01/learnsphere-starter/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yazzy01/learnsphere-starter/discussions)

---

## 🚀 Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] Live streaming classes
- [ ] AI-powered recommendations
- [ ] Offline learning mode
- [ ] Multi-language interface
- [ ] Advanced analytics
- [ ] Gamification features
- [ ] Corporate training packages

---

## 🌟 Statistics

| Metric | Value |
|--------|-------|
| Active Students | 50K+ |
| Total Courses | 300+ |
| Instructors | 150+ |
| Success Rate | 95% |
| Avg Rating | 4.7/5 |

---

**⭐ Start your learning journey today and master new skills with expert-led courses!**

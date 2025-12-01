import { PrismaClient, UserRole, CourseStatus, LessonType } from '@prisma/client';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const adminPassword = await hashPassword('Admin123!');
  const instructorPassword = await hashPassword('Instructor123!');
  const studentPassword = await hashPassword('Student123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartlearn.com' },
    update: {},
    create: {
      email: 'admin@smartlearn.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      bio: 'Platform administrator'
    }
  });

  const instructor1 = await prisma.user.upsert({
    where: { email: 'instructor1@smartlearn.com' },
    update: {},
    create: {
      email: 'instructor1@smartlearn.com',
      name: 'Dr. Angela Yu',
      password: instructorPassword,
      role: UserRole.INSTRUCTOR,
      bio: 'Lead iOS Instructor at London App Brewery, Code Bootcamp. Former physician, self-taught programmer with passion for teaching.'
    }
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'instructor2@smartlearn.com' },
    update: {},
    create: {
      email: 'instructor2@smartlearn.com',
      name: 'Maximilian Schwarzmüller',
      password: instructorPassword,
      role: UserRole.INSTRUCTOR,
      bio: 'Professional web developer and instructor. Passionate about teaching and helping others learn to code.'
    }
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@smartlearn.com' },
    update: {},
    create: {
      email: 'student1@smartlearn.com',
      name: 'John Doe',
      password: studentPassword,
      role: UserRole.STUDENT,
      bio: 'Aspiring web developer'
    }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@smartlearn.com' },
    update: {},
    create: {
      email: 'student2@smartlearn.com',
      name: 'Jane Smith',
      password: studentPassword,
      role: UserRole.STUDENT,
      bio: 'Learning data science'
    }
  });

  console.log('✅ Users created');

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course1' },
    update: {},
    create: {
      id: 'course1',
      title: 'The Complete Web Development Bootcamp 2024',
      description: 'Master HTML, CSS, JavaScript, Node.js, React, MongoDB and Web3 development. Build 32+ projects and become a full-stack web developer.',
      longDescription: 'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps. This is the only course you need to learn web development - HTML, CSS, JS, Node, and More! Created by Angela Yu, London\'s lead iOS Instructor.',
      price: 84.99,
      originalPrice: 199.99,
      category: 'Web Development',
      level: 'Beginner',
      duration: '61.5 hours',
      status: CourseStatus.PUBLISHED,
      isPublished: true,
      instructorId: instructor1.id
    }
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course2' },
    update: {},
    create: {
      id: 'course2',
      title: 'React - The Complete Guide 2024',
      description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
      longDescription: 'Master React from the ground up with this comprehensive course. You\'ll learn React, Hooks, Redux, React Router, Animations, Next.js and much more!',
      price: 94.99,
      originalPrice: 199.99,
      category: 'Web Development',
      level: 'Intermediate',
      duration: '48.5 hours',
      status: CourseStatus.PUBLISHED,
      isPublished: true,
      instructorId: instructor2.id
    }
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course3' },
    update: {},
    create: {
      id: 'course3',
      title: '100 Days of Code: Complete Python Pro Bootcamp',
      description: 'Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!',
      longDescription: 'Welcome to the 100 Days of Code - The Complete Python Pro Bootcamp, the only course you need to learn to code with Python. With over 500,000 5 STAR reviews and a 4.8 average, my courses are some of the HIGHEST RATED courses in the history of Udemy!',
      price: 89.99,
      originalPrice: 199.99,
      category: 'Programming',
      level: 'Beginner',
      duration: '58 hours',
      status: CourseStatus.PUBLISHED,
      isPublished: true,
      instructorId: instructor1.id
    }
  });

  console.log('✅ Courses created');

  // Create lessons for course1
  const lesson1_1 = await prisma.lesson.upsert({
    where: { id: 'lesson1_1' },
    update: {},
    create: {
      id: 'lesson1_1',
      title: 'Welcome to the Complete Web Development Bootcamp',
      description: 'Introduction to the course and what you will learn',
      content: 'Welcome to the most comprehensive web development course on the internet! In this course, you will learn everything you need to become a full-stack web developer.',
      duration: '15 minutes',
      order: 1,
      type: LessonType.VIDEO,
      isPreview: true,
      courseId: course1.id
    }
  });

  const lesson1_2 = await prisma.lesson.upsert({
    where: { id: 'lesson1_2' },
    update: {},
    create: {
      id: 'lesson1_2',
      title: 'How the Internet Works',
      description: 'Understanding the fundamentals of how the internet works',
      content: 'Before we dive into building websites, it\'s important to understand how the internet works. In this lesson, we\'ll cover the basics of client-server architecture, HTTP, and more.',
      duration: '25 minutes',
      order: 2,
      type: LessonType.VIDEO,
      isPreview: false,
      courseId: course1.id
    }
  });

  const lesson1_3 = await prisma.lesson.upsert({
    where: { id: 'lesson1_3' },
    update: {},
    create: {
      id: 'lesson1_3',
      title: 'Introduction to HTML',
      description: 'Your first steps into HTML',
      content: 'HTML (HyperText Markup Language) is the foundation of every web page. In this lesson, you\'ll learn the basic HTML tags and structure.',
      duration: '45 minutes',
      order: 3,
      type: LessonType.VIDEO,
      isPreview: false,
      courseId: course1.id
    }
  });

  // Create lessons for course2
  const lesson2_1 = await prisma.lesson.upsert({
    where: { id: 'lesson2_1' },
    update: {},
    create: {
      id: 'lesson2_1',
      title: 'What is React?',
      description: 'Introduction to React and why it\'s popular',
      content: 'React is a JavaScript library for building user interfaces. It was created by Facebook and has become one of the most popular frontend frameworks.',
      duration: '20 minutes',
      order: 1,
      type: LessonType.VIDEO,
      isPreview: true,
      courseId: course2.id
    }
  });

  const lesson2_2 = await prisma.lesson.upsert({
    where: { id: 'lesson2_2' },
    update: {},
    create: {
      id: 'lesson2_2',
      title: 'Setting Up Your Development Environment',
      description: 'Installing Node.js, npm, and creating your first React app',
      content: 'Before we can start building React applications, we need to set up our development environment. We\'ll install Node.js, npm, and use Create React App.',
      duration: '30 minutes',
      order: 2,
      type: LessonType.VIDEO,
      isPreview: false,
      courseId: course2.id
    }
  });

  console.log('✅ Lessons created');

  // Create enrollments
  const enrollment1 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course1.id,
      progress: 65.0
    }
  });

  const enrollment2 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course2.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course2.id,
      progress: 30.0
    }
  });

  const enrollment3 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course1.id,
      progress: 90.0,
      isCompleted: true,
      completedAt: new Date()
    }
  });

  console.log('✅ Enrollments created');

  // Create lesson progress
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson1_1.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson1_1.id,
      isCompleted: true,
      completedAt: new Date(),
      watchTime: 900 // 15 minutes in seconds
    }
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson1_2.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson1_2.id,
      isCompleted: true,
      completedAt: new Date(),
      watchTime: 1500 // 25 minutes in seconds
    }
  });

  console.log('✅ Lesson progress created');

  // Create reviews
  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course1.id,
      rating: 5,
      comment: 'Excellent course! Really helped me understand web development fundamentals. Angela is a great instructor!'
    }
  });

  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course1.id,
      rating: 4,
      comment: 'Great content and very comprehensive. Would recommend to anyone starting in web development.'
    }
  });

  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course2.id
      }
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course2.id,
      rating: 5,
      comment: 'Maximilian explains React concepts very clearly. This course is perfect for intermediate developers.'
    }
  });

  console.log('✅ Reviews created');

  // Create certificate for completed course
  await prisma.certificate.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course1.id
    }
  });

  console.log('✅ Certificate created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin@smartlearn.com / Admin123!');
  console.log('Instructor 1: instructor1@smartlearn.com / Instructor123!');
  console.log('Instructor 2: instructor2@smartlearn.com / Instructor123!');
  console.log('Student 1: student1@smartlearn.com / Student123!');
  console.log('Student 2: student2@smartlearn.com / Student123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

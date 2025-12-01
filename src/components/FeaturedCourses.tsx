import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedCourses = () => {
  // Real course data inspired by popular Udemy/Coursera courses
  const featuredCourses = [
    {
      id: "1",
      title: "The Complete Web Development Bootcamp 2024",
      description: "Master HTML, CSS, JavaScript, Node.js, React, MongoDB and Web3 development. Build 32+ projects and become a full-stack web developer.",
      instructor: "Dr. Angela Yu",
      price: 84.99,
      originalPrice: 199.99,
      rating: 4.7,
      studentsCount: 893240,
      duration: "61.5 hours",
      level: "Beginner" as const,
      category: "Web Development",
    },
    {
      id: "2",
      title: "100 Days of Code: Complete Python Pro Bootcamp",
      description: "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
      instructor: "Dr. Angela Yu",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.7,
      studentsCount: 756890,
      duration: "58 hours",
      level: "Beginner" as const,
      category: "Programming",
    },
    {
      id: "3",
      title: "React - The Complete Guide 2024",
      description: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
      instructor: "Maximilian Schwarzmüller",
      price: 94.99,
      originalPrice: 199.99,
      rating: 4.6,
      studentsCount: 567430,
      duration: "48.5 hours",
      level: "Intermediate" as const,
      category: "Web Development",
    },
    {
      id: "4",
      title: "The Web Developer Bootcamp 2024",
      description: "The only course you need to learn web development - HTML, CSS, JS, Node, and More! Created by Colt Steele.",
      instructor: "Colt Steele",
      price: 79.99,
      originalPrice: 189.99,
      rating: 4.7,
      studentsCount: 945820,
      duration: "63.5 hours",
      level: "Beginner" as const,
      category: "Web Development",
    },
    {
      id: "5",
      title: "Machine Learning A-Z: AI, Python & R",
      description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.",
      instructor: "Kirill Eremenko",
      price: 94.99,
      originalPrice: 199.99,
      rating: 4.5,
      studentsCount: 1234560,
      duration: "44 hours",
      level: "Intermediate" as const,
      category: "Data Science",
    },
    {
      id: "6",
      title: "The Complete Digital Marketing Course - 12 Courses in 1",
      description: "Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!",
      instructor: "Rob Percival",
      price: 84.99,
      originalPrice: 199.99,
      rating: 4.4,
      studentsCount: 434920,
      duration: "36 hours",
      level: "Beginner" as const,
      category: "Marketing",
    },
    {
      id: "7",
      title: "Complete C# Unity Game Developer 2D",
      description: "Learn Unity in C# & Code Your First Five 2D Video Games for Web, Mac & PC. The Tutorials Cover Tilemap.",
      instructor: "Ben Tristem",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.6,
      studentsCount: 245670,
      duration: "27.5 hours",
      level: "Beginner" as const,
      category: "Game Development",
    },
    {
      id: "8",
      title: "AWS Certified Solutions Architect - Associate 2024",
      description: "Pass the AWS Certified Solutions Architect Associate Certification SAA-C03. Complete Amazon Web Services Cloud training!",
      instructor: "Stephane Maarek",
      price: 99.99,
      originalPrice: 199.99,
      rating: 4.7,
      studentsCount: 856430,
      duration: "27 hours",
      level: "Advanced" as const,
      category: "Cloud Computing",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular courses taught by industry experts. 
            Start your learning journey with these handpicked selections.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
          >
            View All Courses
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
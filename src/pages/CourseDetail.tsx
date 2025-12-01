import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LessonList from "@/components/lessons/LessonList";
import ReviewsList from "@/components/reviews/ReviewsList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  Download,
  CheckCircle,
  PlayCircle,
  FileText,
  Globe,
  Smartphone,
  ArrowLeft,
  Share,
  Heart,
  BookmarkPlus
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const handleLessonClick = (lesson: any) => {
    console.log("Lesson clicked:", lesson);
    // Implementation for opening lesson player/content
  };

  const handleStartCourse = () => {
    console.log("Start course clicked");
    // Implementation for course enrollment
  };

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    console.log("Review submitted:", data);
    // Implementation for submitting review
  };

  const handleEnrollNow = () => {
    console.log("Enroll now clicked");
    // Implementation for enrollment
  };

  const handleAddToWishlist = () => {
    console.log("Add to wishlist clicked");
    // Implementation for wishlist
  };

  const handleShare = () => {
    console.log("Share clicked");
    // Implementation for sharing
  };

  // In a real app, this would fetch course data based on ID
  const course = {
    id: "1",
    title: "The Complete Web Development Bootcamp 2024",
    description: "Master HTML, CSS, JavaScript, Node.js, React, MongoDB and Web3 development. Build 32+ projects and become a full-stack web developer.",
    longDescription: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps. This is the only course you need to learn web development - HTML, CSS, JS, Node, and More! Created by Angela Yu, London's lead iOS Instructor.",
    instructor: "Dr. Angela Yu",
    instructorBio: "Lead iOS Instructor at London App Brewery, Code Bootcamp. Former physician, self-taught programmer with passion for teaching. Graduated from Imperial College London.",
    price: 84.99,
    originalPrice: 199.99,
    rating: 4.7,
    studentsCount: 893240,
    reviewsCount: 267459,
    duration: "61.5 hours",
    lessons: 397,
    level: "Beginner",
    category: "Web Development",
    lastUpdated: "December 2024",
    language: "English",
    certificate: true,
    features: [
      "61.5 hours on-demand video",
      "397 downloadable resources", 
      "Full lifetime access",
      "Access on mobile and TV",
      "Certificate of completion"
    ],
    whatYouLearn: [
      "Build 32+ websites and web applications",
      "After the course you will be able to build ANY website you want",
      "Build fully-fledged websites and web apps for your startup or business", 
      "Work as a freelance web developer",
      "Master backend development with Node.js",
      "Learn the latest frameworks and technologies",
      "Master frontend development with React",
      "Learn Web3 development on the Internet Computer"
    ],
    curriculum: [
      {
        id: "section1",
        title: "Front-End Web Development",
        totalDuration: "12 hours",
        completedLessons: 5,
        lessons: [
          {
            id: "lesson1",
            title: "Introduction to HTML5",
            description: "Learn the basics of HTML5 and semantic markup",
            duration: "25 min",
            order: 1,
            type: "VIDEO" as const,
            isPreview: true,
            isCompleted: true,
            progress: 100
          },
          {
            id: "lesson2", 
            title: "CSS3 Fundamentals",
            description: "Styling with modern CSS3",
            duration: "35 min",
            order: 2,
            type: "VIDEO" as const,
            isPreview: false,
            isCompleted: true,
            progress: 100
          },
          {
            id: "lesson3",
            title: "Flexbox Layout",
            description: "Master flexbox for responsive layouts",
            duration: "40 min",
            order: 3,
            type: "VIDEO" as const,
            isPreview: false,
            isCompleted: false,
            progress: 60
          },
          {
            id: "lesson4",
            title: "CSS Grid System",
            description: "Advanced grid layouts",
            duration: "45 min",
            order: 4,
            type: "VIDEO" as const,
            isPreview: false,
            isCompleted: false,
            progress: 0
          },
          {
            id: "lesson5",
            title: "Responsive Design Principles",
            description: "Download the responsive design guide",
            duration: "15 min",
            order: 5,
            type: "PDF" as const,
            isPreview: false,
            isCompleted: false,
            progress: 0
          }
        ]
      },
      {
        id: "section2",
        title: "JavaScript ES6+",
        totalDuration: "8 hours",
        completedLessons: 2,
        lessons: [
          {
            id: "lesson6",
            title: "JavaScript Fundamentals",
            description: "Variables, functions, and control structures",
            duration: "50 min",
            order: 1,
            type: "VIDEO" as const,
            isPreview: true,
            isCompleted: false,
            progress: 0
          },
          {
            id: "lesson7",
            title: "ES6 Features",
            description: "Arrow functions, destructuring, and more",
            duration: "45 min",
            order: 2,
            type: "VIDEO" as const,
            isPreview: false,
            isCompleted: false,
            progress: 0
          },
          {
            id: "lesson8",
            title: "DOM Manipulation Quiz",
            description: "Test your understanding of DOM manipulation",
            duration: "20 min",
            order: 3,
            type: "QUIZ" as const,
            isPreview: false,
            isCompleted: false,
            progress: 0
          }
        ]
      }
    ],
    reviews: [
      {
        id: "review1",
        rating: 5,
        comment: "Excellent course! Really comprehensive and well-structured. Angela explains everything clearly and the projects are fantastic for building a portfolio.",
        createdAt: "2024-01-20T10:30:00Z",
        user: {
          id: "user1",
          name: "Sarah Johnson",
          avatar: undefined
        },
        helpfulCount: 15,
        isHelpful: false
      },
      {
        id: "review2",
        rating: 4,
        comment: "Great content overall. Some sections could be updated but the fundamentals are solid. Definitely worth the investment.",
        createdAt: "2024-01-18T14:20:00Z",
        user: {
          id: "user2",
          name: "Mike Chen",
          avatar: undefined
        },
        helpfulCount: 8,
        isHelpful: true
      },
      {
        id: "review3",
        rating: 5,
        comment: "This course changed my career! Went from complete beginner to landing my first developer job in 6 months.",
        createdAt: "2024-01-15T09:15:00Z",
        user: {
          id: "user3",
          name: "Emma Wilson",
          avatar: undefined
        },
        helpfulCount: 23,
        isHelpful: false
      }
    ],
    ratingDistribution: [
      { rating: 5, count: 2890, percentage: 65 },
      { rating: 4, count: 980, percentage: 22 },
      { rating: 3, count: 445, percentage: 10 },
      { rating: 2, count: 89, percentage: 2 },
      { rating: 1, count: 45, percentage: 1 }
    ],
    isEnrolled: true // Mock enrollment status
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Link to="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              to="/courses" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Link>
          </div>

          {/* Course Header */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge className="mb-2">{course.category}</Badge>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-muted-foreground">({course.reviewsCount.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.studentsCount.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  Created by <span className="font-medium text-foreground">{course.instructor}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated {course.lastUpdated} • {course.language}
                </p>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
                    <PlayCircle className="h-16 w-16 text-primary" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-3xl font-bold">${course.price}</span>
                    <span className="text-lg text-muted-foreground line-through">${course.originalPrice}</span>
                    <Badge variant="destructive">58% off</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.isEnrolled ? (
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                      onClick={handleStartCourse}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                        onClick={handleEnrollNow}
                      >
                        Enroll Now
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist
                        </Button>
                        <Button variant="outline" size="lg" onClick={handleShare}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </>
                  )}
                  
                  <div className="text-center text-sm text-muted-foreground">
                    30-Day Money-Back Guarantee
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">This course includes:</h4>
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-success mt-1 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.longDescription}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-4">
              <LessonList
                sections={course.curriculum}
                isEnrolled={course.isEnrolled}
                currentUserId={user?.id}
                onLessonClick={handleLessonClick}
                onStartCourse={handleStartCourse}
              />
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <ReviewsList
                reviews={course.reviews}
                averageRating={course.rating}
                totalReviews={course.reviewsCount}
                ratingDistribution={course.ratingDistribution}
                currentUserId={user?.id}
              />
              
              {/* Review Form - only show if enrolled and authenticated */}
              {isAuthenticated && course.isEnrolled && (
                <ReviewForm
                  courseId={course.id}
                  onSubmit={handleReviewSubmit}
                />
              )}
            </TabsContent>

            <TabsContent value="instructor" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <CardTitle>{course.instructor}</CardTitle>
                      <p className="text-muted-foreground">Lead iOS Instructor at London App Brewery</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {course.instructorBio}
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">4.7</div>
                      <div className="text-sm text-muted-foreground">Instructor Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">267,459</div>
                      <div className="text-sm text-muted-foreground">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">893,240</div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;
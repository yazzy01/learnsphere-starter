import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstructorAnalytics from "@/components/InstructorAnalytics";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp, 
  Award, 
  Play,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Download,
  Star
} from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, isStudent, isInstructor, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock student data
  const studentCourses = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      progress: 65,
      totalLessons: 120,
      completedLessons: 78,
      timeSpent: "28 hours",
      nextLesson: "React State Management",
      category: "Web Development"
    },
    {
      id: "2",
      title: "Data Science with Python",
      instructor: "Dr. Sarah Johnson",
      progress: 30,
      totalLessons: 85,
      completedLessons: 26,
      timeSpent: "15 hours",
      nextLesson: "Data Visualization with Matplotlib",
      category: "Data Science"
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      instructor: "Alex Rodriguez",
      progress: 90,
      totalLessons: 60,
      completedLessons: 54,
      timeSpent: "22 hours",
      nextLesson: "User Testing and Feedback",
      category: "Design",
      hasCertificate: true
    }
  ];

  // Mock certificates data
  const certificates = [
    {
      id: "cert1",
      courseTitle: "UI/UX Design Fundamentals",
      instructor: "Alex Rodriguez",
      completionDate: "2024-01-15",
      certificateUrl: "/api/certificates/cert1/download"
    },
    {
      id: "cert2", 
      courseTitle: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      completionDate: "2024-02-20",
      certificateUrl: "/api/certificates/cert2/download"
    }
  ];

  // Mock instructor data
  const instructorCourses = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      students: 15420,
      rating: 4.8,
      revenue: 1372380,
      lessons: 120,
      status: "Published",
      lastUpdated: "2 days ago"
    },
    {
      id: "2",
      title: "Advanced JavaScript Concepts",
      students: 8930,
      rating: 4.9,
      revenue: 803670,
      lessons: 85,
      status: "Published",
      lastUpdated: "1 week ago"
    },
    {
      id: "3",
      title: "React Performance Optimization",
      students: 0,
      rating: 0,
      revenue: 0,
      lessons: 45,
      status: "Draft",
      lastUpdated: "3 days ago"
    }
  ];

  const StudentDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              2 in progress, 1 almost complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-muted-foreground">
              +8 hours this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 more to earn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{course.title}</h4>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">by {course.instructor}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <span>{course.timeSpent}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={course.progress} className="flex-1" />
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next: {course.nextLesson}
                  </p>
                </div>
                
                <div className="flex space-x-2 shrink-0">
                  <Button size="sm">
                    Continue
                  </Button>
                  {course.hasCertificate && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>My Certificates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{certificate.courseTitle}</h4>
                      <p className="text-xs text-muted-foreground mb-2">by {certificate.instructor}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed on {new Date(certificate.completionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const InstructorDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,350</div>
            <p className="text-xs text-muted-foreground">
              +1,234 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$217,605</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 draft in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.85</div>
            <p className="text-xs text-muted-foreground">
              Based on 2,456 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Courses</CardTitle>
          <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {instructorCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{course.title}</h4>
                    <Badge variant={course.status === "Published" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">{course.students.toLocaleString()}</span> students
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{course.rating || "N/A"}</span> rating
                    </div>
                    <div>
                      <span className="font-medium text-foreground">${course.revenue.toLocaleString()}</span> revenue
                    </div>
                    <div>
                      Updated {course.lastUpdated}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back{user ? `, ${user.name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              {isStudent
                ? "Continue your learning journey and track your progress."
                : isInstructor
                ? "Manage your courses and track your teaching performance."
                : isAdmin
                ? "Manage the platform and oversee all activities."
                : "Access your personalized dashboard."
              }
            </p>
          </div>

          {/* Role-based Dashboard */}
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h2>
              <p className="text-muted-foreground mb-6">
                Sign in to view your courses, progress, and analytics.
              </p>
            </div>
          ) : isStudent ? (
            <StudentDashboard />
          ) : isInstructor ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <InstructorDashboard />
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <InstructorAnalytics instructorId={user?.id} />
              </TabsContent>
            </Tabs>
          ) : isAdmin ? (
            <AdminDashboard />
          ) : (
            <StudentDashboard />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
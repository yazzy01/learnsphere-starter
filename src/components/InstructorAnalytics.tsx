import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import EnrollmentChart from "@/components/analytics/EnrollmentChart";
import RevenueChart from "@/components/analytics/RevenueChart";
import StudentProgressChart from "@/components/analytics/StudentProgressChart";
import {
  Users,
  DollarSign,
  TrendingUp,
  BookOpen,
  Star,
  Award,
  Download,
  RefreshCw
} from "lucide-react";

interface InstructorAnalyticsProps {
  instructorId?: string;
}

const InstructorAnalytics = ({ instructorId }: InstructorAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalStudents: 24350,
      totalRevenue: 217605,
      averageRating: 4.85,
      totalCourses: 12,
      trends: {
        students: { value: 12, isPositive: true, label: "vs last month" },
        revenue: { value: 8, isPositive: true, label: "vs last month" },
        rating: { value: 2, isPositive: true, label: "vs last month" },
        courses: { value: 1, isPositive: true, label: "new this month" }
      }
    },
    enrollmentData: [
      { date: "2024-01-01", enrollments: 45, revenue: 3800 },
      { date: "2024-01-02", enrollments: 52, revenue: 4200 },
      { date: "2024-01-03", enrollments: 38, revenue: 3200 },
      { date: "2024-01-04", enrollments: 61, revenue: 5100 },
      { date: "2024-01-05", enrollments: 55, revenue: 4600 },
      { date: "2024-01-06", enrollments: 72, revenue: 6000 },
      { date: "2024-01-07", enrollments: 58, revenue: 4900 }
    ],
    revenueData: {
      monthly: [
        { month: "Jan", revenue: 18500, courses: 45 },
        { month: "Feb", revenue: 22300, courses: 52 },
        { month: "Mar", revenue: 25800, courses: 61 },
        { month: "Apr", revenue: 28200, courses: 68 },
        { month: "May", revenue: 31500, courses: 75 },
        { month: "Jun", revenue: 29800, courses: 72 }
      ],
      categories: [
        { category: "Web Development", revenue: 85000, percentage: 40, color: "#3b82f6" },
        { category: "Data Science", revenue: 65000, percentage: 30, color: "#10b981" },
        { category: "Design", revenue: 42500, percentage: 20, color: "#f59e0b" },
        { category: "Marketing", revenue: 21250, percentage: 10, color: "#ef4444" }
      ]
    },
    courseProgress: [
      {
        courseTitle: "Complete Web Development Bootcamp",
        completionRate: 78,
        totalStudents: 1250,
        completedStudents: 975,
        averageProgress: 65
      },
      {
        courseTitle: "React Advanced Concepts",
        completionRate: 82,
        totalStudents: 890,
        completedStudents: 730,
        averageProgress: 72
      },
      {
        courseTitle: "Node.js Masterclass",
        completionRate: 65,
        totalStudents: 675,
        completedStudents: 439,
        averageProgress: 58
      }
    ],
    progressDistribution: [
      { range: "0-25%", count: 245, percentage: 12, fill: "#ef4444" },
      { range: "26-50%", count: 387, percentage: 18, fill: "#f59e0b" },
      { range: "51-75%", count: 521, percentage: 25, fill: "#3b82f6" },
      { range: "76-100%", count: 967, percentage: 45, fill: "#10b981" }
    ]
  });

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    // Implementation for exporting analytics report
    console.log("Exporting analytics report...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your course performance and student engagement
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Students"
          value={analyticsData.overview.totalStudents.toLocaleString()}
          description="Across all courses"
          icon={Users}
          trend={analyticsData.overview.trends.students}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
          description="Lifetime earnings"
          icon={DollarSign}
          trend={analyticsData.overview.trends.revenue}
        />
        <AnalyticsCard
          title="Average Rating"
          value={analyticsData.overview.averageRating}
          description="From student reviews"
          icon={Star}
          trend={analyticsData.overview.trends.rating}
        />
        <AnalyticsCard
          title="Published Courses"
          value={analyticsData.overview.totalCourses}
          description="Active courses"
          icon={BookOpen}
          trend={analyticsData.overview.trends.courses}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="enrollments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="progress">Student Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="space-y-6">
          <EnrollmentChart
            data={analyticsData.enrollmentData}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueChart
            monthlyData={analyticsData.revenueData.monthly}
            categoryData={analyticsData.revenueData.categories}
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <StudentProgressChart
            courseProgress={analyticsData.courseProgress}
            progressDistribution={analyticsData.progressDistribution}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Create Course</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>View Students</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Award className="h-6 w-6" />
              <span>View Reviews</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorAnalytics;

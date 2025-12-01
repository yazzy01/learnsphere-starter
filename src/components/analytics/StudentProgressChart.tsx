import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";

interface CourseProgress {
  courseTitle: string;
  completionRate: number;
  totalStudents: number;
  completedStudents: number;
  averageProgress: number;
}

interface ProgressDistribution {
  range: string;
  count: number;
  percentage: number;
  fill: string;
}

interface StudentProgressChartProps {
  courseProgress: CourseProgress[];
  progressDistribution: ProgressDistribution[];
}

const StudentProgressChart = ({ courseProgress, progressDistribution }: StudentProgressChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            Completion Rate: {payload[0].value}%
          </p>
          <p className="text-sm text-muted-foreground">
            {payload[0].payload.completedStudents} of {payload[0].payload.totalStudents} students
          </p>
        </div>
      );
    }
    return null;
  };

  const RadialTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.range}</p>
          <p className="text-sm text-primary">
            {payload[0].payload.count} students ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Course Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Course Completion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.slice(0, 5).map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate max-w-xs">
                    {course.courseTitle}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {course.completionRate}%
                  </span>
                </div>
                <Progress value={course.completionRate} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{course.completedStudents} completed</span>
                  <span>{course.totalStudents} total students</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Performance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courseProgress.slice(0, 6)}
                  layout="horizontal"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    type="category"
                    dataKey="courseTitle"
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                    width={150}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="completionRate"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Distribution Radial Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Student Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="20%"
                  outerRadius="90%"
                  data={progressDistribution}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="percentage"
                    cornerRadius={4}
                    fill="hsl(var(--primary))"
                  />
                  <Tooltip content={<RadialTooltip />} />
                  <Legend
                    iconSize={8}
                    layout="vertical"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: '12px' }}>
                        {value}: {entry.payload?.count} students
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProgressChart;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface EnrollmentData {
  date: string;
  enrollments: number;
  revenue: number;
}

interface EnrollmentChartProps {
  data: EnrollmentData[];
  timeRange: "7d" | "30d" | "90d" | "1y";
}

const EnrollmentChart = ({ data, timeRange }: EnrollmentChartProps) => {
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    switch (timeRange) {
      case "7d":
        return date.toLocaleDateString("en-US", { weekday: "short" });
      case "30d":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      case "90d":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      case "1y":
        return date.toLocaleDateString("en-US", { month: "short" });
      default:
        return tickItem;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">
            {new Date(label).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </p>
          <p className="text-sm text-primary">
            Enrollments: {payload[0].value}
          </p>
          {payload[1] && (
            <p className="text-sm text-secondary">
              Revenue: ${payload[1].value.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisLabel}
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#enrollmentGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentChart;

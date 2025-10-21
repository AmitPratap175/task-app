import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Target,
  Flame,
  Calendar,
  Award,
} from "lucide-react";
import type { AnalyticsSummary, DailyStats } from "@shared/schema";

const SUBJECT_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } =
    useQuery<AnalyticsSummary>({
      queryKey: ["/api/analytics/summary"],
    });

  const { data: dailyStats = [], isLoading: statsLoading } = useQuery<
    DailyStats[]
  >({
    queryKey: ["/api/analytics/daily"],
  });

  const isLoading = analyticsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  const weeklyData = dailyStats.slice(-7).map((stat) => ({
    date: new Date(stat.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    hours: Math.round(stat.totalMinutesStudied / 60),
    tasks: stat.tasksCompleted,
  }));

  const subjectData =
    analytics?.subjectDistribution.map((item, index) => ({
      name: item.subject,
      value: Math.round(item.minutes / 60),
      color: SUBJECT_COLORS[index % SUBJECT_COLORS.length],
    })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your study patterns and progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" data-testid="icon-total-time" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="stat-total-time">
              {Math.floor((analytics?.totalStudyTime || 0) / 60)}h{" "}
              {(analytics?.totalStudyTime || 0) % 60}m
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" data-testid="icon-week" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="stat-week-time">
              {Math.floor((analytics?.weekStudyTime || 0) / 60)}h{" "}
              {(analytics?.weekStudyTime || 0) % 60}m
            </div>
            <p className="text-xs text-muted-foreground mt-1">Study time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" data-testid="icon-efficiency" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-efficiency">
              {analytics?.focusEfficiency || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pomodoro completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" data-testid="icon-analytics-streak" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-current-streak">
              {analytics?.currentStreak || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Consecutive study days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study Time Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last 7 days of study activity
            </p>
          </CardHeader>
          <CardContent>
            {weeklyData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto opacity-50 mb-2" />
                  <p className="text-sm">No study data yet</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Study Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks Completed</CardTitle>
            <p className="text-sm text-muted-foreground">
              Daily task completion over the week
            </p>
          </CardHeader>
          <CardContent>
            {weeklyData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Award className="h-12 w-12 mx-auto opacity-50 mb-2" />
                  <p className="text-sm">No task data yet</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="tasks"
                    fill="hsl(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                    name="Tasks Completed"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Time spent on each subject
            </p>
          </CardHeader>
          <CardContent>
            {subjectData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto opacity-50 mb-2" />
                  <p className="text-sm">No subject data yet</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}h`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your study performance metrics
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tasks Completed Today</span>
                <Badge variant="default" data-testid="badge-tasks-today">
                  {analytics?.tasksCompletedToday || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tasks Completed This Week</span>
                <Badge variant="secondary" data-testid="badge-tasks-week">
                  {analytics?.tasksCompletedWeek || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Rate</span>
                <Badge variant="default" data-testid="badge-completion-rate">
                  {analytics?.completionRate || 0}%
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-card-border space-y-3">
              <h4 className="font-medium">Subject Breakdown</h4>
              {subjectData.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Start studying to see subject breakdown
                </p>
              ) : (
                <div className="space-y-2">
                  {subjectData.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="text-sm">{subject.name}</span>
                      </div>
                      <span className="text-sm font-medium">{subject.value}h</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Target,
  TrendingUp,
  Flame,
  Plus,
} from "lucide-react";
import type { Task, Goal, AnalyticsSummary } from "@shared/schema";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const { data: analytics, isLoading: analyticsLoading } =
    useQuery<AnalyticsSummary>({
      queryKey: ["/api/analytics/summary"],
    });

  const todayTasks = tasks.filter(
    (task) =>
      task.deadline &&
      new Date(task.deadline).toDateString() === new Date().toDateString()
  );

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const completedToday = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      new Date(task.completedAt).toDateString() === new Date().toDateString()
  );

  const todayGoals = goals.filter(
    (goal) => goal.type === "daily" && goal.status === "active"
  );

  const isLoading = tasksLoading || goalsLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const motivationalQuotes = [
    "Focus on progress, not perfection.",
    "Small daily improvements lead to stunning results.",
    "Success is the sum of small efforts repeated daily.",
    "Stay focused, go after your dreams.",
    "The expert in anything was once a beginner.",
  ];

  const todayQuote =
    motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">
          Welcome back!
        </h1>
        <p className="text-lg text-muted-foreground mt-1">{todayQuote}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" data-testid="icon-tasks" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-today-tasks">
              {todayTasks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedToday.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" data-testid="icon-clock" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="stat-study-time">
              {Math.floor((analytics?.todayStudyTime || 0) / 60)}h{" "}
              {(analytics?.todayStudyTime || 0) % 60}m
            </div>
            <p className="text-xs text-muted-foreground mt-1">Today's focus time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" data-testid="icon-check" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-completion">
              {analytics?.completionRate || 0}%
            </div>
            <Progress
              value={analytics?.completionRate || 0}
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" data-testid="icon-flame" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-streak">
              {analytics?.currentStreak || 0} days
            </div>
            <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
            <CardTitle>Today's Focus</CardTitle>
            <Button asChild size="sm" data-testid="button-add-goal">
              <Link href="/goals">
                <Plus className="h-4 w-4 mr-1" />
                New Goal
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todayGoals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mt-2">
                  No goals set for today
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/goals">Set Your First Goal</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayGoals.slice(0, 3).map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 rounded-lg border border-card-border hover-elevate"
                    data-testid={`goal-${goal.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{goal.title}</h4>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">{goal.progress}%</Badge>
                    </div>
                    <Progress value={goal.progress} className="mt-2 h-1" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
            <CardTitle>Task Overview</CardTitle>
            <Button asChild size="sm" data-testid="button-add-task">
              <Link href="/tasks">
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pending</span>
                  <Badge variant="outline" data-testid="badge-pending-count">
                    {pendingTasks.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {pendingTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 text-sm p-2 rounded hover-elevate"
                    >
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span className="flex-1 truncate">{task.title}</span>
                      {task.subject && (
                        <Badge variant="secondary" className="text-xs">
                          {task.subject}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">In Progress</span>
                  <Badge variant="outline" data-testid="badge-inprogress-count">
                    {inProgressTasks.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {inProgressTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 text-sm p-2 rounded hover-elevate"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="flex-1 truncate">{task.title}</span>
                      {task.subject && (
                        <Badge variant="secondary" className="text-xs">
                          {task.subject}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-card-border">
                <Button asChild variant="ghost" className="w-full" size="sm">
                  <Link href="/tasks">
                    View All Tasks
                    <TrendingUp className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

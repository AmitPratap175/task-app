import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee } from "lucide-react";
import type { Task } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type TimerMode = "focus" | "break";

export default function Pomodoro() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const { toast } = useToast();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createSessionMutation = useMutation({
    mutationFn: (wasCompleted: boolean) =>
      apiRequest("POST", "/api/pomodoro-sessions", {
        taskId: selectedTaskId || null,
        focusDuration,
        breakDuration,
        wasCompleted,
        completedAt: wasCompleted ? new Date() : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/daily"] });
    },
  });

  const activeTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "in_progress"
  );

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === "focus") {
      // Save completed pomodoro session
      createSessionMutation.mutate(true);
      setSessionsCompleted((prev) => prev + 1);
      
      if (soundEnabled) {
        toast({
          title: "Focus session complete!",
          description: "Great work! Time for a break.",
        });
      }
      
      setMode("break");
      setTimeLeft(breakDuration * 60);
    } else {
      if (soundEnabled) {
        toast({
          title: "Break complete!",
          description: "Ready for another focus session?",
        });
      }
      
      setMode("focus");
      setTimeLeft(focusDuration * 60);
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? focusDuration * 60 : breakDuration * 60);
  };

  const handleModeSwitch = () => {
    setIsRunning(false);
    const newMode = mode === "focus" ? "break" : "focus";
    setMode(newMode);
    setTimeLeft(newMode === "focus" ? focusDuration * 60 : breakDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = mode === "focus"
    ? ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Focus Timer</h1>
        <p className="text-muted-foreground mt-1">
          Use the Pomodoro technique to maintain focus
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="relative w-64 h-64 mb-8">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke={mode === "focus" ? "hsl(var(--primary))" : "hsl(var(--chart-3))"}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="text-6xl font-bold font-mono"
                    data-testid="timer-display"
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {mode === "focus" ? (
                      <Badge variant="default" className="text-sm">
                        Focus Time
                      </Badge>
                    ) : (
                      <Badge className="text-sm bg-chart-3 hover:bg-chart-3">
                        <Coffee className="h-3 w-3 mr-1" />
                        Break Time
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Button
                  size="lg"
                  onClick={handleStartPause}
                  data-testid="button-start-pause"
                  className="w-32"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  data-testid="button-sound-toggle"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-5 w-5" />
                  ) : (
                    <VolumeX className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i < sessionsCompleted % 4
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {sessionsCompleted} sessions completed
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Focus Duration (minutes)
                </label>
                <Select
                  value={focusDuration.toString()}
                  onValueChange={(val) => {
                    const newDuration = parseInt(val);
                    setFocusDuration(newDuration);
                    if (mode === "focus" && !isRunning) {
                      setTimeLeft(newDuration * 60);
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-focus-duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 25, 30, 45, 60].map((min) => (
                      <SelectItem key={min} value={min.toString()}>
                        {min} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Break Duration (minutes)
                </label>
                <Select
                  value={breakDuration.toString()}
                  onValueChange={(val) => {
                    const newDuration = parseInt(val);
                    setBreakDuration(newDuration);
                    if (mode === "break" && !isRunning) {
                      setTimeLeft(newDuration * 60);
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-break-duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map((min) => (
                      <SelectItem key={min} value={min.toString()}>
                        {min} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleModeSwitch}
                  disabled={isRunning}
                >
                  Switch to {mode === "focus" ? "Break" : "Focus"} Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Task</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedTaskId}
                onValueChange={setSelectedTaskId}
              >
                <SelectTrigger data-testid="select-current-task">
                  <SelectValue placeholder="Select a task to focus on" />
                </SelectTrigger>
                <SelectContent>
                  {activeTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTaskId && (
                <div className="mt-3 p-3 rounded-lg bg-muted">
                  <p className="text-sm">
                    {activeTasks.find((t) => t.id === selectedTaskId)?.description ||
                      "Stay focused on your task!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

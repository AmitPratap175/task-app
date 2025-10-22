import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Plus, X, RotateCcw } from "lucide-react";
import type { UserSettings } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [newSubject, setNewSubject] = useState("");
  const { toast } = useToast();

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  const addSubjectMutation = useMutation({
    mutationFn: (subject: string) =>
      apiRequest("POST", `/api/subjects?subject=${encodeURIComponent(subject)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Subject added",
        description: "The subject has been added successfully.",
      });
      setNewSubject("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (subject: string) =>
      apiRequest("DELETE", `/api/subjects/${encodeURIComponent(subject)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Subject removed",
        description: "The subject has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove subject. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetAllMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/reset-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/daily"] });
      toast({
        title: "Data reset",
        description: "All data has been reset successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reset data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed) {
      toast({
        title: "Invalid subject",
        description: "Subject name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (settings?.customSubjects?.includes(trimmed)) {
      toast({
        title: "Subject exists",
        description: "This subject already exists.",
        variant: "destructive",
      });
      return;
    }
    addSubjectMutation.mutate(trimmed);
  };

  const handleDeleteSubject = (subject: string) => {
    deleteSubjectMutation.mutate(subject);
  };

  const handleResetAll = () => {
    resetAllMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your study subjects and application data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Subject Management
          </CardTitle>
          <CardDescription>
            Add or remove study subjects to customize your task organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter new subject name (e.g., Chemistry, Biology)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSubject();
                }
              }}
              data-testid="input-new-subject"
            />
            <Button
              onClick={handleAddSubject}
              disabled={addSubjectMutation.isPending}
              data-testid="button-add-subject"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings?.customSubjects?.map((subject) => (
              <Badge
                key={subject}
                variant="secondary"
                className="text-sm px-3 py-1.5 flex items-center gap-2"
                data-testid={`badge-subject-${subject}`}
              >
                {subject}
                <button
                  onClick={() => handleDeleteSubject(subject)}
                  className="hover:text-destructive transition-colors"
                  data-testid={`button-remove-subject-${subject}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {!settings?.customSubjects?.length && (
            <p className="text-sm text-muted-foreground">
              No subjects added yet. Add your first subject to get started.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <RotateCcw className="h-5 w-5" />
            Reset All Data
          </CardTitle>
          <CardDescription>
            Permanently delete all tasks, goals, and progress. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" data-testid="button-reset-all">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All tasks and subtasks</li>
                    <li>All goals</li>
                    <li>All Pomodoro session history</li>
                    <li>All progress and streaks</li>
                  </ul>
                  <p className="mt-2 font-semibold">
                    Your study subjects and theme preferences will be preserved.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-testid="button-confirm-reset"
                >
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

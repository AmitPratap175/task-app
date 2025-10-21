import {
  type Task,
  type InsertTask,
  type Goal,
  type InsertGoal,
  type PomodoroSession,
  type InsertPomodoroSession,
  type UserSettings,
  type InsertUserSettings,
  type AnalyticsSummary,
  type DailyStats,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Goals
  getGoals(): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;

  // Pomodoro Sessions
  getPomodoroSessions(): Promise<PomodoroSession[]>;
  createPomodoroSession(session: InsertPomodoroSession): Promise<PomodoroSession>;

  // Settings
  getSettings(): Promise<UserSettings>;
  updateSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings>;

  // Analytics
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
  getDailyStats(): Promise<DailyStats[]>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private goals: Map<string, Goal>;
  private pomodoroSessions: Map<string, PomodoroSession>;
  private settings: UserSettings;

  constructor() {
    this.tasks = new Map();
    this.goals = new Map();
    this.pomodoroSessions = new Map();
    
    // Initialize default settings
    this.settings = {
      id: randomUUID(),
      pomodoroFocusDuration: 25,
      pomodoroBreakDuration: 5,
      theme: "dark",
      notificationsEnabled: true,
      soundEnabled: true,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      updatedAt: new Date(),
    };

    // Add some sample data for development
    this.seedData();
  }

  private seedData() {
    // Sample tasks
    const sampleTasks: InsertTask[] = [
      {
        title: "Revise Chapter 5: Thermodynamics",
        description: "Complete all formulas and solve practice problems",
        status: "pending",
        priority: "critical",
        subject: "Physics",
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        estimatedDuration: 120,
        resources: ["https://example.com/physics-chapter5.pdf"],
      },
      {
        title: "Practice Calculus Problems",
        description: "Solve integration and differentiation exercises",
        status: "in_progress",
        priority: "important",
        subject: "Math",
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        estimatedDuration: 90,
      },
      {
        title: "Read History Chapter 12",
        description: "World War II and its aftermath",
        status: "pending",
        priority: "optional",
        subject: "History",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedDuration: 60,
      },
      {
        title: "Chemistry Lab Report",
        description: "Write up the titration experiment results",
        status: "completed",
        priority: "important",
        subject: "Chemistry",
        completedAt: new Date(),
        actualDuration: 75,
      },
    ];

    sampleTasks.forEach((task) => {
      const id = randomUUID();
      this.tasks.set(id, { ...task, id, createdAt: new Date() });
    });

    // Sample goals
    const sampleGoals: InsertGoal[] = [
      {
        title: "Complete 3 Physics chapters",
        description: "Finish chapters 5, 6, and 7 before the exam",
        type: "weekly",
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
        progress: 33,
      },
      {
        title: "Study 2 hours daily",
        description: "Maintain consistent study schedule",
        type: "daily",
        targetDate: new Date(),
        status: "active",
        progress: 50,
      },
      {
        title: "Finish entire Math syllabus",
        description: "Complete all topics before final exam",
        type: "monthly",
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active",
        progress: 60,
      },
    ];

    sampleGoals.forEach((goal) => {
      const id = randomUUID();
      this.goals.set(id, { ...goal, id, createdAt: new Date() });
    });

    // Sample pomodoro sessions
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const id = randomUUID();
      this.pomodoroSessions.set(id, {
        id,
        taskId: Array.from(this.tasks.keys())[0],
        focusDuration: 25,
        breakDuration: 5,
        wasCompleted: true,
        completedAt: new Date(today.getTime() - i * 60 * 60 * 1000),
        createdAt: new Date(today.getTime() - i * 60 * 60 * 1000),
      });
    }

    // Update settings with streak
    this.settings.currentStreak = 3;
    this.settings.longestStreak = 5;
    this.settings.lastStudyDate = new Date();
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask: Task = {
      ...task,
      ...updates,
    };

    // Update completedAt if status changed to completed
    if (updates.status === "completed" && task.status !== "completed") {
      updatedTask.completedAt = new Date();
      
      // Update streak
      await this.updateStreak();
    }

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = {
      ...insertGoal,
      id,
      createdAt: new Date(),
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const updatedGoal: Goal = {
      ...goal,
      ...updates,
    };

    // Update completedAt if status changed to completed
    if (updates.status === "completed" && goal.status !== "completed") {
      updatedGoal.completedAt = new Date();
    }

    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Pomodoro Sessions
  async getPomodoroSessions(): Promise<PomodoroSession[]> {
    return Array.from(this.pomodoroSessions.values());
  }

  async createPomodoroSession(insertSession: InsertPomodoroSession): Promise<PomodoroSession> {
    const id = randomUUID();
    const session: PomodoroSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.pomodoroSessions.set(id, session);
    
    // Update streak if session was completed
    if (session.wasCompleted) {
      await this.updateStreak();
    }
    
    return session;
  }

  // Settings
  async getSettings(): Promise<UserSettings> {
    return this.settings;
  }

  async updateSettings(updates: Partial<InsertUserSettings>): Promise<UserSettings> {
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date(),
    };
    return this.settings;
  }

  // Analytics
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const tasks = Array.from(this.tasks.values());
    const sessions = Array.from(this.pomodoroSessions.values());

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate total study time from completed sessions
    const totalStudyTime = sessions
      .filter((s) => s.wasCompleted)
      .reduce((sum, s) => sum + s.focusDuration, 0);

    // Today's study time
    const todayStudyTime = sessions
      .filter((s) => s.wasCompleted && s.completedAt && new Date(s.completedAt) >= today)
      .reduce((sum, s) => sum + s.focusDuration, 0);

    // Week study time
    const weekStudyTime = sessions
      .filter((s) => s.wasCompleted && s.completedAt && new Date(s.completedAt) >= weekAgo)
      .reduce((sum, s) => sum + s.focusDuration, 0);

    // Tasks completed today
    const tasksCompletedToday = tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.completedAt &&
        new Date(t.completedAt) >= today
    ).length;

    // Tasks completed this week
    const tasksCompletedWeek = tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.completedAt &&
        new Date(t.completedAt) >= weekAgo
    ).length;

    // Subject distribution
    const subjectMap = new Map<string, number>();
    tasks.forEach((task) => {
      if (task.subject && task.status === "completed" && task.actualDuration) {
        const current = subjectMap.get(task.subject) || 0;
        subjectMap.set(task.subject, current + task.actualDuration);
      }
    });

    const subjectDistribution = Array.from(subjectMap.entries()).map(
      ([subject, minutes]) => ({ subject, minutes })
    );

    // Completion rate
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    // Focus efficiency (pomodoro completion rate)
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.wasCompleted).length;
    const focusEfficiency = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return {
      totalStudyTime,
      todayStudyTime,
      weekStudyTime,
      tasksCompletedToday,
      tasksCompletedWeek,
      currentStreak: this.settings.currentStreak,
      subjectDistribution,
      completionRate,
      focusEfficiency,
    };
  }

  async getDailyStats(): Promise<DailyStats[]> {
    const tasks = Array.from(this.tasks.values());
    const sessions = Array.from(this.pomodoroSessions.values());

    const statsMap = new Map<string, DailyStats>();

    // Process completed tasks
    tasks.forEach((task) => {
      if (task.completedAt) {
        const date = new Date(task.completedAt).toISOString().split("T")[0];
        if (!statsMap.has(date)) {
          statsMap.set(date, {
            date,
            totalMinutesStudied: 0,
            tasksCompleted: 0,
            pomodoroSessionsCompleted: 0,
            subjectBreakdown: {},
          });
        }
        const stats = statsMap.get(date)!;
        stats.tasksCompleted++;
        if (task.actualDuration) {
          stats.totalMinutesStudied += task.actualDuration;
          if (task.subject) {
            stats.subjectBreakdown[task.subject] =
              (stats.subjectBreakdown[task.subject] || 0) + task.actualDuration;
          }
        }
      }
    });

    // Process completed pomodoro sessions
    sessions.forEach((session) => {
      if (session.wasCompleted && session.completedAt) {
        const date = new Date(session.completedAt).toISOString().split("T")[0];
        if (!statsMap.has(date)) {
          statsMap.set(date, {
            date,
            totalMinutesStudied: 0,
            tasksCompleted: 0,
            pomodoroSessionsCompleted: 0,
            subjectBreakdown: {},
          });
        }
        const stats = statsMap.get(date)!;
        stats.pomodoroSessionsCompleted++;
        stats.totalMinutesStudied += session.focusDuration;
      }
    });

    return Array.from(statsMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Helper: Update streak
  private async updateStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStudy = this.settings.lastStudyDate
      ? new Date(this.settings.lastStudyDate)
      : null;

    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Same day, no change
        return;
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        this.settings.currentStreak++;
        this.settings.longestStreak = Math.max(
          this.settings.longestStreak,
          this.settings.currentStreak
        );
      } else {
        // Streak broken, reset to 1
        this.settings.currentStreak = 1;
      }
    } else {
      // First study session
      this.settings.currentStreak = 1;
      this.settings.longestStreak = 1;
    }

    this.settings.lastStudyDate = new Date();
  }
}

export const storage = new MemStorage();

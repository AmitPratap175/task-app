import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  priority: text("priority").notNull().default("important"), // critical, important, optional
  subject: text("subject"), // Math, Physics, Chemistry, etc.
  deadline: timestamp("deadline"),
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDuration: integer("actual_duration"), // in minutes
  parentTaskId: varchar("parent_task_id"), // for subtasks
  resources: text("resources").array(), // URLs to PDFs, videos, notes
  isRecurring: boolean("is_recurring").default(false),
  recurringSchedule: text("recurring_schedule"), // daily, weekly, etc.
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Goals table
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // daily, weekly, monthly
  targetDate: timestamp("target_date").notNull(),
  status: text("status").notNull().default("active"), // active, completed, cancelled
  progress: integer("progress").notNull().default(0), // 0-100
  relatedTaskIds: text("related_task_ids").array(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

// Pomodoro Sessions table
export const pomodoroSessions = pgTable("pomodoro_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id"),
  focusDuration: integer("focus_duration").notNull(), // in minutes
  breakDuration: integer("break_duration").notNull(), // in minutes
  wasCompleted: boolean("was_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPomodoroSessionSchema = createInsertSchema(pomodoroSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertPomodoroSession = z.infer<typeof insertPomodoroSessionSchema>;
export type PomodoroSession = typeof pomodoroSessions.$inferSelect;

// User Settings table
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pomodoroFocusDuration: integer("pomodoro_focus_duration").notNull().default(25),
  pomodoroBreakDuration: integer("pomodoro_break_duration").notNull().default(5),
  theme: text("theme").notNull().default("dark"), // light, dark
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastStudyDate: timestamp("last_study_date"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

// Computed types for frontend
export type TaskWithSubtasks = Task & {
  subtasks?: Task[];
};

export type DailyStats = {
  date: string;
  totalMinutesStudied: number;
  tasksCompleted: number;
  pomodoroSessionsCompleted: number;
  subjectBreakdown: Record<string, number>;
};

export type AnalyticsSummary = {
  totalStudyTime: number; // in minutes
  todayStudyTime: number;
  weekStudyTime: number;
  tasksCompletedToday: number;
  tasksCompletedWeek: number;
  currentStreak: number;
  subjectDistribution: Array<{ subject: string; minutes: number }>;
  completionRate: number; // percentage
  focusEfficiency: number; // percentage based on pomodoro completion
};

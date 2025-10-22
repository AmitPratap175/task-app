CREATE TABLE "goals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"target_date" timestamp NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"related_task_ids" text[],
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pomodoro_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" varchar,
	"focus_duration" integer NOT NULL,
	"break_duration" integer NOT NULL,
	"was_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"priority" text DEFAULT 'important' NOT NULL,
	"subject" text,
	"deadline" timestamp,
	"estimated_duration" integer,
	"actual_duration" integer,
	"parent_task_id" varchar,
	"resources" text[],
	"is_recurring" boolean DEFAULT false,
	"recurring_schedule" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pomodoro_focus_duration" integer DEFAULT 25 NOT NULL,
	"pomodoro_break_duration" integer DEFAULT 5 NOT NULL,
	"theme" text DEFAULT 'dark' NOT NULL,
	"notifications_enabled" boolean DEFAULT true NOT NULL,
	"sound_enabled" boolean DEFAULT true NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_study_date" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

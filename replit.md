# StudyFlow - Exam Preparation Task Manager

## Overview
StudyFlow is a comprehensive productivity companion designed specifically for students preparing for exams. It combines task management, goal tracking, Pomodoro timer, and detailed analytics to help students maintain focus, track progress, and build consistent study habits.

## Project Structure

### Frontend (React + TypeScript)
- **Framework**: React with Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation

### Backend (Express + TypeScript)
- **Server**: Express.js
- **Storage**: In-memory storage (MemStorage)
- **Validation**: Zod schemas
- **Type Safety**: Shared TypeScript types between frontend and backend

## Features

### 1. Dashboard (/)
- **Today's Focus Summary**: Quick overview of daily tasks and goals
- **Task Overview**: Categorized view (pending, in progress, completed)
- **Study Statistics**: Real-time metrics for study time, completion rate, and streaks
- **Progress Indicators**: Visual progress rings and charts
- **Motivational Quotes**: Daily inspiration for students

### 2. Tasks (/tasks)
- **Smart Task Management**: Create, edit, and organize study tasks
- **Priority Levels**: Critical, Important, Optional
- **Subject Tagging**: Organize tasks by subject (Math, Physics, Chemistry, etc.)
- **Subtasks**: Break down complex tasks into smaller steps
- **Deadlines**: Set and track task deadlines
- **Resource Links**: Attach PDFs, videos, and notes to tasks
- **Filtering**: View tasks by status (all, pending, in progress, completed)

### 3. Focus Timer (/pomodoro)
- **Pomodoro Technique**: Customizable focus and break intervals
- **Visual Timer**: Beautiful circular progress indicator
- **Session Tracking**: Track completed Pomodoro sessions
- **Task Integration**: Link timer to specific tasks
- **Sound Controls**: Toggle sound notifications
- **Flexible Settings**: Adjust focus duration (15-60 min) and break duration (5-20 min)

### 4. Goals (/goals)
- **Goal Types**: Daily, Weekly, and Monthly goals
- **Progress Tracking**: Visual progress bars for each goal
- **Target Dates**: Set deadlines for goal completion
- **Goal Categorization**: Organized by type with color coding
- **Status Management**: Track active and completed goals

### 5. Analytics (/analytics)
- **Study Time Trends**: Line charts showing daily study patterns
- **Task Completion**: Bar charts tracking completed tasks
- **Subject Distribution**: Pie chart showing time spent per subject
- **Performance Metrics**: Completion rate, focus efficiency, study streaks
- **Weekly Overview**: 7-day activity summary
- **Subject Breakdown**: Detailed time allocation by subject

## Design System

### Color Palette
- **Primary**: Purple-blue (#250 95% 65%) for CTAs and active states
- **Success**: Green for completed items
- **Warning**: Orange for due soon items
- **Destructive**: Red for overdue items
- **Dark Mode**: Rich dark backgrounds (not pure black) for reduced eye strain
- **Light Mode**: Clean, bright backgrounds for daytime study

### Typography
- **Primary Font**: Inter (clean, modern sans-serif)
- **Monospace**: JetBrains Mono (for timers and statistics)
- **Scale**: From 12px micro text to 36px hero headings

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Multiple variants (default, outline, ghost) with elevation on hover
- **Badges**: Color-coded for subjects, priorities, and statuses
- **Progress Bars**: Smooth animations for visual feedback
- **Sidebar**: Collapsible navigation with active state indicators

## Data Models

### Task
- Title, description, status
- Priority (critical, important, optional)
- Subject/topic tags
- Deadline, estimated/actual duration
- Parent task ID (for subtasks)
- Resource links
- Recurring schedule
- Completion timestamp

### Goal
- Title, description, type (daily/weekly/monthly)
- Target date, status, progress (0-100%)
- Related task IDs
- Completion timestamp

### Pomodoro Session
- Task ID, focus duration, break duration
- Completion status
- Session timestamp

### User Settings
- Pomodoro preferences (focus/break duration)
- Theme (light/dark)
- Notification settings
- Sound preferences
- Streak tracking (current/longest)
- Last study date

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PATCH /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Pomodoro Sessions
- `GET /api/pomodoro-sessions` - Get all sessions
- `POST /api/pomodoro-sessions` - Create new session

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/daily` - Get daily statistics

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings

## User Workflows

### Morning Routine
1. Open dashboard to see today's focus goals
2. Review pending tasks and prioritize
3. Start first Pomodoro session
4. Track progress throughout the day

### Creating a Study Plan
1. Navigate to Goals page
2. Create daily/weekly/monthly goals
3. Add specific tasks to achieve each goal
4. Break down complex tasks into subtasks
5. Set deadlines and priorities

### Focus Session
1. Go to Pomodoro timer
2. Select task to focus on
3. Adjust duration if needed
4. Start timer and maintain focus
5. Take breaks between sessions
6. Track completed sessions

### Progress Review
1. Visit Analytics page
2. Review study time trends
3. Check subject distribution
4. Monitor completion rates
5. Celebrate streaks and achievements

## Technical Highlights

### Type Safety
- Shared TypeScript schemas between frontend and backend
- Zod validation for runtime type checking
- Type-safe API contracts

### Performance
- React Query for efficient data fetching and caching
- Optimistic updates for instant UI feedback
- Lazy loading of components
- Minimal re-renders with proper memoization

### Accessibility
- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast ratios (WCAG AA compliant)
- Focus indicators on all interactive elements

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (<640px), tablet (768px+), desktop (1024px+)
- Collapsible sidebar for mobile
- Flexible grid layouts

## Development Guidelines

### Code Organization
- Components in `client/src/components/`
- Pages in `client/src/pages/`
- Shared types in `shared/schema.ts`
- API routes in `server/routes.ts`
- Storage interface in `server/storage.ts`

### Styling Conventions
- Use Tailwind CSS utility classes
- Follow design_guidelines.md for consistency
- Use shadcn/ui components as base
- Maintain spacing primitives (2, 4, 6, 8, 12, 16, 20)
- Dark mode support via CSS variables

### State Management
- React Query for server state
- React hooks for local state
- Form state with React Hook Form
- Theme state in context

## Future Enhancements

### Planned Features
- User authentication and multi-user support
- PostgreSQL database for persistence
- AI-powered study planner
- Flashcard integration with spaced repetition
- Study buddy collaboration
- Calendar sync (Google/Apple)
- Mobile app (React Native)
- Offline support with sync
- Export data to CSV/PDF
- Achievement badges and gamification

### Integrations
- External calendar sync
- Note-taking apps integration
- Cloud storage for resources
- Video platform integration (YouTube, Khan Academy)

## Running the Project

### Development
```bash
npm run dev
```
Starts both the Express backend and Vite frontend on the same port.

### Building
```bash
npm run build
```
Creates optimized production build.

## Recent Changes
- Initial project setup with complete schema definition
- Built all frontend components with exceptional visual quality
- Implemented dark/light theme support
- Created comprehensive dashboard with real-time statistics
- Added smart task management with subtasks and priorities
- Developed beautiful Pomodoro timer with circular progress
- Built goal tracking system with progress visualization
- Created detailed analytics dashboard with multiple chart types
- Implemented sidebar navigation with active state indicators
- Added responsive design for all screen sizes

## User Preferences
- Students prefer dark mode for reduced eye strain during long study sessions
- Focus-first design minimizes distractions
- Visual progress indicators provide motivation
- Quick access to timer for immediate focus sessions
- Comprehensive analytics help identify study patterns

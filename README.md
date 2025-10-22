# StudyFlow - Exam Preparation Task Manager

A comprehensive productivity companion designed specifically for students preparing for exams. Manage tasks, track goals, use the Pomodoro timer, and analyze your study patterns.

## Features

- **Dashboard**: Get a quick overview of your daily tasks, goals, and study statistics
- **Task Management**: Create, organize, and track study tasks with priorities, deadlines, and subtasks
- **Pomodoro Timer**: Focus on your studies with customizable work/break intervals
- **Goal Tracking**: Set and monitor daily, weekly, and monthly study goals
- **Analytics**: Visualize your study patterns with charts and performance metrics

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS + shadcn/ui for styling
- TanStack Query (React Query) for data fetching
- Wouter for routing
- React Hook Form + Zod for form validation

### Backend
- FastAPI (Python) for API endpoints
- SQLAlchemy ORM for database operations
- PostgreSQL database for data persistence
- Uvicorn ASGI server

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd studyflow
```

2. Install Node.js dependencies
```bash
npm install
```

3. Install Python dependencies
```bash
uv sync
# or with pip:
pip install -r requirements.txt
```

4. Set up environment variables
```bash
# Create a .env file or set environment variables
DATABASE_URL=postgresql://username:password@localhost:5432/studyflow
NODE_ENV=development
PORT=5000
```

### Database Migrations

This project uses Drizzle ORM for managing database schema migrations.

1.  **Generate a new migration file:**
    If you make changes to `shared/schema.ts`, you need to generate a new migration file.
    ```bash
    DATABASE_URL=postgresql://studyflow:studyflow_password@localhost:5432/studyflow npx drizzle-kit generate
    ```
    Replace `postgresql://studyflow:studyflow_password@localhost:5432/studyflow` with your actual `DATABASE_URL`.

2.  **Apply pending migrations:**
    To apply all pending migrations to your database:
    ```bash
    DATABASE_URL=postgresql://studyflow:studyflow_password@localhost:5432/studyflow npx drizzle-kit migrate
    ```
    Replace `postgresql://studyflow:studyflow_password@localhost:5432/studyflow` with your actual `DATABASE_URL`.

    **Note:** If you encounter errors like "relation 'table_name' already exists" when running `npx drizzle-kit migrate` on an existing database (e.g., one initialized by SQLAlchemy), you might need to manually apply only the `ALTER TABLE` statements from the generated migration files. You can find these SQL statements in the `migrations/` directory.

### Development

Start the development server:
```bash
npm run dev
```

This will start:
- FastAPI backend on port 8000 (internal)
- Vite dev server with HMR on port 5000
- Express proxy server connecting frontend to backend

The application will be available at `http://localhost:5000`

### Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
.
├── api/                    # FastAPI backend
│   ├── main.py            # FastAPI application and setup
│   ├── database.py        # Database configuration
│   ├── models.py          # SQLAlchemy models
│   ├── routes.py          # API endpoints
│   └── schemas.py         # Pydantic schemas
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   └── index.html
├── server/                # Node.js dev server
│   ├── index.ts           # Main server with Vite integration
│   └── vite.ts            # Vite middleware setup
├── shared/                # Shared types between frontend/backend
│   └── schema.ts
├── package.json
├── pyproject.toml
└── vite.config.ts
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a new goal
- `PATCH /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### Pomodoro Sessions
- `GET /api/pomodoro-sessions` - Get all sessions
- `POST /api/pomodoro-sessions` - Create a new session

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/daily` - Get daily statistics

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings

## Docker Setup

For local development with Docker:

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- The application on port 5000

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost/defaultdb` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |

## Development on Replit

This project is optimized for Replit:
1. PostgreSQL database is automatically provisioned
2. Environment variables are managed by Replit
3. The development server runs on port 5000
4. Hot module replacement (HMR) is enabled for fast development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with React, FastAPI, and PostgreSQL
- UI components from shadcn/ui
- Icons from Lucide React

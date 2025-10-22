import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from api.database import engine, SessionLocal
from api import models, routes
from datetime import datetime, timedelta
import uuid

app = FastAPI()

is_dev = os.getenv("NODE_ENV", "development") == "development"

if is_dev:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://0.0.0.0:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        existing_tasks = db.query(models.Task).first()
        if existing_tasks:
            return
        
        sample_tasks = [
            models.Task(
                id=str(uuid.uuid4()),
                title="Revise Chapter 5: Thermodynamics",
                description="Complete all formulas and solve practice problems",
                status="pending",
                priority="critical",
                subject="Physics",
                deadline=datetime.now() + timedelta(days=2),
                estimated_duration=120,
                resources=["https://example.com/physics-chapter5.pdf"],
                created_at=datetime.now()
            ),
            models.Task(
                id=str(uuid.uuid4()),
                title="Practice Calculus Problems",
                description="Solve integration and differentiation exercises",
                status="in_progress",
                priority="important",
                subject="Math",
                deadline=datetime.now() + timedelta(days=1),
                estimated_duration=90,
                created_at=datetime.now()
            ),
            models.Task(
                id=str(uuid.uuid4()),
                title="Read History Chapter 12",
                description="World War II and its aftermath",
                status="pending",
                priority="optional",
                subject="History",
                deadline=datetime.now() + timedelta(days=3),
                estimated_duration=60,
                created_at=datetime.now()
            ),
            models.Task(
                id=str(uuid.uuid4()),
                title="Chemistry Lab Report",
                description="Write up the titration experiment results",
                status="completed",
                priority="important",
                subject="Chemistry",
                completed_at=datetime.now(),
                actual_duration=75,
                created_at=datetime.now()
            ),
        ]
        
        for task in sample_tasks:
            db.add(task)
        
        sample_goals = [
            models.Goal(
                id=str(uuid.uuid4()),
                title="Complete 3 Physics chapters",
                description="Finish chapters 5, 6, and 7 before the exam",
                type="weekly",
                target_date=datetime.now() + timedelta(days=7),
                status="active",
                progress=33,
                created_at=datetime.now()
            ),
            models.Goal(
                id=str(uuid.uuid4()),
                title="Study 2 hours daily",
                description="Maintain consistent study schedule",
                type="daily",
                target_date=datetime.now(),
                status="active",
                progress=50,
                created_at=datetime.now()
            ),
            models.Goal(
                id=str(uuid.uuid4()),
                title="Finish entire Math syllabus",
                description="Complete all topics before final exam",
                type="monthly",
                target_date=datetime.now() + timedelta(days=30),
                status="active",
                progress=60,
                created_at=datetime.now()
            ),
        ]
        
        for goal in sample_goals:
            db.add(goal)
        
        first_task_id = sample_tasks[0].id
        for i in range(5):
            session = models.PomodoroSession(
                id=str(uuid.uuid4()),
                task_id=first_task_id,
                focus_duration=25,
                break_duration=5,
                was_completed=True,
                completed_at=datetime.now() - timedelta(hours=i),
                created_at=datetime.now() - timedelta(hours=i)
            )
            db.add(session)
        
        settings = models.UserSettings(
            id=str(uuid.uuid4()),
            pomodoro_focus_duration=25,
            pomodoro_break_duration=5,
            theme="dark",
            notifications_enabled=True,
            sound_enabled=True,
            current_streak=3,
            longest_streak=5,
            last_study_date=datetime.now(),
            custom_subjects=["Math", "Physics", "Chemistry", "Biology", "History", "English", "Computer Science", "Other"],
            updated_at=datetime.now()
        )
        db.add(settings)
        
        db.commit()
    finally:
        db.close()

if is_dev:
    seed_database()

app.include_router(routes.router, prefix="/api")

import os.path as path_exists

if not is_dev and path_exists.exists("dist/public"):
    app.mount("/assets", StaticFiles(directory="dist/public/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            return {"message": "Not found"}
        return FileResponse("dist/public/index.html")
elif path_exists.exists("dist/public"):
    app.mount("/assets", StaticFiles(directory="dist/public/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            return {"message": "Not found"}
        return FileResponse("dist/public/index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "5000"))
    uvicorn.run(app, host="0.0.0.0", port=port)

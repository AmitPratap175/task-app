from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
from api import models, schemas
from api.database import get_db

router = APIRouter()

def update_streak(db: Session):
    settings = db.query(models.UserSettings).first()
    if not settings:
        return
    
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    if settings.last_study_date:
        last_study = settings.last_study_date.replace(hour=0, minute=0, second=0, microsecond=0)
        days_diff = (today - last_study).days
        
        if days_diff == 0:
            return
        elif days_diff == 1:
            settings.current_streak += 1
            settings.longest_streak = max(settings.longest_streak, settings.current_streak)
        else:
            settings.current_streak = 1
    else:
        settings.current_streak = 1
        settings.longest_streak = 1
    
    settings.last_study_date = datetime.now()
    db.commit()

@router.get("/tasks", response_model=List[schemas.Task])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=schemas.Task)
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks", response_model=schemas.Task, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.patch("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: str, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.model_dump(exclude_unset=True)
    
    if update_data.get("status") == "completed" and db_task.status != "completed":
        update_data["completed_at"] = datetime.now()
        update_streak(db)
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return None

@router.get("/goals", response_model=List[schemas.Goal])
def get_goals(db: Session = Depends(get_db)):
    goals = db.query(models.Goal).all()
    return goals

@router.get("/goals/{goal_id}", response_model=schemas.Goal)
def get_goal(goal_id: str, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.post("/goals", response_model=schemas.Goal, status_code=201)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    db_goal = models.Goal(**goal.model_dump())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.patch("/goals/{goal_id}", response_model=schemas.Goal)
def update_goal(goal_id: str, goal_update: schemas.GoalUpdate, db: Session = Depends(get_db)):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = goal_update.model_dump(exclude_unset=True)
    
    if update_data.get("status") == "completed" and db_goal.status != "completed":
        update_data["completed_at"] = datetime.now()
    
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/goals/{goal_id}", status_code=204)
def delete_goal(goal_id: str, db: Session = Depends(get_db)):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(db_goal)
    db.commit()
    return None

@router.get("/pomodoro-sessions", response_model=List[schemas.PomodoroSession])
def get_pomodoro_sessions(db: Session = Depends(get_db)):
    sessions = db.query(models.PomodoroSession).all()
    return sessions

@router.post("/pomodoro-sessions", response_model=schemas.PomodoroSession, status_code=201)
def create_pomodoro_session(session: schemas.PomodoroSessionCreate, db: Session = Depends(get_db)):
    db_session = models.PomodoroSession(**session.model_dump())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    if db_session.was_completed:
        update_streak(db)
    
    return db_session

@router.get("/settings", response_model=schemas.UserSettings)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.UserSettings).first()
    if not settings:
        settings = models.UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.patch("/settings", response_model=schemas.UserSettings)
def update_settings(settings_update: schemas.UserSettingsUpdate, db: Session = Depends(get_db)):
    db_settings = db.query(models.UserSettings).first()
    if not db_settings:
        db_settings = models.UserSettings()
        db.add(db_settings)
    
    update_data = settings_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_settings, key, value)
    
    db_settings.updated_at = datetime.now()
    db.commit()
    db.refresh(db_settings)
    return db_settings

@router.get("/analytics/summary", response_model=schemas.AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    now = datetime.now()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    
    tasks = db.query(models.Task).all()
    sessions = db.query(models.PomodoroSession).all()
    settings = db.query(models.UserSettings).first()
    
    total_study_time = sum(s.focus_duration for s in sessions if s.was_completed)
    
    today_study_time = sum(
        s.focus_duration for s in sessions 
        if s.was_completed and s.completed_at and s.completed_at >= today
    )
    
    week_study_time = sum(
        s.focus_duration for s in sessions 
        if s.was_completed and s.completed_at and s.completed_at >= week_ago
    )
    
    tasks_completed_today = len([
        t for t in tasks 
        if t.status == "completed" and t.completed_at and t.completed_at >= today
    ])
    
    tasks_completed_week = len([
        t for t in tasks 
        if t.status == "completed" and t.completed_at and t.completed_at >= week_ago
    ])
    
    subject_map = {}
    for task in tasks:
        if task.subject and task.status == "completed" and task.actual_duration:
            subject_map[task.subject] = subject_map.get(task.subject, 0) + task.actual_duration
    
    subject_distribution = [
        schemas.SubjectDistribution(subject=subject, minutes=minutes)
        for subject, minutes in subject_map.items()
    ]
    
    completed_tasks = len([t for t in tasks if t.status == "completed"])
    completion_rate = round((completed_tasks / len(tasks) * 100)) if tasks else 0
    
    total_sessions = len(sessions)
    completed_sessions = len([s for s in sessions if s.was_completed])
    focus_efficiency = round((completed_sessions / total_sessions * 100)) if total_sessions else 0
    
    current_streak = settings.current_streak if settings else 0
    
    return schemas.AnalyticsSummary(
        total_study_time=total_study_time,
        today_study_time=today_study_time,
        week_study_time=week_study_time,
        tasks_completed_today=tasks_completed_today,
        tasks_completed_week=tasks_completed_week,
        current_streak=current_streak,
        subject_distribution=subject_distribution,
        completion_rate=completion_rate,
        focus_efficiency=focus_efficiency
    )

@router.get("/analytics/daily", response_model=List[schemas.DailyStats])
def get_daily_stats(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    sessions = db.query(models.PomodoroSession).all()
    
    stats_map = {}
    
    for task in tasks:
        if task.completed_at:
            date = task.completed_at.strftime("%Y-%m-%d")
            if date not in stats_map:
                stats_map[date] = {
                    "date": date,
                    "total_minutes_studied": 0,
                    "tasks_completed": 0,
                    "pomodoro_sessions_completed": 0,
                    "subject_breakdown": {}
                }
            stats_map[date]["tasks_completed"] += 1
            if task.actual_duration:
                stats_map[date]["total_minutes_studied"] += task.actual_duration
                if task.subject:
                    stats_map[date]["subject_breakdown"][task.subject] = \
                        stats_map[date]["subject_breakdown"].get(task.subject, 0) + task.actual_duration
    
    for session in sessions:
        if session.was_completed and session.completed_at:
            date = session.completed_at.strftime("%Y-%m-%d")
            if date not in stats_map:
                stats_map[date] = {
                    "date": date,
                    "total_minutes_studied": 0,
                    "tasks_completed": 0,
                    "pomodoro_sessions_completed": 0,
                    "subject_breakdown": {}
                }
            stats_map[date]["pomodoro_sessions_completed"] += 1
            stats_map[date]["total_minutes_studied"] += session.focus_duration
    
    daily_stats = [schemas.DailyStats(**stats) for stats in stats_map.values()]
    daily_stats.sort(key=lambda x: x.date)
    
    return daily_stats

@router.post("/subjects", status_code=201)
def add_subject(subject: str, db: Session = Depends(get_db)):
    settings = db.query(models.UserSettings).first()
    if not settings:
        settings = models.UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    if not settings.custom_subjects:
        settings.custom_subjects = []
    
    if subject not in settings.custom_subjects:
        settings.custom_subjects = settings.custom_subjects + [subject]
        settings.updated_at = datetime.now()
        db.commit()
        db.refresh(settings)
    
    return {"subject": subject, "subjects": settings.custom_subjects}

@router.delete("/subjects/{subject}", status_code=200)
def delete_subject(subject: str, db: Session = Depends(get_db)):
    settings = db.query(models.UserSettings).first()
    if not settings or not settings.custom_subjects:
        raise HTTPException(status_code=404, detail="No subjects found")
    
    if subject in settings.custom_subjects:
        settings.custom_subjects = [s for s in settings.custom_subjects if s != subject]
        settings.updated_at = datetime.now()
        db.commit()
        db.refresh(settings)
    
    return {"subjects": settings.custom_subjects}

@router.post("/reset-all", status_code=200)
def reset_all_data(db: Session = Depends(get_db)):
    db.query(models.Task).delete()
    db.query(models.Goal).delete()
    db.query(models.PomodoroSession).delete()
    
    settings = db.query(models.UserSettings).first()
    if settings:
        settings.current_streak = 0
        settings.longest_streak = 0
        settings.last_study_date = None
        settings.custom_subjects = ["Math", "Physics", "Chemistry", "Biology", "History", "English", "Computer Science", "Other"]
        settings.updated_at = datetime.now()
    
    db.commit()
    
    return {"message": "All data has been reset successfully"}

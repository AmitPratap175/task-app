from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ARRAY, func
from sqlalchemy.dialects.postgresql import UUID
from api.database import Base
import uuid

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(Text, nullable=False)
    description = Column(Text)
    status = Column(Text, nullable=False, default="pending")
    priority = Column(Text, nullable=False, default="important")
    subject = Column(Text)
    deadline = Column(DateTime)
    estimated_duration = Column(Integer)
    actual_duration = Column(Integer)
    parent_task_id = Column(String)
    resources = Column(ARRAY(Text))
    is_recurring = Column(Boolean, default=False)
    recurring_schedule = Column(Text)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(Text, nullable=False)
    description = Column(Text)
    type = Column(Text, nullable=False)
    target_date = Column(DateTime, nullable=False)
    status = Column(Text, nullable=False, default="active")
    progress = Column(Integer, nullable=False, default=0)
    related_task_ids = Column(ARRAY(Text))
    completed_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String)
    focus_duration = Column(Integer, nullable=False)
    break_duration = Column(Integer, nullable=False)
    was_completed = Column(Boolean, nullable=False, default=False)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pomodoro_focus_duration = Column(Integer, nullable=False, default=25)
    pomodoro_break_duration = Column(Integer, nullable=False, default=5)
    theme = Column(Text, nullable=False, default="dark")
    notifications_enabled = Column(Boolean, nullable=False, default=True)
    sound_enabled = Column(Boolean, nullable=False, default=True)
    current_streak = Column(Integer, nullable=False, default=0)
    longest_streak = Column(Integer, nullable=False, default=0)
    last_study_date = Column(DateTime)
    custom_subjects = Column(ARRAY(Text), default=lambda: ["Math", "Physics", "Chemistry", "Biology", "History", "English", "Computer Science", "Other"])
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

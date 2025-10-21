from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Optional, List, Dict
from datetime import datetime

class TaskBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "important"
    subject: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_duration: Optional[int] = None
    actual_duration: Optional[int] = None
    parent_task_id: Optional[str] = None
    resources: Optional[List[str]] = None
    is_recurring: Optional[bool] = False
    recurring_schedule: Optional[str] = None
    completed_at: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    subject: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_duration: Optional[int] = None
    actual_duration: Optional[int] = None
    parent_task_id: Optional[str] = None
    resources: Optional[List[str]] = None
    is_recurring: Optional[bool] = None
    recurring_schedule: Optional[str] = None
    completed_at: Optional[datetime] = None

class Task(TaskBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
    
    id: str
    created_at: datetime

class GoalBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    title: str
    description: Optional[str] = None
    type: str
    target_date: datetime
    status: str = "active"
    progress: int = 0
    related_task_ids: Optional[List[str]] = None
    completed_at: Optional[datetime] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    target_date: Optional[datetime] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    related_task_ids: Optional[List[str]] = None
    completed_at: Optional[datetime] = None

class Goal(GoalBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
    
    id: str
    created_at: datetime

class PomodoroSessionBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    task_id: Optional[str] = None
    focus_duration: int
    break_duration: int
    was_completed: bool = False
    completed_at: Optional[datetime] = None

class PomodoroSessionCreate(PomodoroSessionBase):
    pass

class PomodoroSession(PomodoroSessionBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
    
    id: str
    created_at: datetime

class UserSettingsBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    pomodoro_focus_duration: int = 25
    pomodoro_break_duration: int = 5
    theme: str = "dark"
    notifications_enabled: bool = True
    sound_enabled: bool = True
    current_streak: int = 0
    longest_streak: int = 0
    last_study_date: Optional[datetime] = None

class UserSettingsUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    pomodoro_focus_duration: Optional[int] = None
    pomodoro_break_duration: Optional[int] = None
    theme: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    sound_enabled: Optional[bool] = None
    current_streak: Optional[int] = None
    longest_streak: Optional[int] = None
    last_study_date: Optional[datetime] = None

class UserSettings(UserSettingsBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
    
    id: str
    updated_at: datetime

class SubjectDistribution(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    subject: str
    minutes: int

class AnalyticsSummary(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    total_study_time: int
    today_study_time: int
    week_study_time: int
    tasks_completed_today: int
    tasks_completed_week: int
    current_streak: int
    subject_distribution: List[SubjectDistribution]
    completion_rate: int
    focus_efficiency: int

class DailyStats(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)
    
    date: str
    total_minutes_studied: int
    tasks_completed: int
    pomodoro_sessions_completed: int
    subject_breakdown: Dict[str, int]

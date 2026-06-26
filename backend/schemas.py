from pydantic import BaseModel
from typing import List, Optional
import datetime

# --- General ---
class MessageResponse(BaseModel):
    message: str

# --- Task Dependency ---
class TaskDependencySchema(BaseModel):
    task_id: int
    depends_on_task_id: int

    class Config:
        from_attributes = True

# --- Task ---
class TaskBase(BaseModel):
    title: str
    duration_minutes: int
    energy_required: str
    due_date: str
    milestone_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    duration_minutes: Optional[int] = None
    energy_required: Optional[str] = None
    status: Optional[str] = None
    priority_score: Optional[int] = None
    due_date: Optional[str] = None

class TaskOut(TaskBase):
    id: int
    status: str
    priority_score: int
    created_at: datetime.datetime
    dependencies: List[int] = []  # List of task IDs this task depends on

    class Config:
        from_attributes = True

# --- Milestone ---
class MilestoneBase(BaseModel):
    title: str
    duration: Optional[str] = None

class MilestoneCreate(MilestoneBase):
    goal_id: int

class MilestoneOut(MilestoneBase):
    id: int
    goal_id: int
    status: str
    order: int
    tasks: List[TaskOut] = []

    class Config:
        from_attributes = True

# --- Goal ---
class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: str
    priority: str

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[float] = None

class GoalOut(GoalBase):
    id: int
    status: str
    progress: float
    created_at: datetime.datetime
    milestones: List[MilestoneOut] = []

    class Config:
        from_attributes = True

# --- Habit ---
class HabitBase(BaseModel):
    name: str

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    current_streak: Optional[int] = None
    best_streak: Optional[int] = None
    last_completed: Optional[str] = None

class HabitOut(HabitBase):
    id: int
    current_streak: int
    best_streak: int
    last_completed: Optional[str] = None

    class Config:
        from_attributes = True

# --- Daily Plan ---
class DailyPlanBase(BaseModel):
    date: str

class DailyPlanOut(DailyPlanBase):
    id: int
    completion_rate: float
    planned_count: int
    completed_count: int

    class Config:
        from_attributes = True

# --- User Preference / Memory ---
class UserPreferenceBase(BaseModel):
    interests: str
    preparing_for: str
    open_source_status: str
    energy_morning: str
    energy_afternoon: str
    energy_night: str
    available_hours: float

class UserPreferenceUpdate(BaseModel):
    interests: Optional[str] = None
    preparing_for: Optional[str] = None
    open_source_status: Optional[str] = None
    energy_morning: Optional[str] = None
    energy_afternoon: Optional[str] = None
    energy_night: Optional[str] = None
    available_hours: Optional[float] = None

class UserPreferenceOut(UserPreferenceBase):
    id: int

    class Config:
        from_attributes = True

# --- Achievement ---
class AchievementOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    unlocked_at: Optional[str] = None

    class Config:
        from_attributes = True

# --- Dashboard & Mentor & Portfolio ---
class DashboardOverview(BaseModel):
    daily_plan: List[TaskOut]
    completion_rate: float
    streak_days: int
    overload_warning: bool
    required_hours: float
    available_hours: float
    conflicts: List[str]
    progress_predictions: List[dict]

class MentorMessage(BaseModel):
    role: str  # user or mentor
    content: str

class MentorChatInput(BaseModel):
    message: str
    history: List[MentorMessage] = []

class MentorChatResponse(BaseModel):
    reply: str
    memory_updates: Optional[dict] = None
    recovery_plan: Optional[List[dict]] = None

class PortfolioProject(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    github_link: Optional[str] = None

class PortfolioOut(BaseModel):
    name: str
    title: str
    bio: str
    interests: List[str]
    preparing_for: List[str]
    github_stats: dict
    milestones: List[dict]
    projects: List[PortfolioProject]
    achievements: List[dict]

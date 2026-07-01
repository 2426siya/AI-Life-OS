from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Boolean, Table
from sqlalchemy.orm import relationship
import datetime
from backend.database import Base

# Association table for composite task dependencies
task_dependency = Table(
    "task_dependencies",
    Base.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
    Column("depends_on_task_id", Integer, ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    google_token_json = Column(String, nullable=True)

    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    daily_plans = relationship("DailyPlan", back_populates="user", cascade="all, delete-orphan")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    deadline = Column(String, nullable=False)  # ISO Date String (YYYY-MM-DD)
    priority = Column(String, default="Medium")  # High, Medium, Low
    status = Column(String, default="Pending")  # Pending, In Progress, Completed, Overdue
    progress = Column(Float, default=0.0)  # 0 to 100
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="goals")
    milestones = relationship("Milestone", back_populates="goal", cascade="all, delete-orphan")

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    duration = Column(String, nullable=True)  # e.g. "2 weeks"
    status = Column(String, default="Pending")  # Pending, In Progress, Completed
    order = Column(Integer, default=0)

    goal = relationship("Goal", back_populates="milestones")
    tasks = relationship("Task", back_populates="milestone", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=30)
    energy_required = Column(String, default="Medium")  # High, Medium, Low
    status = Column(String, default="Pending")  # Pending, Completed
    priority_score = Column(Integer, default=50)
    due_date = Column(String, nullable=False)  # ISO Date String (YYYY-MM-DD)
    milestone_id = Column(Integer, ForeignKey("milestones.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    milestone = relationship("Milestone", back_populates="tasks")
    
    # Many-to-many relationship for task dependencies
    dependencies = relationship(
        "Task",
        secondary=task_dependency,
        primaryjoin="Task.id==task_dependencies.c.task_id",
        secondaryjoin="Task.id==task_dependencies.c.depends_on_task_id",
        backref="dependent_on"
    )

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    current_streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    last_completed = Column(String, nullable=True)  # ISO Date String (YYYY-MM-DD)

    user = relationship("User", back_populates="habits")

class DailyPlan(Base):
    __tablename__ = "daily_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(String, nullable=False)  # ISO Date String (YYYY-MM-DD)
    completion_rate = Column(Float, default=0.0)
    planned_count = Column(Integer, default=0)
    completed_count = Column(Integer, default=0)

    user = relationship("User", back_populates="daily_plans")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    interests = Column(String, default="AI/DS, Open Source")  # Comma-separated values
    preparing_for = Column(String, default="Germany MS, GSoC")  # Comma-separated values
    open_source_status = Column(String, default="Active Contributor")
    energy_morning = Column(String, default="High")
    energy_afternoon = Column(String, default="Medium")
    energy_night = Column(String, default="Low")
    available_hours = Column(Float, default=4.0)  # Free hours per day

    user = relationship("User", back_populates="preferences")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, default="🏆")
    unlocked_at = Column(String, nullable=True)  # ISO Date String (YYYY-MM-DD) or None if locked

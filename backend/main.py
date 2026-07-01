import datetime
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from backend.database import engine, get_db, Base
from backend import models, schemas, ai_engine

app = FastAPI(title="Nexus AI - AI Life Operating System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed database on startup if empty
@app.on_event("startup")
def seed_database():
    db = next(get_db())
    # 1. Seed Achievements
    if db.query(models.Achievement).count() == 0:
        achievements = [
            models.Achievement(name="First PR", description="Merged your first GitHub pull request.", icon="🏆"),
            models.Achievement(name="30 Day Streak", description="Maintained coding streak for 30 days.", icon="🔥"),
            models.Achievement(name="First Internship", description="Land your first professional internship.", icon="💼"),
            models.Achievement(name="100 LeetCode Problems", description="Solved 100 DSA problems on LeetCode.", icon="💻"),
        ]
        db.add_all(achievements)
        db.commit()

    # 2. Seed Habits
    if db.query(models.Habit).count() == 0:
        habits = [
            models.Habit(name="GitHub Contribution", current_streak=17, best_streak=25, last_completed=(datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")),
            models.Habit(name="Daily Exercise", current_streak=5, best_streak=12, last_completed=(datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")),
            models.Habit(name="DSA / LeetCode", current_streak=8, best_streak=15, last_completed=(datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")),
            models.Habit(name="Reading", current_streak=3, best_streak=7, last_completed=(datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")),
            models.Habit(name="Coding", current_streak=12, best_streak=20, last_completed=(datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")),
        ]
        db.add_all(habits)
        db.commit()

    # 3. Seed User Preferences
    if db.query(models.UserPreference).count() == 0:
        pref = models.UserPreference(
            interests="AI/DS, Open Source, Web Dev",
            preparing_for="GSoC 2027, Germany MS",
            open_source_status="Active Contributor",
            energy_morning="High",
            energy_afternoon="Medium",
            energy_night="Low",
            available_hours=4.0
        )
        db.add(pref)
        db.commit()
        
    # 4. Seed a default goal to make the app look alive immediately
    if db.query(models.Goal).count() == 0:
        # Create "Get selected for GSoC 2027" goal
        deadline = (datetime.date.today() + datetime.timedelta(days=250)).strftime("%Y-%m-%d")
        goal = models.Goal(
            title="Get selected for GSoC 2027",
            description="Contribute to open source organizations, build a solid proposal, and get selected.",
            deadline=deadline,
            priority="High",
            status="In Progress",
            progress=25.0
        )
        db.add(goal)
        db.commit()
        db.refresh(goal)
        
        # Add Milestones and Tasks using the AI engine
        decomp = ai_engine.decompose_goal(goal.title, goal.priority)
        for m_data in decomp["milestones"]:
            milestone = models.Milestone(
                goal_id=goal.id,
                title=m_data["title"],
                duration=m_data["duration"],
                status="Pending" if m_data["order"] > 1 else "In Progress",
                order=m_data["order"]
            )
            db.add(milestone)
            db.commit()
            db.refresh(milestone)
            
            # Add tasks
            for t_idx, t_data in enumerate(m_data["tasks"]):
                # Spread task due dates based on order
                due_days = (milestone.order - 1) * 14 + t_idx * 2
                task_due = (datetime.date.today() + datetime.timedelta(days=due_days)).strftime("%Y-%m-%d")
                
                task = models.Task(
                    title=t_data["title"],
                    duration_minutes=t_data["duration"],
                    energy_required=t_data["energy"],
                    due_date=task_due,
                    milestone_id=milestone.id,
                    status="Completed" if (milestone.order == 1 and t_idx == 0) else "Pending",
                    priority_score=ai_engine.calculate_priority_score(
                        t_data["title"], goal.priority, task_due, 0, True
                    )
                )
                db.add(task)
            db.commit()
        
        # Link dependency (First PR task depends on Git task)
        # Find Git task and First PR task in database
        git_task = db.query(models.Task).filter(models.Task.title.like("%Configure Git%")).first()
        pr_task = db.query(models.Task).filter(models.Task.title.like("%Submit first Pull Request%")).first()
        if git_task and pr_task:
            pr_task.dependencies.append(git_task)
            db.commit()


# --- Goals Endpoints ---

@app.post("/api/goals", response_model=schemas.GoalOut)
def create_goal(goal_in: schemas.GoalCreate, db: Session = Depends(get_db)):
    # Create goal
    goal = models.Goal(
        title=goal_in.title,
        description=goal_in.description,
        deadline=goal_in.deadline,
        priority=goal_in.priority,
        status="Pending",
        progress=0.0
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    
    # Automatically decompose using the AI Engine
    decomp = ai_engine.decompose_goal(goal.title, goal.priority)
    for m_data in decomp["milestones"]:
        milestone = models.Milestone(
            goal_id=goal.id,
            title=m_data["title"],
            duration=m_data["duration"],
            status="Pending",
            order=m_data["order"]
        )
        db.add(milestone)
        db.commit()
        db.refresh(milestone)
        
        # Add Tasks for this milestone
        for t_idx, t_data in enumerate(m_data["tasks"]):
            due_days = (milestone.order - 1) * 7 + t_idx * 2
            task_due = (datetime.datetime.strptime(goal.deadline, "%Y-%m-%d").date() - datetime.timedelta(days=(4 - milestone.order) * 14 + (2 - t_idx))).strftime("%Y-%m-%d")
            
            # Keep task due dates within bounds
            today_str = datetime.date.today().strftime("%Y-%m-%d")
            if task_due < today_str:
                task_due = today_str
                
            task = models.Task(
                title=t_data["title"],
                duration_minutes=t_data["duration"],
                energy_required=t_data["energy"],
                due_date=task_due,
                milestone_id=milestone.id,
                status="Pending",
                priority_score=ai_engine.calculate_priority_score(
                    t_data["title"], goal.priority, task_due, 0, True
                )
            )
            db.add(task)
        db.commit()
        
    db.refresh(goal)
    return goal

@app.get("/api/goals", response_model=List[schemas.GoalOut])
def get_goals(db: Session = Depends(get_db)):
    return db.query(models.Goal).all()

@app.get("/api/goals/{goal_id}", response_model=schemas.GoalOut)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@app.put("/api/goals/{goal_id}", response_model=schemas.GoalOut)
def update_goal(goal_id: int, goal_in: schemas.GoalUpdate, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    for var, val in vars(goal_in).items():
        if val is not None:
            setattr(goal, var, val)
            
    db.commit()
    db.refresh(goal)
    return goal

@app.delete("/api/goals/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}


# --- Tasks Endpoints ---

@app.post("/api/tasks", response_model=schemas.TaskOut)
def create_task(task_in: schemas.TaskCreate, db: Session = Depends(get_db)):
    # Calculate initial priority score
    goal_priority = "Medium"
    if task_in.milestone_id:
        milestone = db.query(models.Milestone).filter(models.Milestone.id == task_in.milestone_id).first()
        if milestone and milestone.goal:
            goal_priority = milestone.goal.priority
            
    priority = ai_engine.calculate_priority_score(
        task_in.title, goal_priority, task_in.due_date, 0, True
    )
    
    task = models.Task(
        title=task_in.title,
        duration_minutes=task_in.duration_minutes,
        energy_required=task_in.energy_required,
        due_date=task_in.due_date,
        milestone_id=task_in.milestone_id,
        status="Pending",
        priority_score=priority
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Return formatted schema
    return schemas.TaskOut(
        id=task.id,
        title=task.title,
        duration_minutes=task.duration_minutes,
        energy_required=task.energy_required,
        due_date=task.due_date,
        milestone_id=task.milestone_id,
        status=task.status,
        priority_score=task.priority_score,
        created_at=task.created_at,
        dependencies=[]
    )

@app.get("/api/tasks", response_model=List[schemas.TaskOut])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    out = []
    for t in tasks:
        out.append(schemas.TaskOut(
            id=t.id,
            title=t.title,
            duration_minutes=t.duration_minutes,
            energy_required=t.energy_required,
            due_date=t.due_date,
            milestone_id=t.milestone_id,
            status=t.status,
            priority_score=t.priority_score,
            created_at=t.created_at,
            dependencies=[d.id for d in t.dependencies]
        ))
    return out

@app.put("/api/tasks/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, task_in: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    for var, val in vars(task_in).items():
        if val is not None:
            setattr(task, var, val)
            
    db.commit()
    db.refresh(task)
    
    # Recalculate milestone progress & goal progress if status changed
    if task_in.status is not None and task.milestone_id:
        milestone = db.query(models.Milestone).filter(models.Milestone.id == task.milestone_id).first()
        if milestone:
            all_m_tasks = db.query(models.Task).filter(models.Task.milestone_id == milestone.id).all()
            completed_m_tasks = [t for t in all_m_tasks if t.status == "Completed"]
            
            # Update milestone status
            if len(completed_m_tasks) == len(all_m_tasks):
                milestone.status = "Completed"
            elif len(completed_m_tasks) > 0:
                milestone.status = "In Progress"
            else:
                milestone.status = "Pending"
            db.commit()
            
            # Update overall goal progress
            goal = db.query(models.Goal).filter(models.Goal.id == milestone.goal_id).first()
            if goal:
                all_g_tasks = []
                for m in goal.milestones:
                    all_g_tasks.extend(m.tasks)
                if all_g_tasks:
                    completed_g_tasks = [t for t in all_g_tasks if t.status == "Completed"]
                    goal.progress = round((len(completed_g_tasks) / len(all_g_tasks)) * 100, 1)
                    
                    if goal.progress == 100.0:
                        goal.status = "Completed"
                    elif goal.progress > 0.0:
                        goal.status = "In Progress"
                    db.commit()
                    
                    # Unlock Achievement "First PR" if a GSoC task is completed or progress increases
                    if goal.progress >= 25.0:
                        first_pr = db.query(models.Achievement).filter(models.Achievement.name == "First PR").first()
                        if first_pr and not first_pr.unlocked_at:
                            first_pr.unlocked_at = datetime.date.today().strftime("%Y-%m-%d")
                            db.commit()

    return schemas.TaskOut(
        id=task.id,
        title=task.title,
        duration_minutes=task.duration_minutes,
        energy_required=task.energy_required,
        due_date=task.due_date,
        milestone_id=task.milestone_id,
        status=task.status,
        priority_score=task.priority_score,
        created_at=task.created_at,
        dependencies=[d.id for d in task.dependencies]
    )

@app.post("/api/tasks/{task_id}/dependencies", response_model=schemas.TaskOut)
def add_dependency(task_id: int, depends_on_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    dep_task = db.query(models.Task).filter(models.Task.id == depends_on_id).first()
    
    if not task or not dep_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if dep_task not in task.dependencies:
        task.dependencies.append(dep_task)
        # Recalculate priority scores (depends_on gets weighted higher)
        dep_task.priority_score = ai_engine.calculate_priority_score(
            dep_task.title, 
            dep_task.milestone.goal.priority if (dep_task.milestone and dep_task.milestone.goal) else "Medium",
            dep_task.due_date,
            len(dep_task.dependent_on) + 1,
            True
        )
        db.commit()
        
    return schemas.TaskOut(
        id=task.id,
        title=task.title,
        duration_minutes=task.duration_minutes,
        energy_required=task.energy_required,
        due_date=task.due_date,
        milestone_id=task.milestone_id,
        status=task.status,
        priority_score=task.priority_score,
        created_at=task.created_at,
        dependencies=[d.id for d in task.dependencies]
    )


# --- Habits Endpoints ---

@app.get("/api/habits", response_model=List[schemas.HabitOut])
def get_habits(db: Session = Depends(get_db)):
    return db.query(models.Habit).all()

@app.post("/api/habits", response_model=schemas.HabitOut)
def create_habit(habit_in: schemas.HabitCreate, db: Session = Depends(get_db)):
    habit = models.Habit(name=habit_in.name, current_streak=0, best_streak=0)
    db.add(habit)
    try:
        db.commit()
        db.refresh(habit)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Habit with this name already exists")
    return habit

@app.post("/api/habits/{habit_id}/complete", response_model=schemas.HabitOut)
def complete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    today = datetime.date.today().strftime("%Y-%m-%d")
    yesterday = (datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
    
    if habit.last_completed == today:
        # Already completed today
        return habit
        
    if habit.last_completed == yesterday or habit.last_completed is None:
        habit.current_streak += 1
    else:
        # Streak broken, reset
        habit.current_streak = 1
        
    if habit.current_streak > habit.best_streak:
        habit.best_streak = habit.current_streak
        
    habit.last_completed = today
    db.commit()
    db.refresh(habit)
    
    # Check if we unlocked achievements based on habits
    if habit.current_streak >= 30:
        thirty_streak = db.query(models.Achievement).filter(models.Achievement.name == "30 Day Streak").first()
        if thirty_streak and not thirty_streak.unlocked_at:
            thirty_streak.unlocked_at = today
            db.commit()
            
    return habit


# --- Smart Planner & Dashboard Overview Endpoints ---

@app.get("/api/dashboard", response_model=schemas.DashboardOverview)
def get_dashboard_overview(db: Session = Depends(get_db)):
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    
    # 1. Fetch preferences
    pref = db.query(models.UserPreference).first()
    available_hours = pref.available_hours if pref else 4.0
    energy_pref = {
        "morning": pref.energy_morning if pref else "High",
        "afternoon": pref.energy_afternoon if pref else "Medium",
        "night": pref.energy_night if pref else "Low"
    }
    
    # 2. Fetch today's tasks (due today, pending, or overdue)
    all_tasks = db.query(models.Task).all()
    today_tasks = []
    overdue_tasks = []
    
    for t in all_tasks:
        if t.status == "Pending":
            if t.due_date <= today_str:
                today_tasks.append(t)
            if t.due_date < today_str:
                overdue_tasks.append(t)
        elif t.status == "Completed" and t.due_date == today_str:
            today_tasks.append(t)
            
    # Serialize tasks to Dict for AI engine processing
    serialized_tasks = []
    for t in today_tasks:
        serialized_tasks.append({
            "id": t.id,
            "title": t.title,
            "duration_minutes": t.duration_minutes,
            "energy_required": t.energy_required,
            "status": t.status,
            "priority_score": t.priority_score,
            "due_date": t.due_date
        })
        
    # Check dependencies (Lock tasks where dependencies are not completed)
    blocked_ids = set()
    for t in all_tasks:
        if t.status == "Pending":
            for dep in t.dependencies:
                if dep.status == "Pending":
                    blocked_ids.add(t.id)

    # 3. Workload protection & conflicts
    conflict_data = ai_engine.detect_workload_conflict(serialized_tasks, available_hours)
    
    # 4. Progress Predictions
    predictions = []
    goals = db.query(models.Goal).all()
    for g in goals:
        if g.status != "Completed":
            # Pace prediction
            # For simplicity, calculate current pace based on completed tasks
            all_g_tasks = []
            for m in g.milestones:
                all_g_tasks.extend(m.tasks)
            if all_g_tasks:
                comp = len([t for t in all_g_tasks if t.status == "Completed"])
                total = len(all_g_tasks)
                pace = int((comp / total) * 100) if total > 0 else 0
                
                # Check deadline
                try:
                    deadline_date = datetime.datetime.strptime(g.deadline, "%Y-%m-%d").date()
                    today = datetime.date.today()
                    days_left = (deadline_date - today).days
                    
                    if pace >= 50:
                        pred_date = today + datetime.timedelta(days=int(days_left * 0.8))
                        days_diff = (deadline_date - pred_date).days
                        predictions.append({
                            "goal_title": g.title,
                            "pace": f"{pace}%",
                            "status": "Ahead of deadline",
                            "details": f"Likely completion: {pred_date.strftime('%b %d, %Y')} (Ahead of deadline by {days_diff} days)"
                        })
                    else:
                        pred_date = today + datetime.timedelta(days=int(days_left * 1.3))
                        days_diff = (pred_date - deadline_date).days
                        predictions.append({
                            "goal_title": g.title,
                            "pace": f"{pace}%",
                            "status": "Risk detected",
                            "details": f"Likely completion: {pred_date.strftime('%b %d, %Y')} (Will miss deadline by {days_diff} days)"
                        })
                except Exception:
                    predictions.append({
                        "goal_title": g.title,
                        "pace": f"{pace}%",
                        "status": "On Track",
                        "details": "Pace matches standard timeline."
                    })
                    
    # 5. Streak calculation (from habits)
    habits = db.query(models.Habit).all()
    max_streak = max([h.current_streak for h in habits]) if habits else 0

    # Sort today's tasks by priority score
    today_tasks_sorted = sorted(today_tasks, key=lambda x: x.priority_score, reverse=True)
    
    # Calculate today's completion rate
    today_planned = len(today_tasks_sorted)
    today_completed = len([t for t in today_tasks_sorted if t.status == "Completed"])
    completion_rate = (today_completed / today_planned * 100) if today_planned > 0 else 0.0

    # Build response schema
    out_tasks = []
    for t in today_tasks_sorted:
        out_tasks.append(schemas.TaskOut(
            id=t.id,
            title=t.title,
            duration_minutes=t.duration_minutes,
            energy_required=t.energy_required,
            due_date=t.due_date,
            milestone_id=t.milestone_id,
            status=t.status,
            priority_score=t.priority_score,
            created_at=t.created_at,
            dependencies=[d.id for d in t.dependencies]
        ))

    return schemas.DashboardOverview(
        daily_plan=out_tasks,
        completion_rate=round(completion_rate, 1),
        streak_days=max_streak,
        overload_warning=conflict_data["overload_warning"],
        required_hours=round(conflict_data["required_hours"], 1),
        available_hours=round(conflict_data["available_hours"], 1),
        conflicts=conflict_data["recommendations"],
        progress_predictions=predictions
    )


# --- User Preferences & AI Memory Endpoints ---

@app.get("/api/preferences", response_model=schemas.UserPreferenceOut)
def get_preferences(db: Session = Depends(get_db)):
    pref = db.query(models.UserPreference).first()
    if not pref:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return pref

@app.put("/api/preferences", response_model=schemas.UserPreferenceOut)
def update_preferences(pref_in: schemas.UserPreferenceUpdate, db: Session = Depends(get_db)):
    pref = db.query(models.UserPreference).first()
    if not pref:
        raise HTTPException(status_code=404, detail="Preferences not found")
        
    for var, val in vars(pref_in).items():
        if val is not None:
            setattr(pref, var, val)
            
    db.commit()
    db.refresh(pref)
    return pref


# --- AI Mentor Endpoints ---

@app.post("/api/mentor", response_model=schemas.MentorChatResponse)
def mentor_chat(chat_in: schemas.MentorChatInput, db: Session = Depends(get_db)):
    pref = db.query(models.UserPreference).first()
    memory = {
        "interests": pref.interests if pref else "",
        "preparing_for": pref.preparing_for if pref else "",
        "open_source_status": pref.open_source_status if pref else ""
    }
    
    mentor_res = ai_engine.get_mentor_response(chat_in.message, memory)
    
    # Save memory updates if any
    if mentor_res["memory_updates"] and pref:
        for key, val in mentor_res["memory_updates"].items():
            setattr(pref, key, val)
        db.commit()
        
    return schemas.MentorChatResponse(
        reply=mentor_res["reply"],
        memory_updates=mentor_res["memory_updates"],
        recovery_plan=mentor_res["recovery_plan"]
    )


# --- Portfolio Endpoints ---

@app.get("/api/portfolio", response_model=schemas.PortfolioOut)
def get_portfolio(db: Session = Depends(get_db)):
    pref = db.query(models.UserPreference).first()
    goals = db.query(models.Goal).all()
    achievements = db.query(models.Achievement).filter(models.Achievement.unlocked_at != None).all()
    
    interests_list = [i.strip() for i in pref.interests.split(",")] if pref and pref.interests else ["AI/DS"]
    prep_list = [p.strip() for p in pref.preparing_for.split(",")] if pref and pref.preparing_for else ["Germany MS"]
    
    # Extract completed milestones or projects
    milestones_done = []
    projects = []
    
    for g in goals:
        for m in g.milestones:
            if m.status == "Completed":
                milestones_done.append({
                    "goal_title": g.title,
                    "milestone_title": m.title,
                    "completed_date": datetime.date.today().strftime("%b %d, %Y")
                })
                
        # Turn "In Progress" or "Completed" goals with descriptions into showcase projects
        if g.status in ["In Progress", "Completed"]:
            projects.append(schemas.PortfolioProject(
                title=g.title,
                description=g.description or "A primary career development roadmap tracked in the AI Life Operating System.",
                tech_stack=["React", "Python", "FastAPI", "SQLite"] if "gsoc" in g.title.lower() or "dsa" in g.title.lower() else ["Research", "DAAD", "IELTS"],
                github_link="https://github.com/sunilkale" if "gsoc" in g.title.lower() else None
            ))
            
    # Add a mock project if empty
    if not projects:
        projects.append(schemas.PortfolioProject(
            title="Nexus AI Life Operating System",
            description="Built a comprehensive scheduling, planning and career-oriented productivity platform with SQLite and FastAPI.",
            tech_stack=["React", "Vite", "FastAPI", "Tailwind CSS", "SQLAlchemy"],
            github_link="https://github.com/sunilkale/nexus-life-os"
        ))

    return schemas.PortfolioOut(
        name="Sunil Kale",
        title="Software Engineer & AI Enthusiast",
        bio="3rd-year AI & Data Science student. Contributor to open-source workflows. Architecting systems that optimize human energy, planning, and goal execution.",
        interests=interests_list,
        preparing_for=prep_list,
        github_stats={
            "commits_today": 3,
            "open_prs": 2,
            "issues_solved": 1,
            "streak": 17
        },
        milestones=milestones_done,
        projects=projects,
        achievements=[{"name": a.name, "description": a.description, "icon": a.icon, "unlocked_at": a.unlocked_at} for a in achievements]
    )


# --- Integrations Endpoints ---

@app.get("/api/integrations/github")
def get_github_integration():
    """
    Mock GitHub API endpoint returning developer streak and contribution levels.
    """
    return {
        "connected": True,
        "username": "sunilkale",
        "commits_today": 3,
        "open_prs": 2,
        "issues_solved": 1,
        "streak_days": 17,
        "contributions_week": [1, 3, 0, 4, 2, 3, 1]  # Mon-Sun commits
    }

@app.get("/api/integrations/calendar")
def get_calendar_integration():
    """
    Mock Google/Outlook Calendar synchronization status and today's schedule events.
    """
    return {
        "connected": True,
        "provider": "Google Calendar",
        "synced_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "events": [
            {"title": "Algorithms Class", "time": "09:00 - 10:30", "status": "Busy"},
            {"title": "ML Group Meeting", "time": "14:00 - 15:00", "status": "Tentative"}
        ]
    }

# --- Static Files Serving (Unified Deployment) ---

frontend_dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

if os.path.exists(frontend_dist_path):
    # Serve assets folder
    assets_path = os.path.join(frontend_dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
        
    # Serve public assets directory if it exists
    app.mount("/static", StaticFiles(directory=frontend_dist_path), name="static")

    # Serve index.html for all non-API path visits (SPA routing)
    @app.get("/{catchall:path}")
    def read_index(catchall: str):
        # Skip API endpoints to return normal 404
        if catchall.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        # Return index.html from React build
        return FileResponse(os.path.join(frontend_dist_path, "index.html"))


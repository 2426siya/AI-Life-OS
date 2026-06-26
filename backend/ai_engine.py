import datetime
import re
from typing import List, Dict, Any, Optional

def decompose_goal(title: str, priority: str) -> Dict[str, Any]:
    """
    Decomposes a goal title into milestone names, durations, and suggested tasks.
    Uses smart pattern matching to provide highly realistic breakdowns for student goals.
    """
    title_lower = title.lower()
    
    # 1. GSoC / Open Source
    if "gsoc" in title_lower or "google summer of code" in title_lower or "open source" in title_lower:
        return {
            "milestones": [
                {"title": "Learn Git & GitHub Workflow", "duration": "2 weeks", "order": 1, "tasks": [
                    {"title": "Configure Git & practice branching", "duration": 45, "energy": "Medium"},
                    {"title": "Create a dummy repo and practice merge conflicts", "duration": 60, "energy": "High"},
                    {"title": "Read GitHub flow documentation", "duration": 30, "energy": "Low"}
                ]},
                {"title": "Find Organizations & Setup Projects", "duration": "3 weeks", "order": 2, "tasks": [
                    {"title": "Browse GSoC org list and pick 3 target orgs", "duration": 90, "energy": "Medium"},
                    {"title": "Clone org repos and build project locally", "duration": 120, "energy": "High"},
                    {"title": "Introduce yourself on communication channels (Slack/Gitter)", "duration": 45, "energy": "Low"}
                ]},
                {"title": "First Contributions & Issue Solving", "duration": "4 weeks", "order": 3, "tasks": [
                    {"title": "Search for 'good first issues' in chosen repos", "duration": 60, "energy": "Medium"},
                    {"title": "Draft fix for simple documentation or test issue", "duration": 90, "energy": "High"},
                    {"title": "Submit first Pull Request and address feedback", "duration": 90, "energy": "High"}
                ]},
                {"title": "Proposal Writing & Final Application", "duration": "3 weeks", "order": 4, "tasks": [
                    {"title": "Draft GSoC project proposal section by section", "duration": 120, "energy": "High"},
                    {"title": "Ask organization mentors for feedback on draft proposal", "duration": 60, "energy": "Medium"},
                    {"title": "Submit final proposal on GSoC portal", "duration": 45, "energy": "Low"}
                ]}
            ]
        }
    
    # 2. Germany MS / Study Abroad
    elif "germany" in title_lower or "ms" in title_lower or "study abroad" in title_lower or "university application" in title_lower:
        return {
            "milestones": [
                {"title": "Research Universities & Course Selection", "duration": "3 weeks", "order": 1, "tasks": [
                    {"title": "Create sheet of DAAD Master's programs & deadlines", "duration": 90, "energy": "Medium"},
                    {"title": "Review admission requirements for top 5 choices", "duration": 60, "energy": "Medium"},
                    {"title": "Check English/German proficiency level requirements", "duration": 30, "energy": "Low"}
                ]},
                {"title": "Document Preparation (SOP & LORs)", "duration": "4 weeks", "order": 2, "tasks": [
                    {"title": "Draft Statement of Purpose (SOP) first cut", "duration": 120, "energy": "High"},
                    {"title": "Reach out to professors for 2 Letters of Recommendation", "duration": 45, "energy": "Medium"},
                    {"title": "Translate and certify academic transcripts", "duration": 60, "energy": "Low"}
                ]},
                {"title": "Language Proficiency Exams (IELTS/TestDaF)", "duration": "4 weeks", "order": 3, "tasks": [
                    {"title": "Take a diagnostic IELTS mock exam", "duration": 150, "energy": "High"},
                    {"title": "Practice IELTS Reading & Listening papers", "duration": 60, "energy": "Medium"},
                    {"title": "Review IELTS Writing template and draft 2 essays", "duration": 90, "energy": "High"}
                ]},
                {"title": "Application Submission & Funding", "duration": "3 weeks", "order": 4, "tasks": [
                    {"title": "Fill out Uni-Assist application portal profiles", "duration": 120, "energy": "Medium"},
                    {"title": "Submit applications and pay handling fees", "duration": 60, "energy": "Low"},
                    {"title": "Research scholarship opportunities (DAAD/EPOS)", "duration": 90, "energy": "Medium"}
                ]}
            ]
        }

    # 3. IELTS Exam Prep specifically
    elif "ielts" in title_lower:
        return {
            "milestones": [
                {"title": "Diagnostic & Study Planning", "duration": "1 week", "order": 1, "tasks": [
                    {"title": "Review IELTS exam structure and band descriptors", "duration": 45, "energy": "Low"},
                    {"title": "Complete a full diagnostic Listening and Reading test", "duration": 120, "energy": "High"}
                ]},
                {"title": "Listening and Reading Mastery", "duration": "2 weeks", "order": 2, "tasks": [
                    {"title": "Practice active listening with BBC Podcasts and mock tasks", "duration": 45, "energy": "Medium"},
                    {"title": "Complete 3 academic reading passage tests & analyze errors", "duration": 60, "energy": "High"}
                ]},
                {"title": "Writing and Speaking Practice", "duration": "2 weeks", "order": 3, "tasks": [
                    {"title": "Write 2 reports for Academic Writing Task 1", "duration": 60, "energy": "High"},
                    {"title": "Write 2 essays for Writing Task 2", "duration": 80, "energy": "High"},
                    {"title": "Record yourself speaking on 3 Cue Card topics", "duration": 45, "energy": "Medium"}
                ]},
                {"title": "Full Length Mocks & Fine Tuning", "duration": "2 weeks", "order": 4, "tasks": [
                    {"title": "Perform a complete timed 3-hour IELTS Mock Exam", "duration": 180, "energy": "High"},
                    {"title": "Check answers, rewrite weak essays, review speaking", "duration": 90, "energy": "Medium"}
                ]}
            ]
        }

    # 4. DSA / LeetCode / Job Prep
    elif "dsa" in title_lower or "leetcode" in title_lower or "interview" in title_lower or "data structures" in title_lower:
        return {
            "milestones": [
                {"title": "Data Structures & Easy Problems", "duration": "2 weeks", "order": 1, "tasks": [
                    {"title": "Revise Time Complexity & Space Complexity basics", "duration": 45, "energy": "Low"},
                    {"title": "Solve 10 LeetCode Easy questions (Arrays & Hashing)", "duration": 90, "energy": "High"},
                    {"title": "Implement Singly & Doubly Linked Lists from scratch", "duration": 60, "energy": "High"}
                ]},
                {"title": "Intermediate Techniques & Stacks/Queues", "duration": "2 weeks", "order": 2, "tasks": [
                    {"title": "Practice Two Pointer and Sliding Window questions", "duration": 90, "energy": "High"},
                    {"title": "Solve Stack implementation & Min-Stack problems", "duration": 60, "energy": "Medium"}
                ]},
                {"title": "Non-Linear Structures (Trees & Graphs)", "duration": "3 weeks", "order": 3, "tasks": [
                    {"title": "Implement BST traversal (Pre/In/Post/Levelorder)", "duration": 90, "energy": "High"},
                    {"title": "Solve Graph BFS/DFS standard questions", "duration": 120, "energy": "High"},
                    {"title": "Implement Dijkstra's shortest path algorithm", "duration": 90, "energy": "High"}
                ]},
                {"title": "Advanced Topics & Dynamic Programming", "duration": "3 weeks", "order": 4, "tasks": [
                    {"title": "Solve 5 1D-Dynamic Programming classical problems", "duration": 120, "energy": "High"},
                    {"title": "Revise heap & priority queue questions", "duration": 60, "energy": "Medium"},
                    {"title": "Perform a mock coding interview on Pramp or matching platform", "duration": 90, "energy": "High"}
                ]}
            ]
        }
        
    # 5. Default Generic Goal decomposition
    else:
        capitalized_title = title.strip()
        return {
            "milestones": [
                {"title": f"Initial Research & Setup for {capitalized_title}", "duration": "1 week", "order": 1, "tasks": [
                    {"title": f"Outline resources, blogs, or docs needed for {capitalized_title}", "duration": 45, "energy": "Low"},
                    {"title": "Establish workspace, tools, or folders environment", "duration": 60, "energy": "Medium"}
                ]},
                {"title": "Foundational Learning & Core Concepts", "duration": "2 weeks", "order": 2, "tasks": [
                    {"title": "Study the basic terminology and core syntax/principles", "duration": 90, "energy": "High"},
                    {"title": "Complete 3 basic exercises/tutorials", "duration": 60, "energy": "Medium"}
                ]},
                {"title": "Build First Version & Practice", "duration": "3 weeks", "order": 3, "tasks": [
                    {"title": "Create a sandbox draft or minor mini-project", "duration": 120, "energy": "High"},
                    {"title": "Debug errors and refine implementation", "duration": 90, "energy": "High"}
                ]},
                {"title": "Review, Polish & Final Completion", "duration": "1 week", "order": 4, "tasks": [
                    {"title": "Double check work against initial requirements", "duration": 60, "energy": "Medium"},
                    {"title": "Publish work, clean-up, and plan next steps", "duration": 45, "energy": "Low"}
                ]}
            ]
        }

def calculate_priority_score(task_title: str, goal_priority: str, due_date_str: str, dependency_count: int, energy_match: bool) -> int:
    """
    Priority Score = Deadline Weight + Goal Importance + Dependency Weight + User Preference
    """
    # 1. Goal Importance
    importance_weight = 10
    if goal_priority.lower() == "high":
        importance_weight = 30
    elif goal_priority.lower() == "medium":
        importance_weight = 20
        
    # 2. Deadline Weight
    deadline_weight = 0
    try:
        due_date = datetime.datetime.strptime(due_date_str, "%Y-%m-%d").date()
        today = datetime.date.today()
        days_rem = (due_date - today).days
        
        if days_rem <= 0:
            deadline_weight = 40  # Overdue or due today
        elif days_rem <= 1:
            deadline_weight = 35
        elif days_rem <= 3:
            deadline_weight = 25
        elif days_rem <= 7:
            deadline_weight = 15
        elif days_rem <= 14:
            deadline_weight = 8
        else:
            deadline_weight = 2
    except Exception:
        deadline_weight = 5
        
    # 3. Dependency Weight
    # Tasks that are required by other tasks get a higher weight
    dependency_weight = dependency_count * 15
    
    # 4. User Preference / Energy Match
    preference_weight = 10 if energy_match else 0
    
    score = deadline_weight + importance_weight + dependency_weight + preference_weight
    # Cap between 0 and 100
    return max(0, min(100, score))

def generate_energy_schedule(tasks: List[Dict[str, Any]], energy_pref: Dict[str, str], available_hours: float) -> Dict[str, List[Dict[str, Any]]]:
    """
    Schedules tasks into Morning, Afternoon, and Night blocks based on energy levels:
    - High Energy slot: high-energy tasks
    - Medium Energy slot: medium-energy tasks
    - Low Energy slot: low-energy tasks
    Respects available workload hours.
    """
    # Group tasks by required energy
    high_tasks = [t for t in tasks if t["energy_required"].lower() == "high"]
    medium_tasks = [t for t in tasks if t["energy_required"].lower() == "medium"]
    low_tasks = [t for t in tasks if t["energy_required"].lower() == "low"]
    
    schedule = {
        "morning": [],
        "afternoon": [],
        "night": []
    }
    
    # Map energy periods to buckets
    # e.g. energy_pref = {"morning": "High", "afternoon": "Medium", "night": "Low"}
    def get_period_by_energy(energy_level: str) -> str:
        for period, level in energy_pref.items():
            if level.lower() == energy_level.lower():
                return period
        # Default fallback
        if energy_level.lower() == "high":
            return "morning"
        elif energy_level.lower() == "medium":
            return "afternoon"
        else:
            return "night"

    # Distribute tasks
    high_period = get_period_by_energy("high")
    medium_period = get_period_by_energy("medium")
    low_period = get_period_by_energy("low")
    
    total_minutes_allowed = available_hours * 60
    current_minutes = 0
    
    # We want to schedule highest priority tasks first
    sorted_tasks = sorted(tasks, key=lambda x: x.get("priority_score", 50), reverse=True)
    
    for t in sorted_tasks:
        if current_minutes + t["duration_minutes"] > total_minutes_allowed:
            # Overload: Skip this task for today or flag it
            continue
            
        req_energy = t["energy_required"].lower()
        if req_energy == "high":
            schedule[high_period].append(t)
        elif req_energy == "medium":
            schedule[medium_period].append(t)
        else:
            schedule[low_period].append(t)
            
        current_minutes += t["duration_minutes"]
        
    return schedule

def detect_workload_conflict(tasks: List[Dict[str, Any]], available_hours: float) -> Dict[str, Any]:
    """
    Computes required hours vs available hours and outputs a conflict flag with recommendations.
    """
    total_minutes = sum(t["duration_minutes"] for t in tasks)
    required_hours = total_minutes / 60.0
    
    overload = required_hours > available_hours
    recommendations = []
    
    if overload:
        diff = required_hours - available_hours
        recommendations.append(f"Your current goals require {required_hours:.1f} hrs/day, but you only have {available_hours:.1f} hrs/day available (Deficit of {diff:.1f} hrs/day).")
        
        # Look for low-priority tasks or specific subjects to reschedule
        ielts_tasks = [t for t in tasks if "ielts" in t["title"].lower()]
        dsa_tasks = [t for t in tasks if "dsa" in t["title"].lower() or "leetcode" in t["title"].lower()]
        
        if ielts_tasks:
            recommendations.append("Suggestion: Reduce IELTS practice from daily to 3x/week (Saves ~30-60 min/day).")
        if dsa_tasks and len(dsa_tasks) > 2:
            recommendations.append("Suggestion: Reschedule non-urgent LeetCode tasks to next week (Saves ~90 min/day).")
        if not recommendations or len(recommendations) == 1:
            recommendations.append("Suggestion: Spread out GSoC milestones, shifting coding tasks later to buffer the workload.")
            
    return {
        "overload_warning": overload,
        "required_hours": required_hours,
        "available_hours": available_hours,
        "recommendations": recommendations
    }

def generate_recovery_plan(missed_tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates a recovery plan for missed tasks, spreading them out over days.
    Avoids the 'guilt-based design' of listing 7+ overdue tasks all on one day.
    """
    recovery_plan = []
    if not missed_tasks:
        return recovery_plan
        
    # Sort by priority
    sorted_missed = sorted(missed_tasks, key=lambda x: x.get("priority_score", 50), reverse=True)
    
    # Spread tasks: 1-2 tasks per day max, starting tomorrow
    today = datetime.date.today()
    for idx, task in enumerate(sorted_missed):
        days_delay = (idx // 2) + 1  # 2 tasks per day
        scheduled_date = today + datetime.timedelta(days=days_delay)
        
        recovery_plan.append({
            "task_id": task["id"],
            "title": task["title"],
            "original_due_date": task["due_date"],
            "recovery_due_date": scheduled_date.strftime("%Y-%m-%d"),
            "phase": f"Recovery Day {days_delay}"
        })
        
    return recovery_plan

def get_mentor_response(user_msg: str, memory: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates a highly personalized response from the AI Mentor.
    Uses user interests, preparing_for, and goals stored in memory.
    """
    msg_lower = user_msg.lower()
    reply = ""
    memory_updates = None
    recovery_plan = None
    
    # 1. Recovery query / Welcome Back
    if "recovery" in msg_lower or "missed" in msg_lower or "back" in msg_lower or "catch up" in msg_lower:
        reply = (
            "Welcome back! Don't worry about the missed days. Life operating systems are about adapting, not piling on guilt. "
            "I have generated an Emergency Recovery Plan that distributes your pending items over the next 7 days, "
            "focusing strictly on high-impact GSoC contributions and core coding. Let's start small today!"
        )
        recovery_plan = [
            {"day": 1, "focus": "GSoC git branching and minor readme update", "load": "30 mins"},
            {"day": 2, "focus": "LeetCode array problems", "load": "45 mins"},
            {"day": 3, "focus": "Research GSoC organization codebases", "load": "60 mins"},
            {"day": 4, "focus": "Short IELTS reading practice", "load": "30 mins"},
            {"day": 5, "focus": "First mock pull request setup", "load": "60 mins"},
            {"day": 6, "focus": "Mock interview questions", "load": "45 mins"},
            {"day": 7, "focus": "Rest & review weekly commits", "load": "30 mins"}
        ]
        
    # 2. Advice on becoming Data Scientist / Career advice
    elif "data scientist" in msg_lower or "ds" in msg_lower or "machine learning" in msg_lower or "ml" in msg_lower:
        interests = memory.get("interests", "")
        if "AI/DS" not in interests:
            memory_updates = {"interests": interests + ", AI/DS" if interests else "AI/DS"}
            
        reply = (
            "To become a standout Data Scientist, focus on three pillars: \n"
            "1. **Core DSA & Maths**: Strengthen probability, statistics, and linear algebra.\n"
            "2. **Open Source & Python**: Contribute to scikit-learn, pandas, or Hugging Face. This goes on your GSoC resume.\n"
            "3. **End-to-End Projects**: Build ML APIs (using FastAPI) and deploy them to show production skills. \n\n"
            "I've updated your interests database to prioritize AI/DS projects."
        )
        
    # 3. Germany MS / Study abroad
    elif "germany" in msg_lower or "study abroad" in msg_lower or "ielts" in msg_lower:
        reply = (
            "Preparing for MS in Germany requires keeping a strict timeline. "
            "Since German universities look for high academic grades and a solid IELTS band (typically 6.5+ or 7.0+), "
            "make sure to score high in IELTS. I recommend completing 2 practice reading tests a week. "
            "Also, ensure your SOP highlights your open-source contributions!"
        )
        
    # 4. GSoC
    elif "gsoc" in msg_lower or "google summer of code" in msg_lower:
        reply = (
            "GSoC 2027 selection hinges on making early, meaningful contributions. "
            "Don't wait for the organization announcement! Find projects that were selected in 2026, "
            "join their mailing lists, and fix simple README bugs or unit test issues. "
            "One active contribution today keeps you miles ahead of the competition."
        )
        
    # 5. Default Response
    else:
        interests = memory.get("interests", "coding")
        prep = memory.get("preparing_for", "exams")
        reply = (
            f"I am monitoring your goals in {prep}. Based on your interest in {interests}, "
            "my recommendation is to focus 70% of your energy on code contributions and 30% on academic preparations. "
            "Would you like me to customize your daily schedule or review your current workload conflicts?"
        )
        
    return {
        "reply": reply,
        "memory_updates": memory_updates,
        "recovery_plan": recovery_plan
    }

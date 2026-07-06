import { useState, useEffect } from "react";
import { 
  Lock, 
  Sun, 
  CloudSun, 
  Moon, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  Clock,
  Plus,
  PlusCircle,
  AlertCircle
} from "lucide-react";


interface PlannerTabProps {
  apiError: boolean;
}

export default function PlannerTab({ apiError }: PlannerTabProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<string | null>(null);

  // Add Task Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDuration, setTaskDuration] = useState<number>(30);
  const [taskEnergy, setTaskEnergy] = useState<string>("Medium");
  const [taskDueDate, setTaskDueDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | "">("");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number | "">("");
  const [addTaskError, setAddTaskError] = useState<string | null>(null);

  const fetchTasks = () => {
    fetch("/api/tasks")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback Mock Tasks with Dependencies
        setTasks([
          { id: 101, title: "Configure Git & practice branching", duration_minutes: 45, energy_required: "Medium", status: "Completed", priority_score: 95, due_date: "2026-06-26", dependencies: [] },
          { id: 102, title: "Practice IELTS Reading & Listening papers", duration_minutes: 60, energy_required: "High", status: "Pending", priority_score: 80, due_date: "2026-06-26", dependencies: [] },
          { id: 103, title: "Clone org repos and build project locally", duration_minutes: 120, energy_required: "High", status: "Pending", priority_score: 75, due_date: "2026-06-26", dependencies: [101] }, // Depends on Git config
          { id: 104, title: "Submit first Pull Request and address feedback", duration_minutes: 90, energy_required: "High", status: "Pending", priority_score: 85, due_date: "2026-06-27", dependencies: [103] }, // Depends on cloning
          { id: 105, title: "Introduce yourself on Slack channel", duration_minutes: 30, energy_required: "Low", status: "Pending", priority_score: 60, due_date: "2026-06-26", dependencies: [] }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (showAddForm) {
      fetch("/api/goals")
        .then(res => res.json())
        .then(data => setGoals(data))
        .catch(() => {});
    }
  }, [showAddForm]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate || !selectedMilestoneId) {
      setAddTaskError("Please fill out all required fields, including selecting a goal and milestone.");
      return;
    }

    setAddTaskError(null);
    const newTaskData = {
      title: taskTitle,
      duration_minutes: Number(taskDuration),
      energy_required: taskEnergy,
      due_date: taskDueDate,
      milestone_id: Number(selectedMilestoneId)
    };

    if (apiError) {
      // Mock local add
      const mockTask = {
        id: Date.now(),
        ...newTaskData,
        status: "Pending",
        priority_score: 55,
        dependencies: []
      };
      setTasks([mockTask, ...tasks]);
      resetAddTaskForm();
    } else {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskData)
      })
      .then((res) => {
        if (!res.ok) throw new Error("Server rejected task creation.");
        return res.json();
      })
      .then(() => {
        fetchTasks();
        resetAddTaskForm();
      })
      .catch((err) => {
        console.error("Error creating task:", err);
        setAddTaskError("Failed to add task. Please verify server status.");
      });
    }
  };

  const resetAddTaskForm = () => {
    setTaskTitle("");
    setTaskDuration(30);
    setTaskEnergy("Medium");
    setTaskDueDate(new Date().toISOString().split("T")[0]);
    setSelectedGoalId("");
    setSelectedMilestoneId("");
    setAddTaskError(null);
    setShowAddForm(false);
  };

  const selectedGoal = goals.find(g => g.id === Number(selectedGoalId));
  const milestones = selectedGoal ? selectedGoal.milestones : [];

  const isTaskLocked = (task: any) => {
    if (!task.dependencies || task.dependencies.length === 0) return false;
    
    // Check if any prerequisite task is not completed
    return task.dependencies.some((depId: number) => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask && depTask.status !== "Completed";
    });
  };

  const getPrerequisiteTitles = (task: any) => {
    return task.dependencies
      .map((depId: number) => {
        const depTask = tasks.find(t => t.id === depId);
        return depTask ? depTask.title : "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const toggleTask = (task: any) => {
    if (isTaskLocked(task)) {
      const prereqs = getPrerequisiteTitles(task);
      setShowWarning(`Cannot complete this task. You must complete prerequisites first: "${prereqs}"`);
      setTimeout(() => setShowWarning(null), 5000);
      return;
    }

    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
    
    // Optimistic state update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));

    if (!apiError) {
      fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      })
      .then(res => {
        if (!res.ok) throw new Error();
        fetchTasks(); // Reload to update other dependent lockouts
      })
      .catch(() => {});
    }
  };

  // Group tasks by energy requirement for Energy-Based scheduling view
  // High -> Morning, Medium -> Afternoon, Low -> Night
  const morningTasks = tasks.filter(t => t.energy_required === "High");
  const afternoonTasks = tasks.filter(t => t.energy_required === "Medium");
  const nightTasks = tasks.filter(t => t.energy_required === "Low");

  const renderTaskCard = (task: any) => {
    const isLocked = isTaskLocked(task);
    const isComp = task.status === "Completed";
    
    return (
      <div 
        key={task.id} 
        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
          isComp 
            ? "border-emerald-500/25 bg-emerald-500/5 text-gray-500" 
            : isLocked 
            ? "border-white/5 bg-[#0C0C0E]/40 opacity-60"
            : "border-white/10 bg-[#0C0C0E]/70 hover:border-violet-500/30"
        }`}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button 
            onClick={() => toggleTask(task)}
            className={`mt-1 transition ${isLocked ? "cursor-not-allowed" : "hover:scale-110"}`}
          >
            {isComp ? (
              <CheckCircle2 className="text-emerald-500 fill-emerald-500/10" size={20} />
            ) : isLocked ? (
              <Lock className="text-gray-600" size={20} />
            ) : (
              <Circle className="text-gray-500 hover:text-violet-500" size={20} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm truncate ${isComp ? "line-through" : "text-white"}`}>
              {task.title}
            </h4>
            
            <div className="flex items-center gap-3.5 mt-2 flex-wrap text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {task.duration_minutes} min
              </span>
              <span>Due: {task.due_date}</span>
              
              {isLocked && (
                <span className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                  <Lock size={10} /> Locked by Prerequisite
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right pl-4">
          <span className="text-[10px] text-gray-500 font-bold block uppercase">Priority</span>
          <span className="text-sm font-bold text-violet-400">{task.priority_score}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Energy-Based Planner</h1>
          <p className="text-gray-400 text-sm mt-1">
            Nexus matches your peak energy hours to corresponding task workloads, implementing strict dependency lockouts to keep your work path chronological.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 font-semibold text-sm transition shrink-0"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form 
          onSubmit={handleAddTask} 
          className="p-6 rounded-2xl border border-white/10 bg-[#0C0C0E] space-y-4 animate-slideDown"
        >
          <h3 className="font-bold text-md flex items-center gap-2">
            <PlusCircle className="text-violet-400" size={18} />
            Create Custom Task
          </h3>

          {addTaskError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{addTaskError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Practice Reading Module Part 1"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-semibold">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(Number(e.target.value))}
                  required
                  className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-gray-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-semibold">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  required
                  className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Energy Level</label>
              <select
                value={taskEnergy}
                onChange={(e) => setTaskEnergy(e.target.value)}
                className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-gray-300"
              >
                <option value="High">High Energy (Morning)</option>
                <option value="Medium">Medium Energy (Afternoon)</option>
                <option value="Low">Low Energy (Night)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Target Goal</label>
              <select
                value={selectedGoalId}
                onChange={(e) => {
                  setSelectedGoalId(e.target.value === "" ? "" : Number(e.target.value));
                  setSelectedMilestoneId("");
                }}
                required
                className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-gray-300"
              >
                <option value="">-- Select Goal --</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Target Milestone</label>
              <select
                value={selectedMilestoneId}
                onChange={(e) => setSelectedMilestoneId(e.target.value === "" ? "" : Number(e.target.value))}
                required
                disabled={!selectedGoalId}
                className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-gray-300 disabled:opacity-50"
              >
                <option value="">-- Select Milestone --</option>
                {milestones.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-semibold"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Dependency lock warning toast */}
      {showWarning && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-start gap-2.5 animate-slideDown">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>{showWarning}</span>
        </div>
      )}

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Morning / High Energy Block */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Sun className="text-violet-400" size={16} />
                Morning Block (High Energy)
              </h3>
              <span className="text-[10px] bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded font-bold">Peak</span>
            </div>

            <div className="space-y-3">
              {morningTasks.map(renderTaskCard)}
              {morningTasks.length === 0 && (
                <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
                  No high energy tasks scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Afternoon / Medium Energy Block */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <CloudSun className="text-cyan-400" size={16} />
                Afternoon Block (Medium Energy)
              </h3>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded font-bold">Standard</span>
            </div>

            <div className="space-y-3">
              {afternoonTasks.map(renderTaskCard)}
              {afternoonTasks.length === 0 && (
                <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
                  No medium energy tasks scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Night / Low Energy Block */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Moon className="text-blue-400" size={16} />
                Night Block (Low Energy)
              </h3>
              <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded font-bold">Relaxed</span>
            </div>

            <div className="space-y-3">
              {nightTasks.map(renderTaskCard)}
              {nightTasks.length === 0 && (
                <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
                  No low energy tasks scheduled.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

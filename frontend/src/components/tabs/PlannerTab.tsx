import { useState, useEffect } from "react";
import { 
  Lock, 
  Sun, 
  CloudSun, 
  Moon, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  Clock
} from "lucide-react";


interface PlannerTabProps {
  apiError: boolean;
}

export default function PlannerTab({ apiError }: PlannerTabProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<string | null>(null);

  const fetchTasks = () => {
    fetch("http://localhost:8000/api/tasks")
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
      fetch(`http://localhost:8000/api/tasks/${task.id}`, {
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
      <div>
        <h1 className="text-2xl font-bold">Energy-Based Planner</h1>
        <p className="text-gray-400 text-sm mt-1">
          Nexus matches your peak energy hours to corresponding task workloads, implementing strict dependency lockouts to keep your work path chronological.
        </p>
      </div>

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

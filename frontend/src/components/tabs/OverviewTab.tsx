import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Info,
  Clock,
  Sparkles,
  Zap
} from "lucide-react";

interface OverviewTabProps {
  apiError: boolean;
}

export default function OverviewTab({ apiError }: OverviewTabProps) {

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOverview = () => {
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        // Fallback Mock Dashboard Overview Data
        setData({
          daily_plan: [
            { id: 101, title: "Configure Git & practice branching", duration_minutes: 45, energy_required: "Medium", status: "Completed", priority_score: 95, due_date: "2026-06-26" },
            { id: 102, title: "IELTS Reading Passage mock practice", duration_minutes: 60, energy_required: "High", status: "Pending", priority_score: 80, due_date: "2026-06-26" },
            { id: 103, title: "Design database models in SQLAlchemy", duration_minutes: 90, energy_required: "High", status: "Pending", priority_score: 75, due_date: "2026-06-26" },
            { id: 104, title: "Read GSoC project requirements", duration_minutes: 30, energy_required: "Low", status: "Pending", priority_score: 60, due_date: "2026-06-26" }
          ],
          completion_rate: 25.0,
          streak_days: 17,
          overload_warning: true,
          required_hours: 5.2,
          available_hours: 4.0,
          conflicts: [
            "Your current workload (5.2 hrs/day) exceeds your available time (4.0 hrs/day) by 1.2 hrs.",
            "Suggestion: Reduce IELTS practice from daily to 3x/week (Saves ~30 min/day).",
            "Suggestion: Spread out GSoC milestones, shifting coding tasks later to buffer the workload."
          ],
          progress_predictions: [
            { goal_title: "Get selected for GSoC 2027", pace: "25%", status: "Ahead of deadline", details: "Likely completion: Feb 10, 2027 (Ahead of deadline by 19 days)" },
            { goal_title: "Germany MS Preparation", pace: "12%", status: "Risk detected", details: "Likely completion: Jun 20, 2027 (Will miss deadline by 14 days)" }
          ]
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const toggleTask = (taskId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    
    // Optimistic UI update
    const updatedPlan = data.daily_plan.map((t: any) => 
      t.id === taskId ? { ...t, status: nextStatus } : t
    );
    const completedCount = updatedPlan.filter((t: any) => t.status === "Completed").length;
    const nextCompletionRate = Math.round((completedCount / updatedPlan.length) * 100);
    
    setData({
      ...data,
      daily_plan: updatedPlan,
      completion_rate: nextCompletionRate
    });

    if (!apiError) {
      fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      })
      .then(res => {
        if (!res.ok) throw new Error();
        fetchOverview(); // Refresh overview to trigger achievement unlocks
      })
      .catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Alert */}
      <div className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-transparent to-transparent p-6 shadow-2xl overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <Sparkles size={120} className="text-violet-500" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, Sunil.</h1>
        <p className="text-gray-400 mt-2 text-sm max-w-xl">
          Your Smart planner has optimized today's agenda. Based on your peak energy scores and milestone deadlines, you have 4 tasks scheduled today.
        </p>
      </div>

      {/* Grid: Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Today's Progress</span>
            <h3 className="text-4xl font-extrabold mt-2 text-white">{data.completion_rate}%</h3>
            <p className="text-xs text-gray-400 mt-1">
              {data.daily_plan.filter((t: any) => t.status === "Completed").length} of {data.daily_plan.length} tasks completed
            </p>
          </div>
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Circular SVG Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
              <circle cx="40" cy="40" r="32" stroke="#8b5cf6" strokeWidth="6" fill="transparent"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={2 * Math.PI * 32 * (1 - data.completion_rate / 100)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute font-bold text-sm text-violet-400">{data.completion_rate}%</div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Habit Streak</span>
            <h3 className="text-4xl font-extrabold mt-2 text-orange-400 flex items-center gap-2">
              <Flame className="fill-orange-400 stroke-orange-400 animate-pulse" size={32} />
              {data.streak_days} Days
            </h3>
            <p className="text-xs text-gray-400 mt-1">Active GitHub contribution streak</p>
          </div>
          <div className="h-14 w-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Flame size={24} />
          </div>
        </div>

        {/* Energy Schedule Match */}
        <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Workload Capacity</span>
            <h3 className={`text-4xl font-extrabold mt-2 ${data.overload_warning ? "text-amber-500" : "text-emerald-500"}`}>
              {data.required_hours}h / {data.available_hours}h
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {data.overload_warning ? "Overload detected!" : "Capacity within safe bounds"}
            </p>
          </div>
          <div className={`h-14 w-14 rounded-full flex items-center justify-center ${data.overload_warning ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
            {data.overload_warning ? <AlertTriangle size={24} /> : <Zap size={24} />}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Planner (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="text-violet-500" size={20} />
              Today's Smart Plan
            </h2>
            <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400">
              No Manual Planning
            </span>
          </div>

          <div className="space-y-3">
            {data.daily_plan.map((task: any) => {
              const isComp = task.status === "Completed";
              return (
                <div 
                  key={task.id} 
                  className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                    isComp 
                      ? "border-emerald-500/25 bg-emerald-500/5 text-gray-400" 
                      : "border-white/10 bg-[#0C0C0E]/70 hover:border-violet-500/30"
                  }`}
                >
                  <div className="flex gap-3.5">
                    <button 
                      onClick={() => toggleTask(task.id, task.status)}
                      className="mt-1 transition hover:scale-110"
                    >
                      {isComp 
                        ? <CheckCircle2 className="text-emerald-500 fill-emerald-500/20" size={20} />
                        : <Circle className="text-gray-500 hover:text-violet-500" size={20} />
                      }
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${isComp ? "line-through text-gray-500" : "text-white"}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {task.duration_minutes} min
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          task.energy_required === "High" 
                            ? "bg-red-500/10 text-red-400"
                            : task.energy_required === "Medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {task.energy_required} Energy
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Priority</span>
                    <span className={`text-sm font-bold ${
                      task.priority_score >= 90 ? "text-violet-400" : "text-gray-300"
                    }`}>
                      {task.priority_score}
                    </span>
                  </div>
                </div>
              );
            })}

            {data.daily_plan.length === 0 && (
              <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                No tasks scheduled for today. Create new goals to generate tasks!
              </div>
            )}
          </div>

          {/* Workload Warning details if overloaded */}
          {data.overload_warning && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                <AlertTriangle size={18} />
                Workload Protection: Overload Detected
              </div>
              <ul className="space-y-1.5 text-xs text-gray-400 pl-6 list-disc">
                {data.conflicts.map((recommendation: string, idx: number) => (
                  <li key={idx}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Widgets (Right Column) */}
        <div className="space-y-8">
          {/* Progress Predictions */}
          <div className="rounded-xl border border-white/10 bg-[#0C0C0E] p-6 space-y-6">
            <h3 className="font-bold text-md flex items-center gap-2">
              <TrendingUp className="text-cyan-400" size={18} />
              AI Progress Predictions
            </h3>

            <div className="space-y-4">
              {data.progress_predictions.map((pred: any, idx: number) => {
                const isRisk = pred.status === "Risk detected";
                return (
                  <div key={idx} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold truncate max-w-[150px]">{pred.goal_title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isRisk ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        Pace: {pred.pace}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-normal flex items-start gap-1">
                      <Info size={12} className="mt-0.5 shrink-0 text-cyan-400" />
                      {pred.details}
                    </p>
                  </div>
                );
              })}

              {data.progress_predictions.length === 0 && (
                <div className="text-xs text-gray-500 text-center">No predictions available. Add goals to activate calculations.</div>
              )}
            </div>
          </div>

          {/* Tips Box */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#101014] to-[#0A0A0C] p-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-300">Goal-linked Reminders</h3>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "One Git contribution today keeps your GSoC milestones on track, ensuring you don't backlog writing your proposal in February."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

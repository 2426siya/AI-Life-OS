import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Target, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Cpu, 
  Trash2,
  AlertCircle,
  Clock,
  ListTodo
} from "lucide-react";

interface GoalsTabProps {
  apiError: boolean;
}

export default function GoalsTab({ apiError }: GoalsTabProps) {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [priority, setPriority] = useState<string>("Medium");
  
  // UI State
  const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);

  const fetchGoals = () => {
    fetch("http://localhost:8000/api/goals")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setGoals(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback Mock Goals
        setGoals([
          {
            id: 1,
            title: "Get selected for GSoC 2027",
            description: "Contribute to open source organizations, build a solid proposal, and get selected.",
            deadline: "2027-03-01",
            priority: "High",
            status: "In Progress",
            progress: 25.0,
            milestones: [
              {
                id: 11,
                title: "Learn Git & GitHub Workflow",
                duration: "2 weeks",
                status: "Completed",
                order: 1,
                tasks: [
                  { id: 101, title: "Configure Git & practice branching", duration_minutes: 45, energy_required: "Medium", status: "Completed", priority_score: 95 },
                  { id: 102, title: "Create a dummy repo and practice merge conflicts", duration_minutes: 60, energy_required: "High", status: "Completed", priority_score: 85 }
                ]
              },
              {
                id: 12,
                title: "Find Organizations & Setup Projects",
                duration: "3 weeks",
                status: "In Progress",
                order: 2,
                tasks: [
                  { id: 103, title: "Browse GSoC org list and pick 3 target orgs", duration_minutes: 90, energy_required: "Medium", status: "Pending", priority_score: 80 },
                  { id: 104, title: "Clone org repos and build project locally", duration_minutes: 120, energy_required: "High", status: "Pending", priority_score: 75 }
                ]
              },
              {
                id: 13,
                title: "First Contributions & Issue Solving",
                duration: "4 weeks",
                status: "Pending",
                order: 3,
                tasks: [
                  { id: 105, title: "Search for 'good first issues' in chosen repos", duration_minutes: 60, energy_required: "Medium", status: "Pending", priority_score: 65 }
                ]
              }
            ]
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;

    const newGoalData = { title, description, deadline, priority };

    if (apiError) {
      // Mock local addition
      const mockGoal = {
        id: Date.now(),
        ...newGoalData,
        status: "Pending",
        progress: 0.0,
        milestones: [
          {
            id: Date.now() + 1,
            title: "Initial Research & Setup",
            duration: "1 week",
            status: "Pending",
            order: 1,
            tasks: [
              { id: Date.now() + 2, title: "Outline resources & bookmarks", duration_minutes: 45, energy_required: "Low", status: "Pending", priority_score: 50 }
            ]
          }
        ]
      };
      setGoals([mockGoal, ...goals]);
      resetForm();
    } else {
      fetch("http://localhost:8000/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoalData)
      })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setGoals([data, ...goals]);
        setExpandedGoalId(data.id);
        resetForm();
      })
      .catch(() => {});
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setPriority("Medium");
    setShowAddForm(false);
  };

  const handleDeleteGoal = (goalId: number) => {
    if (apiError) {
      setGoals(goals.filter(g => g.id !== goalId));
    } else {
      fetch(`http://localhost:8000/api/goals/${goalId}`, {
        method: "DELETE"
      })
      .then((res) => {
        if (!res.ok) throw new Error();
        setGoals(goals.filter(g => g.id !== goalId));
      })
      .catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goal Engine</h1>
          <p className="text-gray-400 text-sm mt-1">
            Input high-level objectives. The AI automatically decomposes them into manageable milestones and daily tasks.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 font-semibold text-sm transition"
        >
          <Plus size={16} />
          Create Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <form 
          onSubmit={handleAddGoal} 
          className="p-6 rounded-2xl border border-white/10 bg-[#0C0C0E] space-y-4 animate-slideDown"
        >
          <h3 className="font-bold text-md flex items-center gap-2">
            <Cpu className="text-violet-400" size={18} />
            Define Goal & Initialize AI Decomposition
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Goal Title</label>
              <input
                type="text"
                placeholder="e.g. Get selected for GSoC 2027"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-gray-300"
              >
                <option value="High">High Importance</option>
                <option value="Medium">Medium Importance</option>
                <option value="Low">Low Importance</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold">Goal Description (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Complete open source contributions and prepare proposal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
              />
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-semibold"
            >
              <Sparkles size={14} className="animate-spin-slow" />
              Generate AI Roadmap
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards List */}
      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const isExpanded = expandedGoalId === goal.id;
            return (
              <div 
                key={goal.id} 
                className="rounded-2xl border border-white/10 bg-[#0C0C0E]/50 overflow-hidden transition-all"
              >
                {/* Goal Card Header */}
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Target size={22} />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-extrabold text-md truncate text-white">{goal.title}</h3>
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                          goal.priority === "High" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/10" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                        }`}>
                          {goal.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Deadline: {goal.deadline}
                        </span>
                        <span>{goal.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Progress slider bar */}
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-gray-500 block">Progress</span>
                      <div className="flex items-center gap-2.5 mt-1">
                        <div className="w-24 bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                          <div 
                            className="bg-violet-500 h-full rounded-full" 
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-violet-400">{goal.progress}%</span>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(goal.id);
                      }}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition"
                    >
                      <Trash2 size={16} />
                    </button>

                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Timeline details */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-[#08080A]/40 p-6 space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h4 className="text-sm font-bold flex items-center gap-1.5 text-gray-300">
                        <ListTodo size={16} className="text-cyan-400" />
                        AI Milestone Roadmap
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1">
                        <Sparkles size={10} className="animate-pulse" /> Decomposed by AI Engine
                      </span>
                    </div>

                    <div className="relative border-l border-white/10 ml-4 pl-6 space-y-6">
                      {goal.milestones?.map((m: any) => {
                        const isMComp = m.status === "Completed";
                        return (
                          <div key={m.id} className="relative">
                            {/* Milestone Dot on left vertical line */}
                            <span className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 ${
                              isMComp 
                                ? "bg-emerald-500 border-emerald-500" 
                                : m.status === "In Progress"
                                ? "bg-[#09090B] border-violet-500"
                                : "bg-[#09090B] border-white/15"
                            }`} />

                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className={`font-semibold text-sm ${isMComp ? "text-gray-400 line-through" : "text-white"}`}>
                                    {m.title}
                                  </h5>
                                  <span className="text-[10px] text-gray-500">Duration: {m.duration || "N/A"}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isMComp 
                                    ? "bg-emerald-500/10 text-emerald-400" 
                                    : m.status === "In Progress"
                                    ? "bg-violet-500/10 text-violet-400"
                                    : "bg-white/5 text-gray-500"
                                }`}>
                                  {m.status}
                                </span>
                              </div>

                              {/* Milestone tasks list */}
                              <div className="space-y-1.5 mt-2">
                                {m.tasks?.map((t: any) => (
                                  <div 
                                    key={t.id}
                                    className="flex justify-between items-center text-xs p-2 rounded bg-white/5 border border-white/5 text-gray-400"
                                  >
                                    <span className={t.status === "Completed" ? "line-through text-gray-500" : "text-gray-300"}>
                                      {t.title}
                                    </span>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                                      <span className="flex items-center gap-0.5">
                                        <Clock size={10} />
                                        {t.duration_minutes}m
                                      </span>
                                      <span className="font-bold text-violet-400/80">Score: {t.priority_score}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              <AlertCircle className="mx-auto mb-3 text-gray-500" size={32} />
              No goals tracked yet. Click "Create Goal" above to bootstrap your AI roadmaps!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

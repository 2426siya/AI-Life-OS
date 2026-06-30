import { useState, useEffect } from "react";
import { 
  Flame, 
  Plus, 
  Check, 
  Dumbbell, 
  BookOpen, 
  Code, 
  Award 
} from "lucide-react";


interface HabitsTabProps {
  apiError: boolean;
}

export default function HabitsTab({ apiError }: HabitsTabProps) {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newHabitName, setNewHabitName] = useState<string>("");

  const fetchHabits = () => {
    fetch("/api/habits")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback Mock Habits
        setHabits([
          { id: 1, name: "GitHub Contribution", current_streak: 17, best_streak: 25, last_completed: "2026-06-25" },
          { id: 2, name: "Daily Exercise", current_streak: 5, best_streak: 12, last_completed: "2026-06-25" },
          { id: 3, name: "DSA / LeetCode", current_streak: 8, best_streak: 15, last_completed: "2026-06-26" },
          { id: 4, name: "Reading", current_streak: 3, best_streak: 7, last_completed: "2026-06-25" },
          { id: 5, name: "Coding", current_streak: 12, best_streak: 20, last_completed: "2026-06-25" }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    if (apiError) {
      const mockH = {
        id: Date.now(),
        name: newHabitName,
        current_streak: 0,
        best_streak: 0,
        last_completed: null
      };
      setHabits([...habits, mockH]);
      setNewHabitName("");
    } else {
      fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newHabitName })
      })
      .then((res) => {
        if (!res.ok) throw new Error("Duplicate");
        return res.json();
      })
      .then((data) => {
        setHabits([...habits, data]);
        setNewHabitName("");
      })
      .catch(() => {
        alert("Habit name already exists!");
      });
    }
  };

  const handleCompleteHabit = (habitId: number) => {
    const today = new Date().toISOString().split("T")[0];
    
    // Optimistically update locally
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        if (h.last_completed === today) return h; // already done
        const nextStreak = h.current_streak + 1;
        return {
          ...h,
          current_streak: nextStreak,
          best_streak: nextStreak > h.best_streak ? nextStreak : h.best_streak,
          last_completed: today
        };
      }
      return h;
    });
    setHabits(updated);

    if (!apiError) {
      fetch(`/api/habits/${habitId}/complete`, {
        method: "POST"
      })
      .then(res => {
        if (!res.ok) throw new Error();
        fetchHabits();
      })
      .catch(() => {});
    }
  };

  const getHabitIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("github") || lower.includes("git")) {
      return (
        <svg className="text-gray-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    }
    if (lower.includes("exercise") || lower.includes("gym") || lower.includes("workout")) return <Dumbbell className="text-emerald-400" size={18} />;
    if (lower.includes("read") || lower.includes("ielts")) return <BookOpen className="text-cyan-400" size={18} />;
    if (lower.includes("dsa") || lower.includes("leetcode")) return <Award className="text-amber-400" size={18} />;
    return <Code className="text-violet-400" size={18} />;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Habit System</h1>
          <p className="text-gray-400 text-sm mt-1">
            Build consistency. Maintain daily streaks for key skills that build toward your professional portfolio.
          </p>
        </div>
      </div>

      {/* Add Habit Form */}
      <form onSubmit={handleCreateHabit} className="flex gap-3 max-w-md">
        <input
          type="text"
          placeholder="Add a new habit... e.g. Solve 2 LeetCode problems"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          required
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 font-semibold text-sm transition"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Habits Grid */}
      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => {
            const today = new Date().toISOString().split("T")[0];
            const isCompletedToday = habit.last_completed === today;

            return (
              <div 
                key={habit.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompletedToday 
                    ? "border-emerald-500/25 bg-emerald-500/5" 
                    : "border-white/10 bg-[#0C0C0E] hover:border-violet-500/20"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      {getHabitIcon(habit.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white truncate max-w-[150px]">{habit.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Best Streak: {habit.best_streak} days</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCompleteHabit(habit.id)}
                    disabled={isCompletedToday}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center border transition-all ${
                      isCompletedToday 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "bg-white/5 border-white/10 hover:border-violet-500 text-gray-400 hover:text-white"
                    }`}
                  >
                    {isCompletedToday ? <Check size={16} /> : <Check size={16} />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500">Current Streak</span>
                  <div className="flex items-center gap-1.5">
                    <Flame className={isCompletedToday ? "fill-orange-400 stroke-orange-400 animate-bounce" : "text-gray-600"} size={16} />
                    <span className={`text-sm font-extrabold ${isCompletedToday ? "text-orange-400" : "text-gray-400"}`}>
                      {habit.current_streak} days
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Check, 
  RefreshCw, 
  Clock
} from "lucide-react";

export default function IntegrationsTab() {
  const [gitStats, setGitStats] = useState<any>(null);
  const [calEvents, setCalEvents] = useState<any[]>([]);
  
  const [gitConnected, setGitConnected] = useState<boolean>(true);
  const [calConnected, setCalConnected] = useState<boolean>(true);

  useEffect(() => {
    // Fetch mock integrations data from backend
    const f1 = fetch("http://localhost:8000/api/integrations/github").then(res => res.json()).catch(() => ({
      username: "sunilkale",
      commits_today: 3,
      open_prs: 2,
      issues_solved: 1,
      streak_days: 17,
      contributions_week: [1, 3, 0, 4, 2, 3, 1]
    }));

    const f2 = fetch("http://localhost:8000/api/integrations/calendar").then(res => res.json()).catch(() => ({
      provider: "Google Calendar",
      events: [
        { title: "Algorithms Class", time: "09:00 - 10:30", status: "Busy" },
        { title: "ML Group Meeting", time: "14:00 - 15:00", status: "Tentative" }
      ]
    }));

    Promise.all([f1, f2]).then(([git, cal]) => {
      setGitStats(git);
      setCalEvents(cal.events);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Description */}
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-gray-400 text-sm mt-1">
          Sync your external profiles to feeds. GitHub commits and Google Calendar events automatically populate your planner constraints.
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GitHub Integration */}
        <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-md text-white">GitHub API</h3>
                <p className="text-xs text-gray-500 mt-0.5">Track commits, PRs, and streak points</p>
              </div>
            </div>

            <button
              onClick={() => setGitConnected(!gitConnected)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                gitConnected 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-white/5 border-white/10 hover:border-violet-500/30 text-white"
              }`}
            >
              {gitConnected ? "Connected" : "Connect"}
            </button>
          </div>

          {gitConnected && gitStats && (
            <div className="space-y-6 pt-4 border-t border-white/5 animate-fadeIn">
              {/* Profile Bar */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Sync Username: <strong className="text-white font-bold">@{gitStats.username}</strong></span>
                <span className="text-xs text-violet-400 flex items-center gap-1 cursor-pointer">
                  Syncing Live <RefreshCw size={10} className="animate-spin-slow" />
                </span>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-xs text-gray-500 font-medium">Commits Today</span>
                  <h4 className="text-2xl font-extrabold text-white mt-1.5">{gitStats.commits_today}</h4>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-xs text-gray-500 font-medium">Open PRs</span>
                  <h4 className="text-2xl font-extrabold text-white mt-1.5">{gitStats.open_prs}</h4>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-xs text-gray-500 font-medium">Solved Issues</span>
                  <h4 className="text-2xl font-extrabold text-white mt-1.5">{gitStats.issues_solved}</h4>
                </div>
              </div>

              {/* Contribution visualization box */}
              <div className="space-y-2">
                <span className="text-xs text-gray-500 font-medium">Weekly Contribution Volume</span>
                <div className="flex justify-between items-end h-16 bg-white/5 border border-white/5 rounded-xl p-4 gap-2">
                  {gitStats.contributions_week?.map((count: number, idx: number) => {
                    const heightPercent = count * 25; // max count is 4 for scale
                    const labels = ["M", "T", "W", "T", "F", "S", "S"];
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className={`w-full rounded-t-sm transition-all ${
                            count > 0 ? "bg-violet-500/80" : "bg-white/5"
                          }`}
                          style={{ height: `${Math.max(5, heightPercent)}%` }}
                        />
                        <span className="text-[9px] text-gray-500">{labels[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!gitConnected && (
            <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
              Connect your GitHub account to sync profile stats, contributions streaks, and PR accomplishments.
            </div>
          )}
        </div>

        {/* Google Calendar Integration */}
        <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="font-bold text-md text-white">Google Calendar</h3>
                <p className="text-xs text-gray-500 mt-0.5">Import events and meetings constraints</p>
              </div>
            </div>

            <button
              onClick={() => setCalConnected(!calConnected)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                calConnected 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-white/5 border-white/10 hover:border-violet-500/30 text-white"
              }`}
            >
              {calConnected ? "Connected" : "Connect"}
            </button>
          </div>

          {calConnected && calEvents && (
            <div className="space-y-4 pt-4 border-t border-white/5 animate-fadeIn">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Today's Synced Events</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check size={12} /> Sync active
                </span>
              </div>

              <div className="space-y-3">
                {calEvents.map((evt, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        evt.status === "Busy" ? "bg-violet-500" : "bg-cyan-500"
                      }`} />
                      <span className="font-semibold text-white">{evt.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {evt.time}
                    </span>
                  </div>
                ))}

                {calEvents.length === 0 && (
                  <div className="text-xs text-gray-500 text-center py-2">No calendar events found for today.</div>
                )}
              </div>
            </div>
          )}

          {!calConnected && (
            <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
              Connect your calendar to import lecture timetables, exam slots, and study blocks directly.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

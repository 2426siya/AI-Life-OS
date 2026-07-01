import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Target, 
  CalendarRange, 
  Flame, 
  GitBranch, 
  MessageSquare, 
  Briefcase, 
  ArrowLeft, 
  Sun, 
  Clock, 
  Cpu,
  LogOut
} from "lucide-react";


import OverviewTab from "./tabs/OverviewTab";
import GoalsTab from "./tabs/GoalsTab";
import PlannerTab from "./tabs/PlannerTab";
import HabitsTab from "./tabs/HabitsTab";
import IntegrationsTab from "./tabs/IntegrationsTab";
import MentorTab from "./tabs/MentorTab";
import PortfolioTab from "./tabs/PortfolioTab";

interface DashboardProps {
  onBack?: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);
  const [currentEnergy, setCurrentEnergy] = useState<string>("High");

  useEffect(() => {
    // Determine energy based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setCurrentEnergy("High (Morning)");
    } else if (hour >= 12 && hour < 18) {
      setCurrentEnergy("Medium (Afternoon)");
    } else {
      setCurrentEnergy("Low (Night)");
    }

    // Fetch user preferences / stats
    fetch("/api/preferences")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock preferences if backend is down
        setUserData({
          interests: "AI/DS, Open Source, Web Dev",
          preparing_for: "GSoC 2027, Germany MS",
          open_source_status: "Active Contributor",
          energy_morning: "High",
          energy_afternoon: "Medium",
          energy_night: "Low",
          available_hours: 4.0
        });
        setApiError(true);
        setLoading(false);
      });
  }, []);

  const menuItems = [
    { id: "overview", label: "Dashboard Brain", icon: LayoutDashboard },
    { id: "goals", label: "Goal Engine", icon: Target },
    { id: "planner", label: "Smart Planner", icon: CalendarRange },
    { id: "habits", label: "Habit System", icon: Flame },
    { id: "integrations", label: "Integrations", icon: GitBranch },
    { id: "mentor", label: "AI Mentor & Memory", icon: MessageSquare },
    { id: "portfolio", label: "Portfolio Generator", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090B] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0C0C0E] flex flex-col z-20">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              N
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NexusOS
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-violet-600/15 border-l-2 border-violet-500 text-white font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-violet-400" : "text-gray-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/10 bg-[#08080A]">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center font-bold">
              SK
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm truncate">Sunil Kale</h4>
              <p className="text-xs text-gray-500 truncate">3rd Yr Student</p>
            </div>
          </div>
          {onBack && (
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition text-xs font-semibold text-gray-400"
            >
              <LogOut size={14} />
              Exit Dashboard
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#0C0C0E]/50 backdrop-blur-md sticky top-0 z-15">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="md:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-lg font-bold">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            {apiError && (
              <span className="px-2.5 py-1 text-xs rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold flex items-center gap-1.5 animate-pulse">
                <Cpu size={12} /> Local Mode
              </span>
            )}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Sun size={14} className="text-violet-400" />
              <span>Current Energy: <strong className="text-white font-bold">{currentEnergy}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-cyan-400" />
              <span className="text-white font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative z-10">
              {activeTab === "overview" && <OverviewTab apiError={apiError} />}
              {activeTab === "goals" && <GoalsTab apiError={apiError} />}
              {activeTab === "planner" && <PlannerTab apiError={apiError} />}
              {activeTab === "habits" && <HabitsTab apiError={apiError} />}
              {activeTab === "integrations" && <IntegrationsTab />}
              {activeTab === "mentor" && <MentorTab apiError={apiError} userData={userData} />}
              {activeTab === "portfolio" && <PortfolioTab />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

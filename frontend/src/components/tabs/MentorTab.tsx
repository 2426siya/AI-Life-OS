import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Bot, 
  User, 
  BrainCircuit, 
  Check, 
  ShieldAlert, 
  CalendarRange,
  Save
} from "lucide-react";


interface MentorTabProps {
  apiError: boolean;
  userData: any;
}

export default function MentorTab({ apiError, userData }: MentorTabProps) {
  const [messages, setMessages] = useState<any[]>([
    { role: "mentor", content: "Hello! I am your AI Career Mentor. I track your career goals, analyze your workload capacities, and manage your accountability streaks. How can I help you today? You can ask me for career advice, or ask to generate a 'Recovery Plan' if you've been inactive." }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recoveryPlan, setRecoveryPlan] = useState<any[] | null>(null);

  // AI Memory States
  const [interests, setInterests] = useState<string>("");
  const [prepFor, setPrepFor] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userData) {
      setInterests(userData.interests || "");
      setPrepFor(userData.preparing_for || "");
    }
  }, [userData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInputMessage("");
    setLoading(true);

    if (apiError) {
      // Mock local responses
      setTimeout(() => {
        let reply = "I am monitoring your goals. Let's make sure to break down milestones systematically.";
        let plan = null;

        const msgLower = userMsg.toLowerCase();
        if (msgLower.includes("recovery") || msgLower.includes("missed") || msgLower.includes("back") || msgLower.includes("catch up")) {
          reply = "Welcome back! Don't stress about the inactive days. I've generated an Emergency Recovery Plan to spread out your pending milestones over the next 7 days, prioritizing high impact PRs and Git setup. Shall we apply it?";
          plan = [
            { day: 1, focus: "Configure Git branching and simple documentation PR", load: "30 mins" },
            { day: 2, focus: "Solve 2 LeetCode Array exercises", load: "45 mins" },
            { day: 3, focus: "Explore target GSoC organization repositories", load: "60 mins" },
            { day: 4, focus: "Complete short IELTS reading practice test", load: "30 mins" },
            { day: 5, focus: "Mock pull request validation", load: "60 mins" }
          ];
        } else if (msgLower.includes("data scientist") || msgLower.includes("ds") || msgLower.includes("machine learning") || msgLower.includes("ml")) {
          reply = "To become a standout Data Scientist, focus on: 1) Stats & Maths basics, 2) Contributing to scikit-learn or similar GSoC libraries, 3) Deploying predictive projects using APIs like FastAPI. I have updated your AI Memory interests to prioritize AI/DS.";
        }

        setMessages(prev => [...prev, { role: "mentor", content: reply }]);
        if (plan) setRecoveryPlan(plan);
        setLoading(false);
      }, 800);
    } else {
      fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-5) // Send last few messages for context
        })
      })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, { role: "mentor", content: data.reply }]);
        if (data.recovery_plan) {
          setRecoveryPlan(data.recovery_plan);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    }
  };

  const handleSaveMemory = () => {
    const updatedPref = { interests, preparing_for: prepFor };
    
    if (!apiError) {
      fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPref)
      })
      .then(res => {
        if (!res.ok) throw new Error();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      });
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] min-h-[500px]">
      
      {/* Mentor Chat Panel (Left 2 Columns) */}
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-white/10 bg-[#0C0C0E] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 bg-[#08080A]/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Bot size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">AI Mentor Conversation</h4>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <BrainCircuit size={12} /> Personalized Advice Mode
            </p>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isMentor = msg.role === "mentor";
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${
                  isMentor ? "self-start" : "self-end ml-auto flex-row-reverse"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  isMentor ? "bg-violet-600/10 border border-violet-500/25 text-violet-400" : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                }`}>
                  {isMentor ? <Bot size={14} /> : <User size={14} />}
                </div>

                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isMentor 
                    ? "bg-white/5 border border-white/5 text-gray-300" 
                    : "bg-violet-600 text-white font-medium"
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-violet-600/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
                <Bot size={14} />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-gray-400 flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Recovery plan widget inside chat */}
          {recoveryPlan && (
            <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-4 animate-slideDown max-w-[90%] ml-11">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldAlert size={18} />
                Recovery Plan Generated (7 Days)
              </div>
              <div className="space-y-2.5">
                {recoveryPlan.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-400 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="font-semibold text-white">Day {p.day || idx + 1}: {p.focus}</span>
                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold text-[10px]">{p.load || "30 min"}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setMessages(prev => [...prev, { role: "mentor", content: "✅ Recovery plan loaded successfully into your planner dashboard! We've scheduled these tasks with a gradual workload ramp-up to ensure success." }]);
                  setRecoveryPlan(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-[#09090B] font-bold text-xs transition"
              >
                <CalendarRange size={14} />
                Apply Recovery Plan
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#08080A]/40 flex gap-3">
          <input
            type="text"
            placeholder="Ask mentor career advice, portfolio setup, or how to catch up..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition hover:scale-105 shrink-0"
          >
            <Send size={16} />
          </button>
        </form>

      </div>

      {/* AI Memory Preferences Panel (Right 1 Column) */}
      <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <BrainCircuit className="text-violet-400 animate-pulse" size={18} />
            <h3 className="font-extrabold text-sm text-white">AI Memory Dashboard</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Career Interests</label>
              <input
                type="text"
                placeholder="e.g. AI/DS, Open Source, Web Dev"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Preparing For</label>
              <input
                type="text"
                placeholder="e.g. GSoC 2027, Germany MS"
                value={prepFor}
                onChange={(e) => setPrepFor(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Open Source Profile</label>
              <span className="block text-xs bg-white/5 border border-white/10 rounded-xl px-4.5 py-2.5 text-gray-400 font-medium select-none">
                Active Contributor (Mock)
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleSaveMemory}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition ${
              saveSuccess 
                ? "bg-emerald-500 text-white" 
                : "bg-white/5 border border-white/10 hover:border-violet-500/40 text-gray-300 hover:text-white"
            }`}
          >
            {saveSuccess ? (
              <>
                <Check size={14} /> Synced to Memory
              </>
            ) : (
              <>
                <Save size={14} /> Update AI Memory
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

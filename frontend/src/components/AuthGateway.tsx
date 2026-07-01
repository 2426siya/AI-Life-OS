import React, { useState } from "react";
import { User, Mail, Lock, Sparkles, Clock, Zap, BookOpen, AlertCircle } from "lucide-react";

interface AuthGatewayProps {
  onLoginSuccess: (token: string, username: string) => void;
}

export default function AuthGateway({ onLoginSuccess }: AuthGatewayProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [step, setStep] = useState<number>(1); // For multi-step signup onboarding
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState("");
  const [preparingFor, setPreparingFor] = useState("");
  const openSourceStatus = "Active Contributor";
  const [energyMorning, setEnergyMorning] = useState("High");
  const [energyAfternoon, setEnergyAfternoon] = useState("Medium");
  const [energyNight, setEnergyNight] = useState("Low");
  const [availableHours, setAvailableHours] = useState<number>(4.0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username_or_email: username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Login failed");

        onLoginSuccess(data.access_token, data.username);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Signup: If at step 1, proceed to onboarding step 2
      if (step === 1) {
        if (!username || !email || !password) {
          setError("Please fill out all fields");
          return;
        }
        setStep(2);
        return;
      }

      // Step 2 submit
      setLoading(true);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
            interests,
            preparing_for: preparingFor,
            open_source_status: openSourceStatus,
            energy_morning: energyMorning,
            energy_afternoon: energyAfternoon,
            energy_night: energyNight,
            available_hours: availableHours,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Signup failed");

        onLoginSuccess(data.access_token, data.username);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] text-white p-4 relative overflow-hidden">
      {/* Background glow animations */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md bg-[#0C0C0E] border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 relative">
        {/* Title / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)] mb-3">
            N
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            NexusOS
          </h2>
          <p className="text-xs text-gray-500 mt-1">AI-Powered Life & Goal Optimization</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isLogin ? (
            /* --- LOGIN FORM --- */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username or email"
                    className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5 pl-1">
                  Use your registered username (recommended to match GitHub) or email.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* --- SIGNUP FORM (MULTI-STEP) --- */
            <div>
              {step === 1 ? (
                /* SIGNUP STEP 1: Account Info */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="john_doe"
                        className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                    <p className="text-[10px] text-violet-400/80 mt-1.5 pl-1 font-medium">
                      Important: Enter your exact GitHub username to sync commits and PR stats!
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* SIGNUP STEP 2: Onboarding Preferences */
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      <BookOpen size={14} className="text-violet-400" />
                      Interests (comma separated)
                    </label>
                    <input
                      type="text"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g. AI/DS, Open Source, Web Dev"
                      className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      <Sparkles size={14} className="text-violet-400" />
                      Preparing For (comma separated)
                    </label>
                    <input
                      type="text"
                      value={preparingFor}
                      onChange={(e) => setPreparingFor(e.target.value)}
                      placeholder="e.g. GSoC 2027, Germany MS"
                      className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        <Clock size={14} className="text-violet-400" />
                        Available Hours/Day
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="24"
                        value={availableHours}
                        onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                        className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-violet-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        <Zap size={14} className="text-violet-400" />
                        Morning Energy
                      </label>
                      <select
                        value={energyMorning}
                        onChange={(e) => setEnergyMorning(e.target.value)}
                        className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-violet-500 focus:outline-none transition-all text-gray-400"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        <Zap size={14} className="text-violet-400" />
                        Afternoon Energy
                      </label>
                      <select
                        value={energyAfternoon}
                        onChange={(e) => setEnergyAfternoon(e.target.value)}
                        className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-violet-500 focus:outline-none transition-all text-gray-400"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        <Zap size={14} className="text-violet-400" />
                        Night Energy
                      </label>
                      <select
                        value={energyNight}
                        onChange={(e) => setEnergyNight(e.target.value)}
                        className="w-full bg-[#08080A] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-violet-500 focus:outline-none transition-all text-gray-400"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold rounded-xl shadow-[0_5px_15px_rgba(124,58,237,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : step === 1 ? "Next: Configure Profile" : "Create Account & Onboard"}
          </button>
        </form>

        {/* Footer Link (Toggle signup/login) */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {step === 2 && !isLogin ? (
            <button
              onClick={() => setStep(1)}
              className="text-violet-400 hover:underline focus:outline-none font-semibold"
            >
              Back to Account Info
            </button>
          ) : (
            <>
              {isLogin ? "New to NexusOS? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setStep(1);
                  setError(null);
                }}
                className="text-violet-400 hover:underline focus:outline-none font-semibold"
              >
                {isLogin ? "Create an account" : "Sign In"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

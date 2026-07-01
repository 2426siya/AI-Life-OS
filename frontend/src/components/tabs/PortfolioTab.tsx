import { useState, useEffect } from "react";
import { 
  Briefcase, 
  ExternalLink, 
  MapPin, 
  Printer
} from "lucide-react";

interface PortfolioTabProps {}

export default function PortfolioTab({}: PortfolioTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<string>("portfolio");


  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        // Fallback Mock Portfolio Data
        const fallbackName = localStorage.getItem("username") || "Developer";
        setData({
          name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
          title: "Software Engineer & AI Enthusiast",
          bio: "3rd-year AI & Data Science student. Contributor to open-source workflows. Architecting systems that optimize human energy, planning, and goal execution.",
          interests: ["AI/DS", "Open Source", "Web Dev"],
          preparing_for: ["GSoC 2027", "Germany MS"],
          github_stats: { commits_today: 3, open_prs: 2, issues_solved: 1, streak: 17 },
          milestones: [
            { goal_title: "Get selected for GSoC 2027", milestone_title: "Learn Git & GitHub Workflow", completed_date: "Jun 26, 2026" }
          ],
          projects: [
            {
              title: "Nexus AI Life Operating System",
              description: "Designed a comprehensive career planner and schedule optimizer that processes task dependencies and energy matches.",
              tech_stack: ["React", "FastAPI", "SQLite", "Tailwind CSS"],
              github_link: "https://github.com/sunilkale/nexus-life-os"
            },
            {
              title: "Open Source Contribution Roadmap",
              description: "Maintained a consistent git workflow fixing good-first-issues and handling pull requests for active organizations.",
              tech_stack: ["Git", "GitHub Flow", "Markdown"],
              github_link: "https://github.com/sunilkale"
            }
          ],
          achievements: [
            { name: "First PR", description: "Merged your first GitHub pull request.", icon: "🏆", unlocked_at: "2026-06-26" }
          ]
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-32 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const linkedinSummary = `🚀 3rd-year AI & Data Science student passionate about Open Source, Web Architectures, and Developer Tools.

🔥 Currently preparing for ${data.preparing_for.join(" and ")} while maintaining a streak of ${data.github_stats.streak} days on GitHub.

🛠️ Key Projects:
- ${data.projects[0]?.title}: ${data.projects[0]?.description} (Tech: ${data.projects[0]?.tech_stack.join(", ")})
- ${data.projects[1]?.title || "Open Source roadmaps"}: ${data.projects[1]?.description || "Contributing to modern workflows"}

📩 Let's connect to chat about AI/DS or GSoC contributions!`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Generator</h1>
          <p className="text-gray-400 text-sm mt-1">
            Nexus monitors your completed milestones, GitHub commits, and career goals to generate CV sections, websites, and LinkedIn bios automatically.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-white/10 hover:border-violet-500/30 bg-[#0C0C0E] hover:bg-white/5 font-semibold text-xs transition"
          >
            <Printer size={14} /> Print Resume
          </button>
        </div>
      </div>

      {/* Mode Sub-nav */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setActiveSubTab("portfolio")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === "portfolio" ? "border-violet-500 text-white" : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          Portfolio Website Preview
        </button>
        <button
          onClick={() => setActiveSubTab("linkedin")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === "linkedin" ? "border-violet-500 text-white" : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          LinkedIn Summary
        </button>
      </div>

      {/* Website Preview Tab */}
      {activeSubTab === "portfolio" && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#111115] to-[#0A0A0C] p-8 shadow-2xl space-y-8 max-w-4xl mx-auto animate-fadeIn">
          {/* Top Info Bar */}
          <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">{data.name}</h2>
              <h4 className="text-violet-400 font-bold text-md">{data.title}</h4>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin size={12} className="text-cyan-400" />
                Bengaluru, India
              </p>
            </div>
            
            {/* GitHub connect badge */}
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300">
              <svg className="text-violet-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>Streak: <strong className="text-white font-bold">{data.github_stats.streak} days</strong></span>
            </div>
          </div>

          {/* Profile Bio */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">About Me</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{data.bio}</p>
          </div>

          {/* Projects section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Briefcase size={12} className="text-violet-400" /> Key Projects
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((proj: any, idx: number) => (
                <div key={idx} className="p-5 rounded-xl border border-white/5 bg-[#0C0C0E] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h5 className="font-bold text-sm text-white">{proj.title}</h5>
                    <p className="text-xs text-gray-400 leading-relaxed">{proj.description}</p>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech_stack.map((tech: string, tIdx: number) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-gray-400 uppercase">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {proj.github_link && (
                      <a 
                        href={proj.github_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 flex items-center gap-1.5 font-bold hover:underline"
                      >
                        Source Code <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones & Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            {/* Completed Roadmap Milestones */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Goal Milestones Complete</h4>
              <div className="space-y-2.5">
                {data.milestones.map((m: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#0C0C0E] border border-white/5">
                    <div>
                      <span className="font-semibold text-white block">{m.milestone_title}</span>
                      <span className="text-[10px] text-gray-500">Goal: {m.goal_title}</span>
                    </div>
                    <span className="text-gray-500 text-[10px] font-medium">{m.completed_date}</span>
                  </div>
                ))}
                {data.milestones.length === 0 && (
                  <div className="text-xs text-gray-500 text-center py-2">No milestones completed yet.</div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Unlocked Badges</h4>
              <div className="space-y-2.5">
                {data.achievements.map((a: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[#0C0C0E] border border-white/5">
                    <span className="text-xl">{a.icon || "🏆"}</span>
                    <div>
                      <span className="font-bold text-xs text-white block">{a.name}</span>
                      <span className="text-[10px] text-gray-400">{a.description}</span>
                    </div>
                  </div>
                ))}
                {data.achievements.length === 0 && (
                  <div className="text-xs text-gray-500 text-center py-2">No achievements unlocked yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Tab */}
      {activeSubTab === "linkedin" && (
        <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] p-6 max-w-4xl mx-auto space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <h3 className="font-bold text-md flex items-center gap-2">
              <svg className="text-cyan-400 fill-cyan-400/10" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              AI LinkedIn Summary Generator
            </h3>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(linkedinSummary);
                alert("LinkedIn summary copied to clipboard!");
              }}
              className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-xs font-semibold text-white transition"
            >
              Copy Summary
            </button>
          </div>
          <pre className="bg-[#08080A] border border-white/5 rounded-xl p-5 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap select-all">
            {linkedinSummary}
          </pre>
        </div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

export default function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-28">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-8">
              <Sparkles size={16}/>
              Trusted by 5,000+ teams
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">

              Transform

              <span className="block bg-gradient-to-r from-violet-400 via-cyan-300 to-white bg-clip-text text-transparent">

                Business Data

              </span>

              Into AI Decisions

            </h1>

            <p className="mt-8 text-gray-400 text-lg leading-8 max-w-xl">

              Nexus AI automates analytics, predicts business trends,
              and orchestrates intelligent workflows so your team
              spends less time analysing data and more time making
              decisions.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button 
                onClick={onGetStarted}
                className="group px-7 py-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold flex items-center gap-2 hover:scale-105 transition cursor-pointer"
              >

                Start Free

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />

              </button>

              <button 
                onClick={onGetStarted}
                className="px-7 py-4 rounded-full border border-gray-700 hover:border-cyan-400 flex items-center gap-3 transition cursor-pointer"
              >

                <PlayCircle size={22} />

                Live Demo

              </button>

            </div>


            <div className="grid grid-cols-3 gap-8 mt-14">

              <div>
                <h2 className="text-4xl font-bold">99.9%</h2>
                <p className="text-gray-500 mt-2">Prediction Accuracy</p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">10M+</h2>
                <p className="text-gray-500 mt-2">Data Events</p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">24/7</h2>
                <p className="text-gray-500 mt-2">Automation</p>
              </div>

            </div>

          </motion.div>

          {/* Right Dashboard */}

          <motion.div
            initial={{ opacity:0, scale:.85 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:.8, delay:.2 }}
            className="relative"
          >

            {/* Floating Card */}

            <div className="absolute -left-8 top-10 bg-[#151515] border border-violet-500/20 rounded-2xl px-5 py-4 shadow-2xl">

              <p className="text-gray-400 text-sm">
                AI Accuracy
              </p>

              <h3 className="text-3xl font-bold mt-1">
                99.8%
              </h3>

            </div>

            <div className="absolute -right-6 bottom-12 bg-[#151515] border border-cyan-500/20 rounded-2xl px-5 py-4 shadow-2xl">

              <p className="text-gray-400 text-sm">
                Active Agents
              </p>

              <h3 className="text-3xl font-bold mt-1">
                42
              </h3>

            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#171717] to-[#101010] p-8 shadow-[0_0_60px_rgba(139,92,246,.2)]">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-400">
                    Revenue Forecast
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    $2.4M
                  </h2>

                </div>

                <div className="text-green-400 font-semibold">
                  +24%
                </div>

              </div>

              <div className="space-y-5 mt-10">

                <div>

                  <div className="flex justify-between text-sm mb-2">
                    <span>AI Processing</span>
                    <span>92%</span>
                  </div>

                  <div className="h-3 rounded-full bg-gray-800">

                    <div className="h-3 rounded-full bg-violet-500 w-[92%]" />

                  </div>

                </div>

                <div>

                  <div className="flex justify-between text-sm mb-2">
                    <span>Prediction Engine</span>
                    <span>78%</span>
                  </div>

                  <div className="h-3 rounded-full bg-gray-800">

                    <div className="h-3 rounded-full bg-cyan-400 w-[78%]" />

                  </div>

                </div>

                <div>

                  <div className="flex justify-between text-sm mb-2">
                    <span>Automation</span>
                    <span>100%</span>
                  </div>

                  <div className="h-3 rounded-full bg-gray-800">

                    <div className="h-3 rounded-full bg-green-500 w-full" />

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">

                <div>
                  <p className="text-gray-500 text-sm">Models</p>
                  <h3 className="text-3xl font-bold mt-2">18</h3>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Datasets</p>
                  <h3 className="text-3xl font-bold mt-2">860</h3>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Insights</p>
                  <h3 className="text-3xl font-bold mt-2">1.2M</h3>
                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
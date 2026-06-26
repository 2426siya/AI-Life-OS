import { motion } from "framer-motion";
import {
  Database,
  BrainCircuit,
  Cpu,
  BarChart3,
} from "lucide-react";

const workflow = [
  {
    icon: Database,
    title: "Collect Data",
    desc: "Import data from APIs, cloud platforms, databases, and enterprise systems.",
  },
  {
    icon: BrainCircuit,
    title: "AI Processing",
    desc: "Our AI models clean, classify, and analyze millions of records in seconds.",
  },
  {
    icon: Cpu,
    title: "Automation",
    desc: "Deploy intelligent workflows that execute actions without manual intervention.",
  },
  {
    icon: BarChart3,
    title: "Business Insights",
    desc: "Visualize predictions through interactive dashboards and real-time analytics.",
  },
];

export default function Workflow({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-32 px-6 relative overflow-hidden">

      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm">
            AI Workflow
          </p>

          <h2 className="text-5xl font-black mt-5">
            From Raw Data to
            <span className="text-cyan-400"> Intelligent Action</span>
          </h2>

          <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg leading-8">
            Nexus AI transforms disconnected information into
            automated decisions through a seamless intelligent pipeline.
          </p>

        </motion.div>

        <div className="mt-24 grid lg:grid-cols-4 gap-8 relative">

          {workflow.map((step, index) => {

            const Icon = step.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity:0, y:50 }}
                whileInView={{ opacity:1, y:0 }}
                transition={{ delay:index*0.15 }}
                viewport={{ once:true }}
                whileHover={{ y:-10 }}
                className="relative z-10"
              >

                <div className="rounded-3xl bg-[#111111] border border-white/10 p-8 h-full hover:border-cyan-400 transition">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">

                    <Icon size={30}/>

                  </div>

                  <h3 className="text-2xl font-bold mt-8">
                    {step.title}
                  </h3>

                  <p className="mt-5 text-gray-400 leading-7">
                    {step.desc}
                  </p>

                </div>

                {index !== workflow.length - 1 && (

                  <div className="hidden lg:flex absolute top-20 -right-10 w-20 items-center">

                    <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>

                    <div className="w-3 h-3 rounded-full bg-cyan-400"></div>

                  </div>

                )}

              </motion.div>

            );

          })}

        </div>

        {/* Dashboard Preview */}

        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ delay:.4 }}
          className="mt-28 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#151515] to-[#0d0d0d] p-10"
        >

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>

              <h3 className="text-4xl font-black">
                Live AI Monitoring Dashboard
              </h3>

              <p className="mt-6 text-gray-400 leading-8">

                Monitor predictions, model health,
                automation status, business KPIs and
                infrastructure from one intelligent dashboard.

              </p>

              <button 
                onClick={onGetStarted}
                className="mt-8 px-7 py-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold hover:scale-105 transition cursor-pointer"
              >

                Explore Dashboard

              </button>

            </div>


            <div className="space-y-6">

              {[
                ["Prediction Accuracy","99%"],
                ["Automation Rate","96%"],
                ["Processing Speed","1.2M/sec"],
                ["Live AI Agents","42"],
              ].map(([label,value])=>(

                <div
                  key={label}
                  className="rounded-2xl bg-[#1b1b1b] p-6 border border-white/10"
                >

                  <div className="flex justify-between mb-3">

                    <span className="text-gray-400">
                      {label}
                    </span>

                    <span className="font-bold">
                      {value}
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-gray-800">

                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 w-[90%]" />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
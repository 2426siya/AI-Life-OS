import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$19",
    desc: "Perfect for individuals and students exploring AI automation.",
    features: [
      "5 AI Workflows",
      "10 GB Cloud Storage",
      "Basic Analytics",
      "Email Support",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "$49",
    desc: "Best for startups and growing businesses.",
    features: [
      "Unlimited AI Workflows",
      "Advanced Analytics",
      "Real-Time Monitoring",
      "Priority Support",
      "API Access",
      "Team Collaboration",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Tailored AI solutions for large organizations.",
    features: [
      "Unlimited Everything",
      "Dedicated AI Models",
      "Custom Integrations",
      "Enterprise Security",
      "24/7 Dedicated Support",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <p className="uppercase tracking-[0.35em] text-violet-400 text-sm">
            Pricing
          </p>

          <h2 className="mt-5 text-5xl font-black">
            Flexible Plans for
            <span className="text-violet-400"> Every Team</span>
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-gray-400 text-lg leading-8">
            Start free and scale as your AI workflows grow.
          </p>

        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {plans.map((plan, index) => (

            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={`rounded-3xl p-8 border transition relative overflow-hidden ${
                plan.featured
                  ? "border-violet-500 bg-gradient-to-b from-violet-600/20 to-[#121212] scale-105"
                  : "border-white/10 bg-[#111111]"
              }`}
            >

              {plan.featured && (
                <div className="absolute top-5 right-5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-3xl font-bold">{plan.name}</h3>

              <p className="text-gray-400 mt-3">{plan.desc}</p>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-6xl font-black">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className="text-gray-400 mb-2">/month</span>
                )}
              </div>

              <div className="mt-10 space-y-4">

                {plan.features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">

                      <Check size={16} className="text-violet-400" />

                    </div>

                    <span className="text-gray-300">
                      {feature}
                    </span>

                  </div>

                ))}

              </div>

              <button
                className={`w-full mt-10 py-4 rounded-xl font-semibold transition ${
                  plan.featured
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-105"
                    : "border border-white/10 hover:bg-white hover:text-black"
                }`}
              >
                {plan.price === "Custom"
                  ? "Contact Sales"
                  : "Get Started"}
              </button>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}
import { Globe, Mail, ArrowRight } from "lucide-react";
export default function Footer() {

  return (

    <footer className="border-t border-white/10 bg-[#09090B]">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-3 gap-12">

          <div>

            <h2 className="text-3xl font-black">

              Nexus AI

            </h2>

            <p className="text-gray-400 mt-5 leading-8">

              AI-powered business intelligence platform that transforms
              raw data into intelligent decisions through automation,
              analytics and predictive insights.

            </p>

          </div>

          <div>

            <h3 className="font-bold text-xl mb-6">

              Product

            </h3>

            <div className="space-y-4 text-gray-400">

              <p>Features</p>

              <p>Workflow</p>

              <p>Pricing</p>

              <p>FAQ</p>

            </div>

          </div>

          <div>

            <h3 className="font-bold text-xl mb-6">

              Connect

            </h3>

            <div className="flex gap-5">

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#151515] flex items-center justify-center hover:bg-violet-600 transition"
              >

                <Globe />

              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#151515] flex items-center justify-center hover:bg-violet-600 transition"
              >

                <ArrowRight />

              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#151515] flex items-center justify-center hover:bg-violet-600 transition"
              >

                <Mail />

              </a>

            </div>

          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">

          © 2026 Nexus AI • Built using React, TypeScript, Tailwind CSS & Framer Motion

        </div>

      </div>

    </footer>

  );

}
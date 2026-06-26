const Features = () => {
  return (
    <section id="features" className="py-20 px-6 md:px-20 bg-[#09090B] text-white">
      
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold">
          Features
        </h2>
        <p className="text-gray-400 mt-4">
          Everything you need to build a modern experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <h3 className="text-xl font-semibold mb-2">⚡ Fast Performance</h3>
          <p className="text-gray-400">
            Optimized for speed and smooth user experience.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <h3 className="text-xl font-semibold mb-2">🎨 Modern UI</h3>
          <p className="text-gray-400">
            Clean, minimal and responsive design system.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <h3 className="text-xl font-semibold mb-2">🔒 Secure</h3>
          <p className="text-gray-400">
            Built with best practices for safety and reliability.
          </p>
        </div>

      </div>

    </section>
  );
};

export default Features;
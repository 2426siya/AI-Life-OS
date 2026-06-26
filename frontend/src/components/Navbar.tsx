const Navbar = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#09090B]/70 backdrop-blur-md border-b border-white/10">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-white font-bold text-xl">
          NexusAI
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-gray-300">
          
          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#workflow" className="hover:text-white transition">
            Workflow
          </a>

          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>

          <a href="#faq" className="hover:text-white transition">
            FAQ
          </a>

        </div>

        {/* Button */}
        <div>
          <button 
            onClick={onGetStarted}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition text-white cursor-pointer"
          >
            Get Started
          </button>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
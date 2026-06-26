const FAQ = () => {
  return (
    <section id="faq" className="py-20 px-6 md:px-20 bg-[#09090B] text-white">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 mt-4">
          Everything you need to know about this project
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto space-y-4">

        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="font-semibold text-lg">
            What is this project about?
          </h3>
          <p className="text-gray-400 mt-2">
            This is a modern frontend landing page built using React and Vite with a clean UI.
          </p>
        </div>

        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="font-semibold text-lg">
            Is this responsive?
          </h3>
          <p className="text-gray-400 mt-2">
            Yes, it is fully responsive and works on mobile, tablet, and desktop screens.
          </p>
        </div>

        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="font-semibold text-lg">
            Can I deploy it on Vercel?
          </h3>
          <p className="text-gray-400 mt-2">
            Yes, it is fully compatible with Vercel and Netlify for easy deployment.
          </p>
        </div>

      </div>

    </section>
  );
};

export default FAQ;
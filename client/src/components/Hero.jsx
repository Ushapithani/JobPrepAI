function Hero() {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">

      <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-white/10 backdrop-blur-xl px-6 py-2 rounded-full mb-6 shadow-lg">
        <p className="text-sm text-gray-300">
          AI-Powered Career Operating System
        </p>
      </div>

      <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight max-w-5xl">
        Build Your Future With
       <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"> AI Career Intelligence</span>
      </h1>

      <p className="mt-8 max-w-2xl text-xl leading-8 text-slate-300">
        Analyze resumes, track jobs, prepare interviews,
        and grow your career using AI.
      </p>

      <div className="flex gap-5 mt-10">
        <button className="bg-blue-500 hover:bg-blue-600 transition px-8 py-4 rounded-2xl text-lg font-semibold">
          Get Started
        </button>

        <button className="border border-gray-700 hover:border-gray-500 transition px-8 py-4 rounded-2xl text-lg font-semibold text-white">
          Explore Features
        </button>
      </div>

    </section>
  )
}

export default Hero
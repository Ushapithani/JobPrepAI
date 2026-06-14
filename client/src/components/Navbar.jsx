function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800 bg-black/40 backdrop-blur-lg sticky top-0 z-50">
      
      <div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
  CareerForge AI
</h1>
      </div>

      <div className="flex items-center gap-6 text-gray-500">
        <a href="#" className="text-slate-300 font-semibold hover:text-white transition-all duration-300">
          Dashboard
        </a>

        <a href="#" className="hover:text-white transition">
          Resume AI
        </a>

        <a href="#" className="hover:text-white transition">
          Interview Prep
        </a>

        <a href="#" className="hover:text-white transition">
          AI Assistant
        </a>
      </div>

      <button className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition">
        Login
      </button>
    </nav>
  )
}

export default Navbar
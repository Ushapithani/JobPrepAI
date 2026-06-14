function CareerSuggestions() {
  return (
    <div className="mt-10">

      <h2 className="text-3xl font-bold text-white mb-6">
        AI Career Suggestions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-3">
            Recommended Career
          </h3>

          <p className="text-white text-2xl font-bold">
            Full Stack Developer
          </p>

          <p className="text-gray-400 mt-3">
            Strong frontend skills detected.
            Improve backend architecture knowledge.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            Skills To Learn
          </h3>

          <ul className="text-gray-300 space-y-2">
            <li>✓ Node.js</li>
            <li>✓ MongoDB</li>
            <li>✓ Docker</li>
            <li>✓ REST APIs</li>
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-purple-400 mb-3">
            Career Match Score
          </h3>

          <p className="text-5xl font-bold text-white">
            87%
          </p>

          <p className="text-gray-400 mt-3">
            Excellent match for modern web development roles.
          </p>
        </div>

      </div>

    </div>
  )
}

export default CareerSuggestions
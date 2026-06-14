function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

      <div className="bg-slate-900
border border-slate-700
text-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <h2 className="text-gray-400 text-lg">
          Applications
        </h2>

        <p className="text-5xl font-bold text-white mt-4">
          24
        </p>
      </div>

      <div className="bg-slate-900
border border-slate-700
text-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <h2 className="text-gray-400 text-lg">
          Interview Score
        </h2>

        <p className="text-5xl font-bold text-green-400 mt-4">
          82%
        </p>
      </div>

      <div className="bg-slate-900
border border-slate-700
text-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <h2 className="text-gray-400 text-lg">
          Resume ATS
        </h2>

        <p className="text-5xl font-bold text-blue-400 mt-4">
          91
        </p>
      </div>

    </div>
  )
}

export default DashboardCards
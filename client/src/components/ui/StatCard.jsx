function StatCard({ icon: Icon, label, tone = "sky", value }) {
  const tones = {
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
  }

  return (
    <article className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        {Icon ? (
          <div className={`rounded-xl p-3 ring-1 ${tones[tone] || tones.sky}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default StatCard

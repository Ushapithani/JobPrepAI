function PageHeader({ actions, description, eyebrow, title }) {
  return (
    <header className="mb-7 flex flex-col gap-4 rounded-xl border border-white/80 bg-white/80 p-5 shadow-sm shadow-slate-200/70 backdrop-blur lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export default PageHeader

import { NavLink } from "react-router-dom"

import {
  FiActivity,
  FiBarChart2,
  FiBriefcase,
  FiCpu,
  FiFileText,
  FiMessageSquare,
  FiTrendingUp,
  FiEdit3,
  FiTarget,
  FiAward,
} from "react-icons/fi"

const mainMenu = [
  {
    icon: FiActivity,
    name: "Dashboard",
    path: "/dashboard",
  },
]

const aiTools = [
  {
    icon: FiFileText,
    name: "Resume Analyzer",
    path: "/resume-analyzer",
  },


  {
    icon: FiEdit3,
    name: "Cover Letter",
    path: "/cover-letter",
  },

  {
    icon: FiMessageSquare,
    name: "AI Assistant",
    path: "/ai-assistant",
  },
]

const careerMenu = [
  {
    icon: FiBriefcase,
    name: "Job Tracker",
    path: "/job-tracker",
  },
  {
    icon: FiCpu,
    name: "Interview Prep",
    path: "/interview-prep",
  },
  {
    icon: FiTrendingUp,
    name: "Career Roadmap",
    path: "/career-roadmap",
  },
]

const insightsMenu = [
  {
    icon: FiTarget,
    name: "Job Match Analyzer",
    path: "/skill-gap",
  },
  {
    icon: FiBarChart2,
    name: "Analytics",
    path: "/analytics",
  },
]

const renderMenuItem = (item) => {

  const Icon = item.icon

  return (

    <NavLink
      key={item.path}
      to={item.path}
     className={({ isActive }) =>
  `flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
    isActive
      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
      : "text-slate-200 hover:bg-slate-800 hover:text-white"
  }`

        
      }
    >

      <Icon className="h-5 w-5" />

      <span>{item.name}</span>

    </NavLink>

  )
}

function Sidebar() {
  return (
    <aside className="sticky top-0 z-40 flex flex-col overflow-y-auto border-r border-slate-200 bg-slate-950 text-white px-5 py-6 shadow-xl lg:fixed lg:left-0 lg:h-screen lg:w-[240px]">

      <div>

        <NavLink
          to="/dashboard"
          className="block"
        >
          <div className="pb-6 border-b border-slate-700">

  <div className="flex items-center gap-3">

    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 text-xl shadow-lg">
      🚀
    </div>

    <div>
      <h1 className="text-2xl font-black text-white">
        CareerForge AI
      </h1>

      <p className="text-xs text-slate-400">
        Career Operating System
      </p>
    </div>

  </div>

</div>
        </NavLink>
       





      </div>

      <nav className="mt-8 flex flex-col">

 <p className="mb-3 mt-6 text-xs font-black tracking-[0.25em] uppercase text-slate-200">
  MAIN
</p>

  {mainMenu.map(renderMenuItem)}

  <p className="mb-3 mt-6 text-xs font-black tracking-[0.25em] uppercase text-slate-200">
  AI TOOLS
</p>
  {aiTools.map(renderMenuItem)}

 <p className="mb-3 mt-6 text-xs font-black tracking-[0.25em] uppercase text-slate-200">
  CAREER
</p>

  {careerMenu.map(renderMenuItem)}
<p className="mb-3 mt-6 text-xs font-black tracking-[0.25em] uppercase text-slate-200">
  INSIGHTS
</p>
  {insightsMenu.map(renderMenuItem)}

</nav>
<div className="mt-auto rounded-3xl bg-gradient-to-br from-blue-600 to-violet-700 p-5 shadow-xl">

  <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white shadow-xl">
    <p className="text-lg font-bold">
  🚀 CareerForge AI
</p>

   <p className="mt-2 text-sm opacity-90">
  Build your dream career with AI-powered guidance.
</p>

  </div>

</div>
    </aside>
  )
}

export default Sidebar
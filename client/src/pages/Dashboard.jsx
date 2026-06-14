import { useEffect, useMemo, useState } from "react"

import api from "../services/api"



import {
  FiBriefcase,
  FiCpu,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi"

function Dashboard() {
  const [profile, setProfile] = useState({})

  const [jobs, setJobs] = useState([])
  const [
  showOverview,
  setShowOverview,
] = useState(false)
  const savedProfile = profile
const resumeProgress = 0
const interviewProgress = 0
const applicationProgress = 0
const userName =
  profile?.fullName?.trim()
    ? profile.fullName.split(" ")[0]
    : "User"

const resumeScore =
  localStorage.getItem(
    "resumeScore"
  ) || 0

const jobMatchScore =
  localStorage.getItem(
    "jobMatchScore"
  ) || 0

const profileFields = [
  savedProfile.fullName,
  savedProfile.email,
  savedProfile.phone,
  savedProfile.location,
  savedProfile.linkedin,
  savedProfile.github,
  savedProfile.portfolio,
  savedProfile.skills,
  savedProfile.careerGoal,
  savedProfile.profileImage,
]

const profileCompletion =
  Math.round(
    (
      profileFields.filter(
        field =>
          field &&
          field.toString().trim() !== ""
      ).length /
      profileFields.length
    ) * 100
  )
 
        useEffect(() => {

  const fetchJobs = async () => {
    try {

      const response =
        await api.get("/jobs")

      setJobs(response.data)

    } catch (error) {

      console.log(error)

    }
  }

  const fetchProfile = async () => {
    try {

      const { data } =
        await api.get("/profile")

      setProfile(data || {})

    } catch (error) {

      console.log(error)

    }
  }

  fetchJobs()
  fetchProfile()

}, [])
  const analytics = useMemo(() => {

    const totalJobs = jobs.length

    const interviews = jobs.filter(
      (job) => job.status === "Interview"
    ).length

    const offers = jobs.filter(
      (job) => job.status === "Offer"
    ).length

    const resumeScore =
      totalJobs > 0

        ? Math.min(
            100,
            60 + offers * 10 + interviews * 5
          )

        : 0

    const growth =
      totalJobs > 0

        ? `+${Math.min(
            100,
            offers * 12 + interviews * 4
          )}%`

        : "0%"

    return {

      totalJobs,

      interviews,

      offers,

      resumeScore,

      growth,

    }

  }, [jobs])

  const stats = [

  {
    title: "Applications",
    value: analytics.totalJobs,
    icon: FiBriefcase,
    color: "from-sky-500 to-blue-600",
  },

  {
    title: "Resume Score",
    value: `${resumeScore}%`,
    icon: FiFileText,
    color: "from-emerald-500 to-green-600",
  },

  {
    title: "Job Match",
    value: `${jobMatchScore}%`,
    icon: FiCpu,
    color: "from-violet-500 to-purple-600",
  },

  {
    title: "Profile",
    value: `${profileCompletion}%`,
    icon: FiTrendingUp,
    color: "from-orange-500 to-red-500",
  },

]

  return (

    <div className="space-y-8 text-slate-100">
    

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl">

        <div className="max-w-3xl">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">

            AI Career Platform

          </p>

          <h1 className="text-5xl font-black leading-tight">

           Welcome Back, {userName} 🚀

          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">

            Track applications, optimize resumes, prepare for interviews,
            and accelerate your career growth using powerful AI tools.

          </p>       
<button
  onClick={() =>
    setShowOverview(true)
  }
  className="mt-8 rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:scale-105 hover:shadow-xl"
>
  🚀 Explore Features
</button>
        </div>

      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {

          const Icon = item.icon

          return (

            <div
              key={item.title}
              className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-violet-500 hover:shadow-violet-500/20"
            >

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color}`}
              >

                <Icon className="h-7 w-7 text-white" />

              </div>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-400">

                {item.title}

              </h3>

             <p className="mt-2 text-4xl font-black text-white ">

  {item.value}

</p>

{
item.title === "Resume Score" && (

<div className="mt-3 h-2 rounded-full bg-slate-200">

  <div
    className="h-2 rounded-full bg-green-500"
    style={{
      width: `${resumeScore}%`,
    }}
  />

</div>

)
}
{
item.title === "Job Match" && (

<div className="mt-3 h-2 rounded-full bg-slate-200">

  <div
    className="h-2 rounded-full bg-orange-500"
    style={{
      width: `${jobMatchScore}%`,
    }}
  />

</div>

)
}
{
item.title === "Profile" && (

<div className="mt-3 h-2 rounded-full bg-slate-200">

  <div
    className="h-2 rounded-full bg-purple-500"
    style={{
  width: `${profileCompletion}%`,
}}
  />

</div>

)
}

<p className="mt-2 text-sm text-slate-500">

  {item.title === "Applications" &&
    "Track your job search"}

  {item.title === "Resume Score" &&
    "ATS readiness"}

  {item.title === "Job Match" &&
    "Skill alignment"}

  {item.title === "Profile" &&
    "Profile completion"}

</p>
            </div>

          )

        })}

      </section>
     <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

  <h2 className="text-2xl font-bold text-white">
    Recent Applications
  </h2>

  <div className="mt-4">

  {jobs.length === 0 ? (

    <div className="flex flex-col items-center justify-center py-12">

      <div className="text-5xl">
        📂
      </div>

      <h3 className="mt-4 text-xl font-bold">

        No Applications Yet

      </h3>

      <p className="mt-2 text-slate-400">

        Start tracking your job applications.

      </p>
      <p className="mt-2 text-sm text-slate-400">
Build your application pipeline and track progress.
</p>
      <button
  onClick={() =>
    window.location.href =
      "/job-tracker"
  }
  className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 font-semibold text-white transition hover:scale-105"
>

  + Add Application

</button>

    </div>

  ) : (

    <div className="space-y-3">

      {jobs.slice(0, 5).map(job => (

        <div
          key={job._id}
          className="flex items-center justify-between rounded-xl border border-slate-900 p-4"
        >

          <div>

            <p className="font-semibold">
              {job.company}
            </p>

            <p className="text-sm text-slate-300">
              {job.role}
            </p>

          </div>

          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm">

            {job.status}

          </span>

        </div>

      ))}

    </div>

  )}

</div>

</section>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <div>

            <h2 className="text-2xl font-bold text-white">

              Career Progress

            </h2>

            <p className="mt-1 text-sm text-slate-300">

Resume quality, interview readiness
and application momentum.

</p>

          </div>

          {
resumeProgress === 0 &&
interviewProgress === 0 &&
applicationProgress === 0 ? (

<div className="flex flex-col items-center justify-center py-12"> 

  <div className="text-6xl">
    📈
  </div>

  <h3 className="mt-4 text-2xl font-bold text-white">
    No Career Progress Yet
  </h3>

  <p className="mt-3 max-w-md text-center text-slate-300">

    Start your career journey by analyzing
    your resume, preparing for interviews,
    and tracking job applications.

  </p>
  <div className="mt-5 space-y-2 text-slate-300">

  <p>✓ Analyze Resume</p>

  <p>✓ Track Applications</p>

  <p>✓ Prepare Interviews</p>

</div>

  <button
    onClick={() =>
      window.location.href =
        "/resume-analyzer"
    }
    className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
  >

    🚀 Get Started

  </button>

</div>


) : (

<div className="mt-8 space-y-6">

  {/* Existing Progress Bars */}

</div>

)
}
</div>
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <h2 className="text-2xl font-bold text-white">

            AI Insights

          </h2>

          <div className="mt-6 space-y-4">

  <div className="rounded-xl border-l-4 border-green-500 bg-green-500/20 border border-green-500/40 p-4">

    <p className="font-semibold text-white">
      Resume Insight
    </p>

    <p className="mt-1 text-sm text-slate-200">

      {resumeScore < 60
        ? "⚠️ Your ATS score is low. Add more technical skills and project achievements."
        : resumeScore < 80
        ? "📈 Your resume is improving. Add measurable achievements to reach top ATS scores."
        : "✅ Excellent ATS score. Your resume is highly optimized."}

    </p>

  </div>

 <div className="rounded-xl border-l-4 border-orange-500 bg-orange-500/20 border border-orange-500/40 p-4">

    <p className="font-semibold text-white">
      Job Match Insight
    </p>

    <p className="mt-1 text-sm text-slate-200">

      {jobMatchScore < 60
        ? "🎯 Learn missing skills from target jobs to improve your match score."
        : jobMatchScore < 80
        ? "🚀 Good alignment. A few additional skills can boost your opportunities."
        : "🔥 Strong skill alignment with job requirements."}

    </p>

  </div>

  <div className="rounded-xl border-l-4 border-purple-500 bg-purple-500/20 border border-purple-500/40 p-4">

    <p className="font-semibold text-white">
      Profile Insight
    </p>

    <p className="mt-1 text-sm text-slate-200">

      {profileCompletion < 100
        ? `👤 Complete your profile. ${100 - profileCompletion}% is still missing.`
        : "🎉 Your profile is fully completed and optimized."}

    </p>

  </div>

 <div className="rounded-xl border-l-4 border-blue-500 bg-blue-500/20 border border-blue-500/40 p-4">

    <p className="font-semibold text-white">
      Career Growth
    </p>

    <p className="mt-1 text-sm text-slate-200">

      {analytics.totalJobs === 0
        ? "💼 Start tracking applications to unlock career analytics."
        : analytics.offers > 0
        ? "🎉 Great progress! You already have job offers."
        : analytics.interviews > 0
        ? "🎤 Interviews are in progress. Keep preparing."
        : "🚀 Keep applying consistently to improve opportunities."}

    </p>

  </div>

</div>
        </div>

      </section>
     {showOverview && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-2xl">

      <div className="flex items-center justify-between">

        <h2 className="text-3xl font-black text-slate-900">
          🚀 Welcome to CareerForge AI
        </h2>

       <button
  onClick={() =>
    setShowOverview(false)
  }
  className="text-2xl font-bold text-slate-500 hover:text-slate-900"
>
  ✕
</button> 
      </div>

      <p className="mt-3 text-slate-500">
        Your complete AI-powered career operating system.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl border p-5">
          <h3 className="font-semibold text-slate-900">
            📄 Resume Analyzer
          </h3>
          <p className="mt-2 text-slate-600">
            Improve ATS score and get AI recommendations.
          </p>
        </div>

        <div className="rounded-2xl border p-5">
          <h3 className="font-semibold text-slate-900">
            ✉️ Cover Letter Generator
          </h3>
          <p className="mt-2 text-slate-600">
            Generate personalized cover letters instantly.
          </p>
        </div>

        <div className="rounded-2xl border p-5">
         <h3 className="font-semibold text-slate-900">
            🎯 Job Match Analyzer
          </h3>
          <p className="mt-2 text-slate-600">
            Compare your skills against job requirements.
          </p>
        </div>

        <div className="rounded-2xl border p-5">
         <h3 className="font-semibold text-slate-900">
            💼 Job Tracker
          </h3>
          <p className="mt-2 text-slate-600">
            Track applications, interviews, and offers.
          </p>
        </div>

        <div className="rounded-2xl border p-5">
          <h3 className="font-semibold text-slate-900">
            🎤 Interview Prep
          </h3>
          <p className="mt-2 text-slate-600">
            Practice technical and HR interview questions.
          </p>
        </div>

        <div className="rounded-2xl border p-5">
          <h3 className="font-semibold text-slate-900">
            📊 Analytics
          </h3>
          <p className="mt-2 text-slate-600">
            Monitor your career growth and performance.
          </p>
        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-blue-50 p-5">

        <h3 className="font-bold text-blue-700">
          🚀 Recommended Journey
        </h3>

        <ol className="mt-3 list-decimal pl-5 text-slate-700 space-y-2">

          <li>Complete your Profile</li>

          <li>Analyze your Resume</li>

          <li>Check Job Match Score</li>

          <li>Generate Cover Letters</li>

          <li>Track Applications</li>

          <li>Prepare for Interviews</li>

        </ol>

      </div>

    </div>

  </div>

)}
    </div>

  )
}

export default Dashboard


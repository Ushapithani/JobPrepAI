import { useEffect, useState } from "react"

import api from "../services/api"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function AnalyticsPage() {

  const [jobs, setJobs] = useState([])

  const [savedProfile, setSavedProfile] =
  useState({})

  useEffect(() => {

    const fetchJobs = async () => {

      try {

       

       const response = await api.get(
  "/jobs"
)

        setJobs(response.data)

      } catch (error) {

        console.log(error)

      }

    }

    fetchJobs()

  }, [])

  useEffect(() => {

  const fetchProfile = async () => {

    try {

      const { data } =
        await api.get("/profile")

      setSavedProfile(data || {})

    } catch (error) {

      console.log(error)

    }

  }

  fetchProfile()

}, [])

  const savedCount = jobs.filter(
  job => job.status === "Saved"
).length

  
const appliedCount = jobs.filter(
  job => job.status === "Applied"
).length

const applicationCount = appliedCount

  const interviewCount = jobs.filter(
    (job) => job.status === "Interview"
  ).length

  const offerCount = jobs.filter(
    (job) => job.status === "Offer"
  ).length

  const rejectedCount = jobs.filter(
    (job) => job.status === "Rejected"
  ).length

  const totalJobs = jobs.length
  const successRate = applicationCount

    ? Math.round(
        (offerCount / applicationCount) * 100
      )

    : 0
    

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

const completedFields =
  profileFields.filter(
    field =>
      field &&
      field.toString().trim() !== ""
  ).length

const profileCompletion =
  Math.round(
    (completedFields /
      profileFields.length) * 100
  )

const resumeScore =
  Number(
    localStorage.getItem(
      "resumeScore"
    )
  ) || 0

const jobMatchScore =
  Number(
    localStorage.getItem(
      "jobMatchScore"
    )
  ) || 0

  const statusData = [
  {
    name: "Saved",
    value: savedCount,
    color: "#8b5cf6",
  },
  {
    name: "Applied",
    value: appliedCount,
    color: "#3b82f6",
  },
  {
    name: "Interview",
    value: interviewCount,
    color: "#f59e0b",
  },
  {
    name: "Offer",
    value: offerCount,
    color: "#10b981",
  },
  {
    name: "Rejected",
    value: rejectedCount,
    color: "#ef4444",
  },
]

  const applicationData = [

    {
      month: "Applications",
      applications: applicationCount,
    },

    {
      month: "Interviews",
      applications: interviewCount,
    },

    {
      month: "Offers",
      applications: offerCount,
    },

    {
      month: "Rejected",
      applications: rejectedCount,
    },

  ]

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-black text-slate-950">

          Analytics Dashboard 📊

        </h1>

        <p className="mt-2 text-slate-600">

          Track your job search performance and career growth.

        </p>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-white">

              Applications Overview

            </h2>

            <p className="text-sm text-slate-300">

              Real-time job analytics

            </p>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={applicationData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="applications"
                  radius={[10, 10, 0, 0]}
                  fill="#2563eb"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

           <h2 className="text-xl font-bold text-slate-900">
  Application Status
</h2>

            <p className="text-sm text-slate-900">

              Distribution of applications

            </p>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={4}
                >

                  {statusData.map((entry) => (

                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
  title="Saved Jobs"
  value={savedCount}
  color="from-purple-500 to-violet-600"
/>

        <StatCard
          title="Applications"
          value={applicationCount}
          color="from-blue-500 to-sky-600"
        />

        <StatCard
          title="Interviews"
          value={interviewCount}
          color="from-amber-500 to-orange-500"
        />

        <StatCard
          title="Offers"
          value={offerCount}
          color="from-emerald-500 to-green-600"
        />

        <StatCard
  title="Rejected"
  value={rejectedCount}
  color="from-red-500 to-rose-600"
/>

        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          color="from-violet-500 to-purple-600"
        />
        <StatCard
  title="Profile Completion"
  value={`${profileCompletion}%`}
  color="from-cyan-500 to-blue-600"
/>

<StatCard
  title="Resume Score"
  value={`${resumeScore}%`}
  color="from-green-500 to-emerald-600"
/>

<StatCard
  title="Job Match Score"
  value={`${jobMatchScore}%`}
  color="from-pink-500 to-rose-600"
/>
<StatCard
  title="Total Jobs"
  value={totalJobs}
  color="from-indigo-500 to-blue-600"
/>


            </div>

     <div className="rounded-2xl bg-white p-6 shadow-sm">

  <h2 className="mb-4 text-xl font-bold">
    Recent Activity
  </h2>

  <div className="space-y-3">

    {jobs.length === 0 ? (

  <p className="text-slate-500">
    No activity yet
  </p>

) : (

  [...jobs]
    .sort(
      (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
    )
    .slice(0, 5)
    .map((job) => (
      <div
        key={job._id}
        className="border-b pb-3"
      >
        <p className="font-semibold">
          {job.role}
        </p>

        <p className="text-sm text-slate-500">
          {job.company}
        </p>

        <p className="text-xs text-slate-400">
          {job.status}
        </p>
      </div>
    ))

)}

  </div>

</div>

  </div>





  )
}



    

function StatCard({
  title,
  value,
  color,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`h-2 rounded-full bg-gradient-to-r ${color}`}
      />

      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-600">

        {title}

      </p>

      <h2 className="mt-3 text-4xl font-black text-slate-950">

        {value}

      </h2>

    </div>

  )
}

export default AnalyticsPage
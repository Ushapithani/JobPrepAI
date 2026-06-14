import { useEffect, useMemo, useState } from "react"

import {
  FiActivity,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiFilter,
  FiPlus,
  FiTrash2,
  FiX,
  FiXCircle,
} from "react-icons/fi"

import api from "../../services/api"

import EmptyState from "../ui/EmptyState"

const statuses = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
]

const statusStyles = {

  Saved:
  "bg-violet-50 text-violet-700 ring-violet-200",

  Applied:
    "bg-sky-50 text-sky-700 ring-sky-200",

  Interview:
    "bg-amber-50 text-amber-700 ring-amber-200",

  Offer:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",

  Rejected:
    "bg-rose-50 text-rose-700 ring-rose-200",

}

const emptyForm = {

  company: "",

  location: "",

  notes: "",

  role: "",

 status: "Saved",

}

function JobTracker() {

  const [editingId, setEditingId] = useState(null)

  const [filter, setFilter] = useState("All")

  const [formData, setFormData] = useState(emptyForm)

  const [isLoading, setIsLoading] = useState(true)

  const [isSaving, setIsSaving] = useState(false)

  const [jobs, setJobs] = useState([])

  const [searchQuery, setSearchQuery] = useState("")
const [searchResults, setSearchResults] = useState([])
const [page, setPage] = useState(1)
const [location, setLocation] =
  useState("")
const [selectedJob, setSelectedJob] = useState(null)
const [showModal, setShowModal] = useState(false)


const searchJobs = async () => {
  try {
    setPage(1)
    setSearchResults([])

const { data } = await api.get(
  `/job-search/search?q=${encodeURIComponent(
    searchQuery || "software engineer"
  )}&location=${encodeURIComponent(
    location
  )}&page=1`
)

setSearchResults(data)
    
  } catch (error) {

  console.error("SAVE JOB ERROR:", error)

  console.log(error.response?.data)

  alert(
    JSON.stringify(
      error.response?.data || error.message
    )
  )

}
}
const loadMoreJobs = async () => {

  try {

    const nextPage = page + 1

    const { data } = await api.get(
      `/job-search/search?q=${encodeURIComponent(
        searchQuery || "software engineer"
      )}&location=${encodeURIComponent(
        location
      )}&page=${nextPage}`
    )

   setSearchResults((current) => {

  const combined = [
    ...current,
    ...data,
  ]
const uniqueJobs = combined.filter(
  (job, index, self) =>
    index ===
    self.findIndex(
      (j) =>
        `${j.title}-${j.company?.display_name}` ===
        `${job.title}-${job.company?.display_name}`
    )
)

  return uniqueJobs
})

    setPage(nextPage)

  } catch (error) {

    console.log(error)

  }

}
const saveLiveJob = async (job) => {

  const exists = jobs.some(
    (j) =>
      j.company ===
        job.company?.display_name &&
      j.role === job.title
  )

  if (exists) {
    alert("Job already saved")
    return
  }

  

  try {

    const response = await api.post(
      "/jobs",
      {
        company:
          job.company?.display_name || "",

        role:
          job.title || "",

        location:
          job.location?.display_name || "",

        notes:
          job.description || "",

        status: "Saved",
      }
    )

    setJobs((current) => [
      response.data,
      ...current,
    ])

    alert(`Saved: ${job.title}`)

  } catch (error) {

    console.log(error)

    alert("Failed to save job")

  }

}
  useEffect(() => {

    const fetchJobs = async () => {

      try {

        
        
        const response = await api.get(
  "/jobs"
)

        setJobs(response.data)

      } catch (error) {

        console.log(error)

        alert("Could not load jobs")

      } finally {

        setIsLoading(false)

      }

    }

    fetchJobs()

  }, [])

  const filteredJobs = useMemo(() => {

    if (filter === "All") return jobs

    return jobs.filter(
      (job) => job.status === filter
    )

  }, [filter, jobs])

  const counts = useMemo(

    () =>

      statuses.reduce(

        (summary, status) => ({

          ...summary,

          [status]: jobs.filter(
            (job) => job.status === status
          ).length,

        }),

        { All: jobs.length }

      ),

    [jobs]

  )
   


  const handleChange = (event) => {

    setFormData((current) => ({

      ...current,

      [event.target.name]:
        event.target.value,

    }))

  }

  const resetForm = () => {

    setEditingId(null)

    setFormData(emptyForm)

  }

  const handleSubmit = async (event) => {

    event.preventDefault()

    setIsSaving(true)

    try {



      if (editingId) {

        

       const response = await api.put(
  `/jobs/${editingId}`,
  formData
)

        setJobs((current) =>

          current.map((job) =>

            job._id === editingId
              ? response.data
              : job

          )

        )

      } else {

        const response = await api.post(
  "/jobs",
  formData
)

setJobs((current) => [
  response.data,
  ...current,
])

      }

      resetForm()

    } catch (error) {

      console.log(error)

      alert("Could not save job")

    } finally {

      setIsSaving(false)

    }
  }

  const handleEdit = (job) => {

    setEditingId(job._id)

    setFormData({

      company: job.company || "",

      location: job.location || "",

      notes: job.notes || "",

      role: job.role || "",

      status: job.status || "Applied",

    })

  }

  const handleDelete = async (jobId) => {

    try {

     

      await api.delete(
  `/jobs/${jobId}`
)

      setJobs((current) =>

        current.filter(
          (job) => job._id !== jobId
        )

      )

    } catch (error) {

      console.log(error)

      alert("Could not delete job")

    }

  }

  return (
   <>
    <div className="space-y-6">
    
      <div className="rounded-2xl bg-white p-6 shadow-sm">

  <h2 className="text-xl font-bold mb-4">
    🔍 Search Live Jobs
  </h2>
<div className="flex gap-3">

  <input
    type="text"
    placeholder="Java Developer"
    value={searchQuery}
    onChange={(e) =>
      setSearchQuery(e.target.value)
    }
    className="flex-1 rounded-xl border px-4 py-3"
  />

  <button
    onClick={searchJobs}
    className="rounded-xl bg-blue-600 px-6 py-3 text-white"
  >
    Search
  </button>

</div>

<div className="mt-4">

  <h3 className="mb-3 font-semibold">
    ⚙️ Filters
  </h3>

  <div className="grid gap-3 md:grid-cols-3">

    {/* Location */}

    <input
  type="text"
  placeholder="Enter Location (e.g. Hyderabad)"
  value={location}
  onChange={(e) =>
    setLocation(e.target.value)
  }
  className="rounded-lg border p-3"
/>

  </div>

</div>

</div>
 
     {searchResults.length > 0 && (

  <div className="rounded-2xl bg-white p-6 shadow-sm">
<p className="text-sm text-slate-500">
  Found {searchResults.length} jobs
</p>
    <h2 className="mb-4 text-xl font-bold">
      Live Jobs
    </h2>

    <div className="space-y-4">

      {searchResults.map((job) => (

        <div
  key={job.redirect_url}
  className="rounded-xl border p-5"
>

  <h3 className="text-lg font-bold text-slate-900">
    {job.title}
  </h3>

  <p className="mt-2 text-slate-700">
    🏢 {job.company?.display_name}
  </p>

  <p className="text-slate-700">
    📍 {job.location?.display_name}
  </p>

  <p className="text-slate-700">
    💰 {
      job.salary_min && job.salary_max
        ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max).toLocaleString()}`
        : "Salary Not Disclosed"
    }
  </p>

  <p className="text-slate-700">
    🏷️ {job.category?.label}
  </p>

  <div className="mt-3 rounded-lg bg-slate-50 p-3">

    <p className="text-sm text-slate-600">
  {job.description?.substring(0, 80)}...
</p>

  </div>

 <div className="mt-4 flex gap-2">

 <button
  onClick={() => {
    setSelectedJob(job)
    setShowModal(true)
  }}
  className="rounded-lg bg-slate-700 px-4 py-2 text-white"
>
  👁 View Details
</button>
  <a
    href={job.redirect_url}
    target="_blank"
    rel="noreferrer"
    className="rounded-lg bg-green-600 px-4 py-2 text-white"
  >
    Apply Now
  </a>

<button
  onClick={() =>
    saveLiveJob(job)
  }
  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
>
  💾 Save Job
</button>
</div>

</div>
      ))}
      <div className="mt-6 flex justify-center">

  <button
  onClick={loadMoreJobs}
  className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
>
  🚀 Load More Jobs
</button>

</div>

    </div>

  </div>

)}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={FiActivity}
          title="Applications"
          value={jobs.length}
          color="from-blue-500 to-sky-600"
        />

        <StatCard
          icon={FiClock}
          title="Interviews"
          value={counts.Interview || 0}
          color="from-amber-500 to-orange-500"
        />

        <StatCard
          icon={FiCheckCircle}
          title="Offers"
          value={counts.Offer || 0}
          color="from-emerald-500 to-green-600"
        />

        <StatCard
          icon={FiXCircle}
          title="Rejected"
          value={counts.Rejected || 0}
          color="from-rose-500 to-red-600"
        />

      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">

        <form
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-slate-950">

              {editingId
                ? "Edit Job"
                : "Add Job"}

            </h2>

            {editingId ? (

              <button
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                type="button"
                onClick={resetForm}
              >

                <FiX className="h-5 w-5" />

              </button>

            ) : null}

          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-700">

            Company

            <input
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />

          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">

            Role

            <input
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />

          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">

            Location

            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">

            Status

            <select
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              {statuses.map((status) => (

                <option key={status}>
                  {status}
                </option>

              ))}

            </select>

          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">

            Notes

            <textarea
              className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />

          </label>

          <button
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            disabled={isSaving}
            type="submit"
          >

            <FiPlus className="h-4 w-4" />

            {isSaving
              ? "Saving..."
              : editingId
              ? "Save Changes"
              : "Add Job"}

          </button>

        </form>

        <section>

          <div className="mb-5 flex flex-wrap items-center gap-2">

            <FiFilter className="h-4 w-4 text-slate-500" />

            {["All", ...statuses].map(
              (status) => (

                <button
                  key={status}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    filter === status
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                  type="button"
                  onClick={() =>
                    setFilter(status)
                  }
                >

                  {status} (
                  {counts[status] || 0})

                </button>

              )

            )}

          </div>

          {isLoading ? (

            <p className="text-slate-500">

              Loading jobs...

            </p>

          ) : filteredJobs.length ? (

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {filteredJobs.map((job) => (

                <div
                  key={job._id}
                  className="grid gap-4 border-b border-slate-100 px-5 py-5"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-lg font-bold text-slate-950">

                        {job.company}

                      </p>

                      <p className="text-sm text-slate-500">

                        {job.location ||
                          "Remote"}

                      </p>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                        statusStyles[
                          job.status
                        ] ||
                        statusStyles.Applied
                      }`}
                    >

                      {job.status}

                    </span>

                  </div>

                  <div>

                    <p className="font-semibold text-slate-800">

                      {job.role}

                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                      {job.notes}

                    </p>

                  </div>

                  <div className="flex gap-2">

                    <button
                      className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100"
                      type="button"
                      onClick={() =>
                        handleEdit(job)
                      }
                    >

                      <FiEdit2 className="h-4 w-4" />

                    </button>

                    <button
                      className="rounded-xl border border-slate-200 p-2 hover:bg-rose-50"
                      type="button"
                      onClick={() =>
                        handleDelete(job._id)
                      }
                    >

                      <FiTrash2 className="h-4 w-4" />

                    </button>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <EmptyState
              description="Add your first application."
              icon={FiBriefcase}
              title="No jobs found"
            />

          )}

        </section>

      </div>

    </div>
{showModal && selectedJob && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">

      <div className="flex items-center justify-between">

        <div>

  <h2 className="text-2xl font-bold">
    {selectedJob.title}
  </h2>

  <p className="text-slate-500">
    {selectedJob.company?.display_name}
  </p>

</div>
        <button
          onClick={() => setShowModal(false)}
          className="text-2xl"
        >
          ✕
        </button>

      </div>

     <div className="mt-4 space-y-2">

  <p>🏢 {selectedJob.company?.display_name}</p>

  <p>📍 {selectedJob.location?.display_name}</p>

  <p>
    💰 {
      selectedJob.salary_min &&
      selectedJob.salary_max
        ? `₹${Math.round(
            selectedJob.salary_min
          ).toLocaleString()} - ₹${Math.round(
            selectedJob.salary_max
          ).toLocaleString()}`
        : "Salary Not Disclosed"
    }
  </p>

  <p>🏷️ {selectedJob.category?.label}</p>

</div>

      <div className="mt-6">

        <h3 className="font-bold">
          Job Description
        </h3>

       <div className="mt-2 max-h-80 overflow-y-auto rounded-lg bg-slate-50 p-4">

 <p className="whitespace-pre-wrap text-slate-700">
  {selectedJob.description || "No description available"}
</p>

</div>
      </div>

      <div className="mt-6 flex gap-3">

        <a
          href={selectedJob.redirect_url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-green-600 px-4 py-2 text-white"
        >
          Apply Now
        </a>

        <button
          onClick={() =>
            saveLiveJob(selectedJob)
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Save Job
        </button>

      </div>

    </div>

  </div>

)}
   </>
)
}

function StatCard({
  icon: Icon,
  title,
  value,
  color,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${color}`}
      >

        <Icon className="h-6 w-6 text-white" />

      </div>

      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">

        {title}

      </p>

      <h2 className="mt-2 text-4xl font-black text-slate-950">

        {value}

      </h2>

    </div>
    

  )
}

export default JobTracker
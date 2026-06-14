import { useEffect, useState } from "react"
import api from "../services/api"

function ResumeHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
const deleteAnalysis =
  async (id) => {

    if (
      !window.confirm(
        "Delete this analysis?"
      )
    )
      return

    await api.delete(
      `/resume/history/${id}`
    )

    setHistory(
      history.filter(
        item => item._id !== id
      )
    )
  }
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await api.get("/resume/history")
        setHistory(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-black text-slate-900">
          📜 Resume History
        </h1>

        <p className="mt-2 text-slate-500">
          Review all your previous ATS resume analyses.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-8 shadow">
          Loading...
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <div className="text-6xl mb-4">
            📄
          </div>

          <h3 className="text-xl font-bold">
            No Resume Analysis Yet
          </h3>

          <p className="mt-2 text-slate-500">
            Analyze your first resume to build history.
          </p>
        </div>
      ) : (
        history.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl bg-white p-6 shadow"
          >

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  ATS Score
                </h2>

                <p className="text-sm text-slate-500">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div
                className={`rounded-full px-4 py-2 font-bold text-white ${
                  item.atsScore >= 80
                    ? "bg-green-600"
                    : item.atsScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
              >
                {item.atsScore}/100
              </div>

            </div>

            <div className="mt-4">
              <h3 className="font-bold">
                Summary
              </h3>

              <p className="mt-2 text-slate-700">
                {item.summary}
              </p>
              
            </div>

            <div className="mt-4">

              <h3 className="font-bold text-green-700">
                Strengths
              </h3>

              <ul className="mt-2 space-y-2">
                {item.strengths?.map((s) => (
                  <li
                    key={s}
                    className="rounded-lg bg-green-50 p-2"
                  >
                    ✅ {s}
                  </li>
                ))}
              </ul>

            </div>

            <div className="mt-4">

              <h3 className="font-bold text-red-700">
                Gaps
              </h3>

              <ul className="mt-2 space-y-2">
                {item.gaps?.map((g) => (
                  <li
                    key={g}
                    className="rounded-lg bg-red-50 p-2"
                  >
                    ⚠️ {g}
                  </li>
                ))}
              </ul>

            </div>
<button
  onClick={() =>
    deleteAnalysis(item._id)
  }
  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
>
  🗑 Delete
</button>
          </div>
        ))
      )}
    </div>
  )
}

export default ResumeHistoryPage
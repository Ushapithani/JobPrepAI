import { useState } from "react"
import api from "../../services/api"
import { useNavigate } from "react-router-dom"
function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const analyzeResume = async () => {
    if (!resumeText.trim() && !file) {
      alert("Upload a resume or paste resume text")
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem("careerforge_token")
      const formData = new FormData()

      if (file) {
        formData.append("resume", file)
      }

      formData.append("resumeText", resumeText)
      formData.append("jobDescription", jobDescription)

     const response = await api.post(
  "/ai/resume/analyze",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
)

localStorage.setItem(
  "resumeScore",
  response.data.atsScore || 0
)

setResult(response.data)

    } catch (error) {
      console.error(error)
      alert(
        error?.response?.data?.message ||
          "Resume analysis failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          Resume Upload
        </h2>

        <div className="mb-5">

  <label className="block text-sm font-semibold text-slate-700 mb-2">
    Upload Resume
  </label>

  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 transition-all hover:border-blue-500 hover:bg-blue-100">

    <span className="text-4xl mb-2">
      📄
    </span>

    <p className="font-semibold text-blue-700">
      Click to Upload Resume
    </p>

    <p className="text-sm text-slate-500 mt-1">
      PDF or DOCX supported
    </p>

    <input
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      onChange={(e) =>
        setFile(e.target.files[0])
      }
    />

  </label>

  {file && (

    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">

      <div className="flex items-center gap-2">

        <span className="text-lg">
          ✅
        </span>

        <div>

          <p className="font-semibold text-green-700">
            File Selected
          </p>

          <p className="text-sm text-slate-600">
            {file.name}
          </p>

        </div>

      </div>

    </div>

  )}

</div>

        <textarea
          value={resumeText}
          onChange={(e) =>
            setResumeText(e.target.value)
          }
          placeholder="Or paste resume text..."
          className="w-full h-56 border rounded-lg p-3 text-black"
        />

        <textarea
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(e.target.value)
          }
          placeholder="Optional Job Description..."
          className="w-full h-32 border rounded-lg p-3 mt-4 text-black"
        />

        <button
          onClick={analyzeResume}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
        >
          {loading
            ? "Analyzing..."
            : "Analyze Resume"}
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          ATS Analysis
        </h2>

        {result ? (
          <>
            <div className="mb-6 flex flex-col items-center">

  <h3 className="font-bold mb-4">
    ATS Score
  </h3>

  <div className="relative flex items-center justify-center">

    <div
      className="h-36 w-36 rounded-full flex items-center justify-center"
      style={{
        background: `conic-gradient(
          ${
            result.atsScore >= 80
              ? "#16a34a"
              : result.atsScore >= 60
              ? "#f59e0b"
              : "#dc2626"
          }
          ${result.atsScore * 3.6}deg,
          #e5e7eb 0deg
        )`,
      }}
    >

      <div className="h-28 w-28 rounded-full bg-white flex flex-col items-center justify-center">

        <span className="text-3xl font-black">
          {result.atsScore}
        </span>

        <span className="text-xs text-gray-500">
          ATS
        </span>

      </div>

    </div>

  </div>

</div>

            <div className="mb-4">
              <h3 className="font-bold">
                Summary
              </h3>
              <p>{result.summary}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">
                Strengths
              </h3>
              <ul className="space-y-3">
  {result.strengths?.map((item) => (
    <li
      key={item}
      className="rounded-xl border border-green-200 bg-green-50 p-3 text-green-700"
    >
      ✅ {item}
    </li>
  ))}
</ul>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">
                Gaps
              </h3>
              <ul className="space-y-3">
  {result.gaps?.map((item) => (
    <li
      key={item}
      className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700"
    >
      ⚠️ {item}
    </li>
  ))}
</ul>
            </div>

            <div>
              <h3 className="font-bold">
                Recommendations
              </h3>
              <ul className="space-y-3">
  {result.recommendations?.map((item) => (
    <li
      key={item}
      className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-700"
    >
      🚀 {item}
    </li>
  ))}
</ul>
            </div>
            <div className="mt-6">
  <button
    onClick={() =>
      navigate("/resume-history")
    }
    className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
  >
    📜 View Resume History
  </button>
</div>
          </>
        ) : (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">

  <div className="mb-4 text-6xl">
    📊
  </div>

  <h3 className="text-xl font-bold text-slate-800">
    No Analysis Yet
  </h3>

  <p className="mt-2 text-slate-500">
    Upload your resume and run AI analysis to get ATS score,
    strengths, gaps, and recommendations.
  </p>

</div>
        )}

      </div>

    </div>
  )
}

export default ResumeAnalyzer
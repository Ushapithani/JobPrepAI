import { useState } from "react"
import api from "../../services/api"

const SKILLS_DB = [
  "python",
  "java",
  "javascript",
  "react",
  "node.js",
  "mongodb",
  "mysql",
  "sql",
  "html",
  "css",
  "git",
  "github",
  "aws",
  "docker",
  "kubernetes",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "tensorflow",
  "pytorch",
  "express",
  "c++",

   // QA Skills
  "qa",
  "quality assurance",
  "testing",
  "manual testing",
  "automation testing",
  "test cases",
  "test scripts",
  "bug tracking",
  "jira",
  "documentation",
  "selenium",
  "postman"

]

function SkillGapAnalyzer() {

  const [skills, setSkills] = useState("")
  const [jobSkills, setJobSkills] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [result, setResult] = useState(null)

  const extractSkills = () => {

    if (!resumeText.trim()) {
      alert("Please paste resume text")
      return
    }

    const text = resumeText.toLowerCase()

    const foundSkills =
      SKILLS_DB.filter(skill => {

        const regex =
          new RegExp(
            `\\b${skill.replace(/\+/g, "\\+")}\\b`,
            "i"
          )

        return regex.test(text)

      })

    setSkills(
      foundSkills.join(", ")
    )

  }

  const extractFromResume = async () => {

    if (!resumeFile) {
      alert("Please upload a resume")
      return
    }

    try {

     
      const formData =
        new FormData()

      formData.append(
        "resume",
        resumeFile
      )

     const response =
  await api.post(
    "/skills/extract-skills",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  )
      setSkills(
        response.data.skills.join(", ")
      )

    } catch (error) {

      console.error(error)

      alert(
        error?.response?.data?.message ||
        "Skill extraction failed"
      )

    }

  }

  const analyze = () => {

    const userSkills =
      skills
        .toLowerCase()
        .split(",")
        .map(skill =>
          skill.trim()
        )
        .filter(Boolean)

    const requiredSkills =
      SKILLS_DB.filter(skill => {

        const regex =
          new RegExp(
            `\\b${skill.replace(/\+/g, "\\+")}\\b`,
            "i"
          )

        return regex.test(
          jobSkills.toLowerCase()
        )

      })

    if (requiredSkills.length === 0) {
  setResult({
    score: 0,
    matched: [],
    missing: [],
    recommendations: [
      "No recognizable skills found in the Job Description."
    ]
  })
  return
}

    

    const matched =
      requiredSkills.filter(skill =>
        userSkills.includes(skill)
      )

    const missing =
      requiredSkills.filter(skill =>
        !userSkills.includes(skill)
      )

    const score = Math.round(
      (matched.length /
        requiredSkills.length) * 100
    )

    const recommendations =
      missing.map(skill => {

        const map = {
          aws:
            "Learn AWS Cloud Practitioner",
          docker:
            "Build a Dockerized project",
          kubernetes:
            "Study Kubernetes fundamentals",
          git:
            "Practice Git and GitHub workflows",
          sql:
            "Learn SQL queries and database design",
          react:
            "Build React projects",
          "node.js":
            "Create REST APIs using Node.js",
          python:
            "Practice Python problem solving",
          "machine learning":
            "Complete an ML course and projects",
        }

        return (
          map[skill] ||
          `Learn ${skill}`
        )

      })

    localStorage.setItem(
  "jobMatchScore",
  score
)

setResult({
  score,
  matched,
  missing,
  recommendations,
})
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl bg-white p-6 shadow">

        <label className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 transition hover:border-blue-500 hover:bg-blue-100">

          <span className="text-4xl">
            📄
          </span>

          <span className="mt-2 font-semibold text-slate-700">
            Click to Upload Resume
          </span>

          <span className="text-sm text-slate-500">
            PDF or DOCX supported
          </span>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) =>
              setResumeFile(
                e.target.files[0]
              )
            }
          />

        </label>

        {resumeFile && (

          <div className="mb-4 rounded-2xl border border-green-300 bg-green-50 p-4">

            <p className="font-semibold text-green-700">
              ✅ Resume Selected
            </p>

            <p className="mt-1 text-sm text-green-600">
              {resumeFile.name}
            </p>

          </div>

        )}

        <textarea
          placeholder="Paste Resume Text Here..."
          value={resumeText}
          onChange={(e) =>
            setResumeText(
              e.target.value
            )
          }
          className="mb-4 h-40 w-full rounded-xl border p-3"
        />

        <textarea
          placeholder="Extracted Skills"
          value={skills}
          onChange={(e) =>
            setSkills(
              e.target.value
            )
          }
          className="mb-4 h-32 w-full rounded-xl border p-3"
        />

        <textarea
          placeholder="Paste Job Description or Required Skills"
          value={jobSkills}
          onChange={(e) =>
            setJobSkills(
              e.target.value
            )
          }
          className="mb-4 h-40 w-full rounded-xl border p-3"
        />

        <div className="flex flex-wrap gap-3">

          <button
            onClick={extractSkills}
            className="rounded-xl bg-green-600 px-6 py-3 text-white"
          >
            Extract Skills
          </button>

          <button
            onClick={extractFromResume}
            className="rounded-xl bg-violet-600 px-6 py-3 text-white"
          >
            📄 Extract From Resume
          </button>

          <button
            onClick={analyze}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white"
          >
            Analyze Match
          </button>

        </div>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow">

        {result ? (

          <>

            <div className="mb-6 rounded-2xl bg-slate-100 p-5">

              <h2
                className={`text-3xl font-black ${
                  result.score >= 80
                    ? "text-green-600"
                    : result.score >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Match Score: {result.score}%
              </h2>

              <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-300">

                <div
                  className={`h-full rounded-full ${
                    result.score >= 80
                      ? "bg-green-600"
                      : result.score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                  style={{
                    width:
                      `${result.score}%`,
                  }}
                />

              </div>

            </div>

            <h3 className="font-bold">
              Matched Skills
            </h3>

            <ul className="mt-2 list-disc pl-6">
              {result.matched.map(skill => (
                <li key={skill}>
                  ✅ {skill}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-bold">
              Missing Skills
            </h3>

            <ul className="mt-2 list-disc pl-6">
              {result.missing.map(skill => (
                <li key={skill}>
                  ⚠️ {skill}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-bold text-green-600">
              Learning Recommendations
            </h3>

            <ul className="mt-2 list-disc pl-6">
              {result.recommendations.map(item => (
                <li key={item}>
                  🚀 {item}
                </li>
              ))}
            </ul>

          </>

        ) : (

         <p className="mt-2 text-slate-500">
  Upload your resume and compare it with a job description
  to discover your match percentage, missing skills,
  and learning recommendations.
</p>
        )}

      </div>

    </div>
  )
}

export default SkillGapAnalyzer
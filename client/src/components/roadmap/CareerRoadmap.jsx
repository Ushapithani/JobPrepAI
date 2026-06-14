import { useState } from "react"
import api from "../../services/api"

function CareerRoadmap() {

  const [skills, setSkills] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [experienceLevel, setExperienceLevel] =
    useState("Beginner")

  const [timeline, setTimeline] =
    useState("6 Months")

  const [targetCompany, setTargetCompany] =
    useState("All")

  const [loading, setLoading] =
    useState(false)

  const [roadmap, setRoadmap] =
    useState(null)
  const [generatedAt, setGeneratedAt] =
  useState(null)

  const generateRoadmap = async () => {

    if (!skills || !targetRole) {
      alert("Please fill all required fields")
      return
    }

    try {

      setLoading(true)

     

      const response =
  await api.post(

    "/ai/ask",

    {
      prompt: `

Act as a professional AI Career Coach.

Current Skills:
${skills}

Target Role:
${targetRole}

Experience Level:
${experienceLevel}

Timeline:
${timeline}

Target Company:
${targetCompany}

Return ONLY valid JSON.

{
  "careerScore": "",
  "careerStage": "",
  "currentLevel": "",

  "currentSkills": [],
  "requiredSkills": [],
  "skillGaps": [],

  "learningRoadmap": [
  {
    "month": 1,
    "goal": "",
    "topics": [],
    "weeklyPlan": [],
    "resources": [],
    "practicalAssignment": "",
    "outcome": ""
  }
],
  "learningResources":[
  {
    "name":"",
    "type":"",
    "link":""
  }
],

 "recommendedProjects": [
  {
    "title": "",
    "difficulty": "",
    "description": "",
    "skillsCovered": [],
    "estimatedTime": ""
  }
],

  "recommendedCertifications": [
  {
    "name": "",
    "platform": "",
    "difficulty": "",
    "duration": ""
  }
],

  "salaryPotential": "",

  "finalAdvice": ""
}
  Create a highly detailed career roadmap.

For each month provide:

1. Goal
2. Topics to Learn (4-6)
3. Weekly Plan
   - Week 1
   - Week 2
   - Week 3
   - Week 4
4. Learning Resources
5. Practical Assignment
6. Expected Outcome

Roadmap must be practical, structured,
career-focused and beginner friendly.

Do not leave any field empty.
IMPORTANT:

weeklyPlan must be an array of strings.

Example:

"weeklyPlan": [
  "Week 1 - Learn Tableau Basics",
  "Week 2 - Build 3 Dashboards",
  "Week 3 - Learn Power BI",
  "Week 4 - Build Project"
]

Do NOT return objects.
IMPORTANT:

For each roadmap month:

resources:
- Must contain 3 to 5 real resources
- Include courses, websites, documentation,
  YouTube channels or practice platforms
Examples:

- Coursera Python for Everybody
- freeCodeCamp JavaScript Course
- Django Official Documentation
- MDN Web Docs
- GitHub Learning Lab

Never return an empty array.

outcome:
- Must describe what the learner can achieve
- Must be specific and measurable

practicalAssignment:
- Must be a mini-project or hands-on task

CRITICAL REQUIREMENT

Every month MUST contain:

resources:
minimum 3 resources

practicalAssignment:
minimum 1 hands-on task

outcome:
minimum 1 measurable achievement

If any of these fields are empty,
the response is invalid.

Generate complete values for every month.
Example:

Month 1

Goal:
Master Data Visualization

Topics:
- Tableau Basics
- Charts
- Dashboards
- Matplotlib

Weekly Plan:
- Week 1 Learn Tableau Interface
- Week 2 Build Visualizations
- Week 3 Learn Matplotlib
- Week 4 Create Dashboard

Resources:
- Tableau Public Free Training
- Coursera Data Visualization
- Kaggle Data Visualization Course

Practical Assignment:
Build a sales dashboard using Tableau.

Outcome:
Create and publish one interactive dashboard
on Tableau Public.
Make the roadmap detailed and practical.

Generate at least 3 projects:

1 Beginner
1 Intermediate
1 Advanced

Generate 3 relevant certifications.

Generate at least 5 learning resources.

Types:
- Course
- Documentation
- Practice Platform
- Website
- YouTube Channel

Example:

[
  {
    "name":"Coursera",
    "type":"Course",
    "link":"https://coursera.org"
  },
  {
    "name":"Kaggle Learn",
    "type":"Practice Platform",
    "link":"https://kaggle.com/learn"
  }
]
Do not return learningResources as strings.
Do not leave learningResources empty.


`
          },

          {}
        )

      const cleaned =
        response.data.reply
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()

      try {

  const parsed =
    JSON.parse(cleaned)
  const currentSkillsCount =
  parsed.currentSkills?.length || 0

const requiredSkillsCount =
  parsed.requiredSkills?.length || 1

let score = Math.round(
  (currentSkillsCount / requiredSkillsCount) * 100
)

// Experience-based adjustment
if (experienceLevel === "Beginner") {
  score = Math.max(25, Math.min(score, 60))
}

if (experienceLevel === "Intermediate") {
  score = Math.max(50, Math.min(score, 80))
}

if (experienceLevel === "Advanced") {
  score = Math.max(80, Math.min(score, 100))
}

parsed.careerScore = score
console.log(parsed.learningResources)
console.log(
  "Monthly Resources:",
  parsed.learningRoadmap?.[0]?.resources
)
  setRoadmap(parsed)
  setGeneratedAt(
  new Date().toLocaleString()
)
setTimeout(() => {

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  })

}, 300)
} catch {

  alert(
    "AI returned invalid format. Please try again."
  )

}
    } catch (error) {

      console.error(error)

      alert(
        "Failed to generate roadmap"
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="space-y-6">

      {/* HERO */}

      <div className="rounded-3xl bg-white p-8 shadow">

        <h1 className="text-4xl font-bold">

          AI Career Planner 🚀

        </h1>

        <p className="mt-3 max-w-3xl text-slate-600">

          Generate personalized career roadmaps,
          discover skill gaps, explore learning
          resources, build portfolio projects and
          accelerate your journey toward your
          dream role.

        </p>

      </div>

      {/* FORM */}

      <div className="rounded-3xl bg-white p-6 shadow">

        <h2 className="mb-6 text-2xl font-bold">

          Career Roadmap Generator

        </h2>

        {/* Skills */}

        <label className="mb-2 block font-medium">

          Current Skills

        </label>

        <input
          value={skills}
          onChange={(e) =>
            setSkills(e.target.value)
          }
          placeholder="Python, React, MongoDB"
          className="mb-4 w-full rounded-xl border p-3"
        />

        <div className="mb-6 flex flex-wrap gap-2">

          {[
            "Python",
            "Java",
            "React",
            "Node.js",
            "AWS",
            "Machine Learning",
            "Data Science",
            "SQL"
          ].map((skill) => (

            <button
              key={skill}
              type="button"
              onClick={() =>
  setSkills((prev) => {
    const current = prev
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    if (current.includes(skill))
      return prev

    return prev
      ? `${prev}, ${skill}`
      : skill
  })
}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-blue-100"
            >
              {skill}
            </button>

          ))}

        </div>

        {/* Target Role */}

        <label className="mb-2 block font-medium">

          Target Role

        </label>

        <input
          value={targetRole}
          onChange={(e) =>
            setTargetRole(
              e.target.value
            )
          }
          placeholder="AI Engineer"
          className="mb-4 w-full rounded-xl border p-3"
        />

        {/* Experience */}

        <label className="mb-2 block font-medium">

          Experience Level

        </label>

        <select
          value={experienceLevel}
          onChange={(e) =>
            setExperienceLevel(
              e.target.value
            )
          }
          className="mb-4 w-full rounded-xl border p-3"
        >

          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>

        </select>

        {/* Timeline */}

        <label className="mb-2 block font-medium">

          Timeline

        </label>

        <select
          value={timeline}
          onChange={(e) =>
            setTimeline(
              e.target.value
            )
          }
          className="mb-4 w-full rounded-xl border p-3"
        >

          <option>3 Months</option>
          <option>6 Months</option>
          <option>12 Months</option>

        </select>

        {/* Company */}

        <label className="mb-2 block font-medium">

          Target Company

        </label>

        <select
          value={targetCompany}
          onChange={(e) =>
            setTargetCompany(
              e.target.value
            )
          }
          className="mb-6 w-full rounded-xl border p-3"
        >

          <option>All</option>
          <option>Google</option>
          <option>Amazon</option>
          <option>Microsoft</option>
          <option>TCS</option>
          <option>Infosys</option>

        </select>

       <button
  onClick={generateRoadmap}
  disabled={loading}
  className="rounded-xl bg-blue-600 px-6 py-3 text-white"
>

  {loading ? (
    <div className="flex items-center gap-2">

      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

      Generating Roadmap...

    </div>
  ) : (
    "🚀 Generate AI Career Plan"
  )}

</button>

      </div>

      {roadmap && (

        <div className="space-y-6">

          {/* CAREER SCORE */}

          <div className="rounded-3xl bg-white p-6 shadow">

            <p className="text-sm text-slate-500">

              Career Readiness Score

            </p>

            <h2 className="mt-2 text-5xl font-black">

              {Math.min(
  100,
  Math.max(
    0,
    roadmap.careerScore
  )
)}%
{generatedAt && (
  <p className="mt-2 text-xs text-slate-500">
    Generated: {generatedAt}
  </p>
)}

            </h2>
            <div className="mt-4 h-3 w-full rounded-full bg-slate-200">

  <div
    className="h-3 rounded-full bg-blue-600"
    style={{
      width: `${Math.min(
  100,
  Math.max(
    0,
    roadmap.careerScore
  )
)}%`
    }}
  />

</div>

            <p className="mt-2 text-slate-600">

              {roadmap.careerStage}

            </p>
           <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">

  {roadmap.careerStage}

</span>
          </div>
                    {/* CURRENT PROFILE */}

          <div className="rounded-3xl bg-white p-6 shadow">

            <h3 className="mb-4 text-2xl font-bold">
              📊 Current Profile Assessment
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl border p-4">
                <p className="text-sm text-slate-500">
                  Current Level
                </p>

                <h4 className="mt-2 text-lg font-semibold">
                  {roadmap.currentLevel}
                </h4>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-slate-500">
                  Target Role
                </p>

                <h4 className="mt-2 text-lg font-semibold">
                  {targetRole}
                </h4>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-slate-500">
                  Timeline
                </p>

                <h4 className="mt-2 text-lg font-semibold">
                  {timeline}
                </h4>
              </div>

            </div>

          </div>

          {/* SKILL GAP ANALYSIS */}

          <div className="rounded-3xl bg-white p-6 shadow">

            <h3 className="mb-6 text-2xl font-bold">
              🎯 Skill Gap Analysis
            </h3>

            <div className="grid gap-6 md:grid-cols-3">

              <div>

                <h4 className="mb-3 font-semibold text-green-600">
                  ✅ Current Skills
                </h4>

                <div className="flex flex-wrap gap-2">

                  {roadmap.currentSkills?.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

              <div>

                <h4 className="mb-3 font-semibold text-blue-600">
                  📚 Required Skills
                </h4>

                <div className="flex flex-wrap gap-2">

                  {roadmap.requiredSkills?.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

              <div>

                <h4 className="mb-3 font-semibold text-red-600">
                  ⚠ Missing Skills
                </h4>

                <div className="flex flex-wrap gap-2">

                  {roadmap.skillGaps?.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* LEARNING ROADMAP */}

          <div className="rounded-3xl bg-white p-6 shadow">

            <h3 className="mb-6 text-2xl font-bold">
              🗺 Learning Roadmap
            </h3>

            <div className="space-y-4">

  {roadmap.learningRoadmap?.map(
    (item, index) => (

      <div
        key={index}
        className="rounded-2xl border p-5"
      >

        <h4 className="text-xl font-bold text-blue-600">
          📅 Month {item.month}
        </h4>

        <div className="mt-4">

          <h5 className="font-semibold">
            🎯 Goal
          </h5>

          <p>
            {item.goal}
          </p>

        </div>

        <div className="mt-4">

          <h5 className="font-semibold">
            📚 Topics
          </h5>

          <ul className="ml-5 list-disc">

            {item.topics?.map(
              (topic, idx) => (

                <li key={idx}>
                  {topic}
                </li>

              )
            )}

          </ul>

        </div>

        <div className="mt-4">

          <h5 className="font-semibold">
            📝 Weekly Plan
          </h5>

          <ul className="ml-5 list-disc">

           {item.weeklyPlan?.map(
  (week, idx) => (

    <li key={idx}>

      {typeof week === "string"
        ? week
        : Object.entries(week).map(
            ([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            )
          )}

    </li>

  )
)}

          </ul>

        </div>

        <div className="mt-4">

          <h5 className="font-semibold">
            📖 Resources
          </h5>

          <ul className="ml-5 list-disc">

            {item.resources?.map(
              (resource, idx) => (

                <li key={idx}>
                  {typeof resource === "string"
  ? resource
  : resource.name}
                </li>

              )
            )}

          </ul>

        </div>
        <div className="mt-4 rounded-lg bg-yellow-50 p-4">

  <h5 className="font-semibold text-yellow-700">
    🛠 Practical Assignment
  </h5>

  <p>
    {item.practicalAssignment}
  </p>

</div>

        <div className="mt-4 rounded-lg bg-green-50 p-4">

          <h5 className="font-semibold text-green-700">
            🏆 Outcome
          </h5>

          <p>
            {item.outcome}
          </p>

        </div>

      </div>

    )
  )}


</div>
</div>

         {/* LEARNING RESOURCES */}

<div className="rounded-3xl bg-white p-6 shadow">

  <h3 className="mb-6 text-2xl font-bold">
    📚 Recommended Learning Resources
  </h3>

  <div className="grid gap-4 md:grid-cols-2">

    {roadmap.learningResources?.length > 0 ? (

  roadmap.learningResources.map(
    (resource, index) => (

      <div
        key={index}
        className="rounded-xl border p-5"
      >

        {typeof resource === "string" ? (

          <h4 className="font-bold">
            {resource}
          </h4>

        ) : (

          <>
            <h4 className="font-bold">
              {resource.name}
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              {resource.type}
            </p>

            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-blue-600 hover:underline"
            >
              Visit Resource →
            </a>
          </>

        )}

      </div>

    )
  )

) : (

  <p className="text-slate-500">
    No learning resources generated.
  </p>

)}

   
  </div>

</div>

          {/* PROJECTS */}

          <div className="rounded-3xl bg-white p-6 shadow">

            <h3 className="mb-6 text-2xl font-bold">
              💻 Recommended Projects
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              {roadmap.recommendedProjects?.map(
                (
                  project,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-xl border p-5"
                  >

                    <h4 className="text-lg font-bold">
                      {project.title}
                    </h4>

                    <p className="mt-2 text-sm text-slate-500">
                      Difficulty:
                      {" "}
                      {project.difficulty}
                    </p>

                    <p className="mt-3">
                      {project.description}
                    </p>
                    <p className="mt-3 text-sm">
  <strong>Skills Covered:</strong>{" "}
  {project.skillsCovered?.join(", ")}
</p>

<p className="mt-2 text-sm">
  <strong>Estimated Time:</strong>{" "}
  {project.estimatedTime}
</p>
                  </div>

                )
              )}

            </div>

          </div>

          {/* CERTIFICATIONS */}

          <div className="rounded-3xl bg-white p-6 shadow">

            <h3 className="mb-6 text-2xl font-bold">
              🏆 Recommended Certifications
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              {roadmap.recommendedCertifications?.map(
                (
                  cert,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-xl border p-5"
                  >

                    <h4 className="font-bold">
                      {cert.name}
                    </h4>

                    <p className="mt-2 text-sm text-slate-500">
                      {cert.platform}
                    </p>
<p className="mt-2 text-sm">
  <strong>Difficulty:</strong>{" "}
  {cert.difficulty}
</p>

<p className="text-sm">
  <strong>Duration:</strong>{" "}
  {cert.duration}
</p>
                  </div>

                )
              )}

            </div>

          </div>

          {/* SALARY */}

          <div className="rounded-3xl bg-white p-6 shadow">

            <h3 className="mb-4 text-2xl font-bold">
              💰 Salary Potential
            </h3>

            <p className="text-lg">
              {roadmap.salaryPotential}
            </p>

          </div>

          {/* AI CAREER ADVICE */}

          <div className="rounded-3xl border-l-4 border-blue-600 bg-white p-6 shadow">

            <h3 className="mb-4 text-2xl font-bold">
              🚀 AI Career Advice
            </h3>

            <div className="rounded-xl bg-blue-50 p-4">

  <p className="leading-relaxed">
    {roadmap.finalAdvice}
  </p>

</div>

          </div>

        </div>

      )}

    </div>

  )

}

export default CareerRoadmap
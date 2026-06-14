import jsPDF from "jspdf"
import { useState } from "react"
import api from "../services/api"
import questionBankData from "../data/questionBankData"


import {
  FiCpu,
  FiLoader,
  FiMessageSquare,
} from "react-icons/fi"

function InterviewPrepPage() {

  const [activeTab, setActiveTab] =
    useState("mock")

  const [role, setRole] =
    useState("AI Engineer")
  const [customRole, setCustomRole] =
  useState("")

  const [difficulty, setDifficulty] =
    useState("Intermediate")

  const [questions, setQuestions] =
    useState([])

  const [answers, setAnswers] =
    useState([])

  const [feedback, setFeedback] =
    useState("")

  const [isLoading, setIsLoading] =
    useState(false)

  const [evaluating, setEvaluating] =
    useState(false)
 
  const [selectedCategory, setSelectedCategory] =
  useState(null)

const [selectedTopic, setSelectedTopic] =
  useState(null)

const [openAnswer, setOpenAnswer] =
  useState(null)
const [topicQuestions, setTopicQuestions] =
  useState([])

const [loadingQuestions, setLoadingQuestions] =
  useState(false)
const [voiceMode, setVoiceMode] =
  useState(false)

const [isListening, setIsListening] =
  useState(false)
const [company, setCompany] =
  useState("All")
    const [scores, setScores] =
  useState({
    overall: 0,
    communication: 0,
    technical: 0,
    confidence: 0,
  })
 

const [searchTerm, setSearchTerm] =
  useState("")
  const [difficultyFilter, setDifficultyFilter] =
  useState("All")
const answeredCount =
  answers.filter(
    answer =>
      answer &&
      answer.trim() !== ""
  ).length
const filteredCategories =
  questionBankData.filter(
    (category) =>
      category.category
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  )
  const speakQuestion = (text) => {

  if (!voiceMode) return

  window.speechSynthesis.cancel()

  const utterance =
    new SpeechSynthesisUtterance(text)

  utterance.lang = "en-US"
  utterance.rate = 1

  window.speechSynthesis.speak(
    utterance
  )

}
  
  const generateQuestions = async () => {

  if (
    role === "Other..." &&
    !customRole.trim()
  ) {
    alert("Please enter a custom role.")
    return
  }

  try {

    setIsLoading(true)

    const token =
      localStorage.getItem(
        "careerforge_token"
      )
    let rolePrompt =
  role === "Other..."
    ? customRole
    : role
    
    if (
      role === "Communication Skills"
    ) {

      rolePrompt = `
Communication Skills Interview

Focus on:
- Self Introduction
- Public Speaking
- Presentations
- Active Listening
- Workplace Communication
- Confidence Building
`
    }

    if (
      role === "Group Discussion"
    ) {

      rolePrompt = `
Group Discussion Assessment

Focus on:
- Current Affairs
- Technology Topics
- Leadership
- Team Collaboration
- Problem Solving
`
    }

    if (
      role === "HR Interview"
    ) {

      rolePrompt = `
HR Interview

Focus on:
- Self Introduction
- Strengths & Weaknesses
- Career Goals
- Teamwork
- Leadership
- Conflict Resolution
`
    }

    const prompt = `
Generate exactly 10 interview questions for:

${rolePrompt}

Difficulty: ${difficulty}

Return ONLY questions.
One question per line.
No headings.
No explanations.
No numbering.
`

   const response =
  await api.post(
    "/ai/ask",
    { prompt }
  )

    const parsedQuestions =
      response.data.reply
        .split("\n")
        .filter(
          (line) =>
            line.trim()
        )

    setQuestions(
      parsedQuestions
    )

    if (
      parsedQuestions.length > 0
    ) {

      speakQuestion(
        parsedQuestions[0]
      )

    }

    setAnswers([])
    setFeedback("")

  } catch (error) {

    console.error(error)

    alert(
      "Failed to generate questions"
    )

  } finally {

    setIsLoading(false)

  }

          }
    const exportPdf = () => {

  const doc = new jsPDF()

  let y = 20

  doc.setFontSize(18)
  doc.text(
    "CareerForge AI - Question Bank",
    20,
    y
  )

  y += 15

  doc.setFontSize(12)

  doc.text(
    `Category: ${selectedCategory?.category}`,
    20,
    y
  )

  y += 10

  doc.text(
    `Topic: ${selectedTopic}`,
    20,
    y
  )

  y += 15

  topicQuestions.forEach(
    (item, index) => {

      doc.setFontSize(14)

      doc.text(
        `${index + 1}. ${item.question}`,
        20,
        y
      )

      y += 8

      doc.setFontSize(11)

      doc.text(
        `Difficulty: ${item.difficulty}`,
        20,
        y
      )

      y += 8

      const answer =
        doc.splitTextToSize(
          `Answer: ${item.answer}`,
          170
        )

      doc.text(
        answer,
        20,
        y
      )

      y += answer.length * 6 + 8

      const explanation =
        doc.splitTextToSize(
          `Explanation: ${item.explanation}`,
          170
        )

      doc.text(
        explanation,
        20,
        y
      )

      y += explanation.length * 6 + 8

      if (y > 250) {

        doc.addPage()

        y = 20

      }

    }
  )

  doc.save(
    `${selectedTopic}-Questions.pdf`
  )

}

    const generateTopicQuestions =
  async (
    category,
    topic,
    company
  ) => {
    
    try {

      setLoadingQuestions(true)

      const token =
        localStorage.getItem(
          "careerforge_token"
        )
      

      const prompt = `
Generate 10 interview questions for:

Category: ${category}
Topic: ${topic}

${topic === "Group Discussion"
? `
Special Instructions:

Generate Group Discussion (GD) topics instead of interview questions.

The topics should be:
- Debate topics
- Opinion-based topics
- Current affairs topics
- Technology topics
- Workplace discussion topics

Examples:
- Should AI replace human jobs?
- Remote Work vs Office Work
- Impact of Social Media
- Future of Artificial Intelligence
- Online Education vs Traditional Education
`
: ""}

Difficulty: ${difficulty}
Company:${company}
Target Audience:
- Students
- Freshers
- Internship Candidates
- Experienced Professionals
- Career Switchers

Rules:


If company is not "All":

- Generate questions commonly asked by ${company}.
- Match the interview style of ${company}.
- Include company-specific focus areas.
- Include real interview patterns when possible.

If company is "All":

- Generate industry-standard interview questions.

- Return ONLY valid JSON.
- Do not return markdown.
- Do not return explanations outside JSON.
- Generate professional interview-ready content.
- Answers should be detailed, meaningful and practical.
- Answers should sound natural and conversational.
- Avoid one-line answers.
- Avoid robotic AI-generated language.
- Do not assume specific years of experience.
- Do not assume a specific profession unless required.
- Answers should be suitable for most candidates.
- Focus on skills, achievements, learning, teamwork, communication and career growth.
- For HR questions, generate realistic interview answers.
- Self-introduction answers should include:
  - Name (placeholder if unknown)
  - Education
  - Skills
  - Projects or Experience
  - Career Goals

Length Requirements:

- Question: 1 sentence
- Answer: 100–200 words
- Explanation: 50–100 words
- Real Example: 50–80 words
- Interview Tip: 30–50 words

Return this format:

[
  {
    "question": "",
    "difficulty": "",
    "answer": "",
    "explanation": "",
    "example": "",
    "tip": ""
  }
]

`

     const response =
  await api.post(
    "/ai/ask",
    { prompt }
  )
      try {

  const parsed =
    JSON.parse(
      response.data.reply
    )

  setTopicQuestions(parsed)

} catch {

  console.error(
    "Invalid JSON:",
    response.data.reply
  )

  alert(
    "AI returned invalid format."
  )

}

    } catch (error) {

      console.error(error)

      alert(
        "Failed to generate questions"
      )

    } finally {

      setLoadingQuestions(false)

    }

}
const startListening =
  (index) => {

    const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition

if (!SpeechRecognition) {

  alert(
    "Voice interviews are supported in Chrome and Edge."
  )

  return

}

    const recognition =
      new SpeechRecognition()

    recognition.lang =
      "en-US"

    recognition.continuous =
      false

    recognition.interimResults =
      false

    setIsListening(true)

    recognition.start()

    recognition.onresult =
      (event) => {

        const transcript =
          event.results[0][0]
            .transcript

        const updated = [
          ...answers,
        ]

        updated[index] =
          transcript

        setAnswers(updated)

if (
  questions[index + 1]
) {

  setTimeout(() => {

    speakQuestion(
      questions[index + 1]
    )

  }, 1000)

}

      }

    recognition.onend =
      () => {

        setIsListening(
          false
        )

      }

  }

  const evaluateInterview =
    async () => {
const filledAnswers =
  answers.filter(
    (answer) =>
      typeof answer === "string" &&
      answer.trim() !== ""
  )
  console.log("Answers:", answers)
console.log(
  "Filled Answers:",
  filledAnswers.length
)

if (
  filledAnswers.length < 3
) {

  alert(
    "Please answer at least 3 questions before generating a meaningful interview report."
  )

  return

}

const answeredPairs =
  questions
    .map(
      (
        question,
        index
      ) => ({
        question,
        answer:
          answers[index] || "",
      })
    )
    .filter(
  (item) =>
    item.answer &&
    item.answer.trim() !== ""
)

const formattedInterview =
  answeredPairs
    .map(
      (
        item,
        index
      ) =>

`Question ${index + 1}:

${item.question}

Answer:

${item.answer}
`
    )
    .join("\n")

const completionPercentage =
  Math.round(
    (
      filledAnswers.length /
      questions.length
    ) * 100
  )

      try {

        setEvaluating(true)

        const token =
          localStorage.getItem(
            "careerforge_token"
          )

        const prompt = `
You are an expert technical interviewer.

Role: ${
  role === "Other..."
    ? customRole
    : role
}
Difficulty: ${difficulty}

Interview Completion:
${completionPercentage}%

Answered Questions:

${formattedInterview}

Analyze the candidate and provide:

Overall Score: X/100

Communication Score: X/100

Technical Score: X/100

Confidence Score: X/100

Strengths:
- Point 1
- Point 2
- Point 3

Weaknesses:
- Point 1
- Point 2
- Point 3

Improvement Suggestions:
- Suggestion 1
- Suggestion 2
- Suggestion 3
`

        const response =
  await api.post(
    "/ai/ask",
    { prompt }
  )

        setFeedback(
          response.data.reply
        )
        const report =
  response.data.reply
  setActiveTab("report")

const overall =
  report.match(
    /Overall Score:\s*(\d+)/
  )

const communication =
  report.match(
    /Communication Score:\s*(\d+)/
  )

const technical =
  report.match(
    /Technical Score:\s*(\d+)/
  )

const confidence =
  report.match(
    /Confidence Score:\s*(\d+)/
  )

setScores({
  overall:
    overall
      ? Number(overall[1])
      : 0,

  communication:
    communication
      ? Number(communication[1])
      : 0,

  technical:
    technical
      ? Number(technical[1])
      : 0,

  confidence:
    confidence
      ? Number(confidence[1])
      : 0,
})

setActiveTab("report")

      } catch (error) {

        console.error(error)

        alert(
          "Failed to evaluate interview"
        )

      } finally {

        setEvaluating(false)

      }

    }
  
  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-black text-slate-950">

          AI Interview Prep 🎤

        </h1>

        <p className="mt-2 text-slate-500">

          Practice interviews, improve answers,
          and receive AI-powered feedback.

        </p>

      </div>

      <div className="flex flex-wrap gap-3">

        {[
          {
            key: "mock",
            label: "🎤 Mock Interview",
          },

          {
            key: "questions",
            label: "📚 Question Bank",
          },

         {
            key: "tips",
            label: "🚀 Interview Success Hub",
         },
         
          {
            key: "report",
            label: "📊 Report",
          },

          {
            key: "recommended",
            label: "⭐ Recommended",
          },

        ].map((tab) => (

          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(tab.key)
            }
            className={`rounded-xl px-4 py-2 font-semibold transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>



      {activeTab === "mock" && (

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

          {/* Setup Panel */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold">
              Interview Setup
            </h2>
          
            <div className="mt-6">

              <label className="text-sm font-semibold">
                Target Role
              </label>
            <div className="mt-5">

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={voiceMode}
      onChange={(e) =>
        setVoiceMode(
          e.target.checked
        )
      }
    />

    <span className="font-semibold">

      🎤 Voice Interview Mode

    </span>

  </label>

</div>
{voiceMode && (

  <div className="mt-3 rounded-lg bg-green-50 p-3">

    <p className="text-sm text-green-700">

      🎙 Voice Interview Active

    </p>

  </div>

)}
              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              >

                <optgroup label="AI & Data">
  <option>AI Engineer</option>
  <option>Machine Learning Engineer</option>
  <option>Data Scientist</option>
  <option>Data Analyst</option>
</optgroup>

<optgroup label="Software Development">
  <option>Software Engineer</option>
  <option>Frontend Developer</option>
  <option>Backend Developer</option>
  <option>Full Stack Developer</option>
</optgroup>

<optgroup label="Cloud & DevOps">
  <option>Cloud Engineer</option>
  <option>DevOps Engineer</option>
  <option>AWS Engineer</option>
</optgroup>

<optgroup label="Security">
  <option>Cyber Security Analyst</option>
  <option>Network Engineer</option>
</optgroup>

<optgroup label="Testing">
  <option>QA Engineer</option>
  <option>Automation Test Engineer</option>
</optgroup>
<optgroup label="Professional Skills">

  <option>HR Interview</option>

  <option>Communication Skills</option>

  <option>Group Discussion</option>

</optgroup>
<option>Other...</option>

              </select>
              {role === "Other..." && (

  <input
    type="text"
    placeholder="Enter role..."
    value={customRole}
    onChange={(e) =>
      setCustomRole(e.target.value)
    }
    className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3"
  />

)}

            </div>

            <div className="mt-5">

              <label className="text-sm font-semibold">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              >

                <option>
                  Beginner
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>

              </select>

            </div>

            <button
              onClick={
                generateQuestions
              }
              disabled={
                isLoading
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg"
            >

              {isLoading ? (

                <>

                  <FiLoader className="animate-spin" />

                  Generating...

                </>

              ) : (

                <>

                  <FiCpu />

                  Generate Questions

                </>

              )}

            </button>

          </div>

          {/* Questions Panel */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <FiMessageSquare className="h-6 w-6 text-blue-600" />

              <h2 className="text-2xl font-bold">
                Interview Questions
              </h2>

            </div>
            {questions.length > 0 && (

  <div className="mt-4">

    <div className="flex justify-between text-sm text-slate-500">

      <span>Progress</span>

      <span>
        {answeredCount} / {questions.length}
      </span>

    </div>

    <div className="mt-2 h-3 rounded-full bg-slate-200">

      <div
        className="h-3 rounded-full bg-blue-600 transition-all"
        style={{
          width: `${(answeredCount / questions.length) * 100}%`,
        }}
      />

    </div>

    <div className="mt-3">

      {answeredCount < 3 && (

        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">

          Need {3 - answeredCount} more answers for evaluation

        </span>

      )}

      {answeredCount >= 3 &&
       answeredCount < questions.length && (

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

          Ready for Partial Evaluation

        </span>

      )}

      {answeredCount === questions.length && (

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

          Interview Complete 🎉

        </span>

      )}

    </div>

  </div>

)}

            {questions.length > 0 ? (

              <>

                <div className="mt-6 space-y-4">

                  {questions.map(
                    (
                      question,
                      index
                    ) => (

                      <div
                        key={index}
                        className="rounded-2xl bg-slate-50 p-5"
                      >

                        <p className="font-semibold text-slate-900">

                          {question}

                        </p>
                        <div className="mt-3 flex gap-3">

  <button
    type="button"
    onClick={() =>
      speakQuestion(
        question
      )
    }
    className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700"
  >

    🔊 Read Question

  </button>

  <button
    type="button"
    onClick={() =>
      startListening(
        index
      )
    }
    className="rounded-lg bg-green-100 px-3 py-2 text-green-700"
  >

    {isListening
      ? "🎙 Listening..."
      : "🎤 Start Speaking"}

  </button>

</div>

                        <textarea
                          value={
                            answers[index] ||
                            ""
                          }
                          onChange={(
                            e
                          ) => {

                            const updated = [
                              ...answers,
                            ]

                            updated[
                              index
                            ] =
                              e.target.value

                            setAnswers(
                              updated
                            )

                          }}
                          className="mt-4 min-h-[120px] w-full rounded-xl border border-slate-300 p-4"
                          placeholder="Write your answer..."
                        />

                      </div>

                    )
                  )}

                </div>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">

  <div className="grid grid-cols-3 gap-4 text-center">

    <div>

      <p className="text-xs text-slate-500">
        Answered
      </p>

      <p className="text-xl font-bold text-green-600">
        {answeredCount}
      </p>

    </div>

    <div>

      <p className="text-xs text-slate-500">
        Remaining
      </p>

      <p className="text-xl font-bold text-orange-600">
        {questions.length - answeredCount}
      </p>

    </div>

    <div>

      <p className="text-xs text-slate-500">
        Completion
      </p>

      <p className="text-xl font-bold text-blue-600">
        {Math.round(
          (answeredCount /
            questions.length) *
          100
        )}%
      </p>

    </div>

  </div>

</div>
                <button
                  onClick={
                    evaluateInterview
                  }
                  disabled={
                    evaluating
                  }
                  className="mt-8 w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg"
                >

                  {evaluating
                    ? "Evaluating..."
                    : "Evaluate My Interview"}

                </button>

              </>

            ) : (

              <div className="mt-16 text-center">

                <FiCpu className="mx-auto h-14 w-14 text-slate-300" />

                <p className="mt-4 text-slate-500">

                  Generate AI interview questions to start practicing.

                </p>

              </div>

            )}

          </div>

        </div>

      )}

      

     {/* Question Bank */}

{/* Question Bank */}

{/* Question Bank */}

{activeTab === "questions" && (

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <h2 className="text-3xl font-bold">
    📚 Professional Question Bank
  </h2>

  <p className="mt-2 text-slate-500">
    Learn interview concepts with detailed answers,
    explanations, examples and interview tips.
  </p>

  {/* Statistics */}

  <div className="mt-8 grid gap-4 md:grid-cols-4">

    <div className="rounded-xl bg-blue-50 p-5">

      <h3 className="text-2xl font-black text-blue-600">
        500+
      </h3>

      <p className="text-sm text-slate-600">
        Questions
      </p>

    </div>

    <div className="rounded-xl bg-green-50 p-5">

      <h3 className="text-2xl font-black text-green-600">
        15+
      </h3>

      <p className="text-sm text-slate-600">
        Companies
      </p>

    </div>

    <div className="rounded-xl bg-violet-50 p-5">

      <h3 className="text-2xl font-black text-violet-600">
        10+
      </h3>

      <p className="text-sm text-slate-600">
        Domains
      </p>

    </div>

    <div className="rounded-xl bg-orange-50 p-5">

      <h3 className="text-2xl font-black text-orange-600">
        AI
      </h3>

      <p className="text-sm text-slate-600">
        Powered Learning
      </p>

    </div>

  </div>

  {/* Search */}

  <div className="mt-8">

    <input
      type="text"
      placeholder="🔍 Search Category..."
      value={searchTerm}
      onChange={(e)=>
        setSearchTerm(
          e.target.value
        )
      }
      className="w-full rounded-xl border border-slate-300 p-3"
    />

  </div>

  {/* Category View */}

  {!selectedCategory && (

  <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    <div
  onClick={() => {
   const role = prompt(
  "Enter Role (Java Developer, Spring Boot Developer, ServiceNow Developer, React Developer etc)"
)

    if (!role) return

    setSelectedCategory({
      category: role,
      icon: "➕",
      topics: [
  "Technical Questions",
  "Projects",
  "Problem Solving",
  "HR Questions"
]
    })

    setSelectedTopic("General Interview")

    generateTopicQuestions(
      role,
      "General Interview",
      company
    )
  }}
  className="cursor-pointer rounded-2xl border p-6 transition hover:border-blue-500 hover:shadow-lg"
>
  <h3 className="text-xl font-bold">
    ➕ Custom Role
  </h3>

  <p className="mt-3 text-sm text-slate-500">
    Generate questions for any role
  </p>
</div>

    {filteredCategories.map(
      (category) => (

      <div
        key={category.category}
        onClick={() => {

          setSelectedCategory(
            category
          )

          setSelectedTopic(
            null
          )

          setOpenAnswer(
            null
          )

        }}
        className="cursor-pointer rounded-2xl border p-6 transition hover:border-blue-500 hover:shadow-lg"
      >

        <h3 className="text-xl font-bold">

          {category.icon}{" "}
          {category.category}

        </h3>

        <p className="mt-3 text-sm text-slate-500">

          {category.topics.length} Topics

        </p>

      </div>

    ))}

  </div>

  )}

  {/* Topic View */}

  {selectedCategory &&
 !selectedTopic && (
  
<div className="mt-8">

  <button
    onClick={() =>
      setSelectedCategory(null)
    }
    className="rounded-lg bg-slate-100 px-4 py-2"
  >
    ← Back
  </button>

  <h3 className="mt-6 text-2xl font-bold">
  {selectedCategory.icon}{" "}
  {selectedCategory.category}
</h3>

{/* Difficulty */}

<div className="mt-4">

  <label className="text-sm font-semibold">
    Difficulty Level
  </label>

  <select
    value={difficulty}
    onChange={(e) =>
      setDifficulty(
        e.target.value
      )
    }
    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
  >

    <option>Beginner</option>
    <option>Intermediate</option>
    <option>Advanced</option>

  </select>

</div>

{/* Company */}

<div className="mt-4">

  <label className="text-sm font-semibold">
    Company Focus
  </label>

  <select
    value={company}
    onChange={(e) =>
      setCompany(e.target.value)
    }
    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
  >

   <option>All</option>

<optgroup label="Product Companies">
  <option>Google</option>
  <option>Amazon</option>
  <option>Microsoft</option>
  <option>Meta</option>
  <option>Apple</option>
  <option>Netflix</option>
  <option>Oracle</option>
</optgroup>

<optgroup label="Service Companies">
  <option>TCS</option>
  <option>Infosys</option>
  <option>Wipro</option>
  <option>Accenture</option>
  <option>Cognizant</option>
  <option>Capgemini</option>
  <option>HCL</option>
  <option>Tech Mahindra</option>
</optgroup>

  </select>

</div>
  <div className="mt-6 grid gap-4 md:grid-cols-2">

    {selectedCategory.topics.map(
      (topic, index) => (

     <div
  key={index}
  onClick={() => {

    setSelectedTopic(topic)


    generateTopicQuestions(
  selectedCategory.category,
  topic,
  company
)

  }}
  className="cursor-pointer rounded-xl border p-5 hover:bg-blue-50"
>

  <h4 className="font-semibold">
    {topic}
  </h4>

</div>
    ))}

  </div>

</div>

)}
  {/* Question View */}

 {/* AI Generated Questions */}

{selectedTopic && (

<div className="mt-8">

  <button
    onClick={() => {

      setSelectedTopic(null)

      setTopicQuestions([])

    }}
    className="rounded-lg bg-slate-100 px-4 py-2"
  >
    ← Back
  </button>

  <div className="mt-6 flex items-center justify-between">

  <div>

  <h3 className="text-2xl font-bold">
    {selectedTopic}
  </h3>

  <p className="mt-1 text-sm text-blue-600 font-medium">

    {company === "All"
      ? "Industry Standard Questions"
      : `${company} Focused Questions`}

  </p>

</div>

  <button
    onClick={exportPdf}
    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
  >
    📄 Export PDF
  </button>

</div>

  {loadingQuestions ? (

    <div className="mt-6 rounded-xl bg-slate-50 p-6">

      <p className="font-medium">
        Generating AI Questions...
      </p>

    </div>

  ) : (

    <div className="mt-6 space-y-6">

  {topicQuestions.map(
    (item, index) => (

    <div
      key={index}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold">

          {index + 1}. {item.question}

        </h3>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

          {item.difficulty}

        </span>

      </div>

      <div className="mt-5 space-y-4">

        <div>

          <h4 className="font-semibold text-green-700">

            ✅ Answer

          </h4>

          <p className="mt-1 text-sm text-slate-700">

            {item.answer}

          </p>

        </div>

        <div>

          <h4 className="font-semibold text-violet-700">

            📖 Explanation

          </h4>

          <p className="mt-1 text-sm text-slate-700">

            {item.explanation}

          </p>

        </div>

        <div>

          <h4 className="font-semibold text-orange-700">

            🌍 Real Example

          </h4>

          <p className="mt-1 text-sm text-slate-700">

            {item.example}

          </p>

        </div>

        <div>

          <h4 className="font-semibold text-blue-700">

            💡 Interview Tip

          </h4>

          <p className="mt-1 text-sm text-slate-700">

            {item.tip}

          </p>

        </div>

      </div>

    </div>

  ))}

</div>
  )}

</div>

)}

          </div>

      )}
      





      {/* Tips */}

      {activeTab === "tips" && (

<div className="space-y-6">

  {/* Header */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="text-3xl font-black">

      🚀 Interview Success Hub

    </h2>

    <p className="mt-2 text-slate-500">

      Master interviews with proven strategies,
      communication techniques and preparation guides.

    </p>

  </div>

  {/* Preparation Checklist */}

  <div className="rounded-2xl border bg-white p-6">

    <h3 className="text-xl font-bold">

      📋 Interview Preparation Checklist

    </h3>

    <div className="mt-4 grid gap-3 md:grid-cols-2">

      <p>✅ Research the company</p>
      <p>✅ Understand the job description</p>
      <p>✅ Review your resume</p>
      <p>✅ Revise projects</p>
      <p>✅ Prepare self-introduction</p>
      <p>✅ Practice interview questions</p>

    </div>

  </div>

  {/* Communication */}

  <div className="rounded-2xl border bg-white p-6">

    <h3 className="text-xl font-bold">

      🎤 Communication Excellence

    </h3>

    <div className="mt-4 space-y-2">

      <p>• Speak clearly and confidently</p>
      <p>• Listen carefully before answering</p>
      <p>• Structure answers logically</p>
      <p>• Avoid filler words</p>
      <p>• Be concise but detailed</p>

    </div>

  </div>

  {/* STAR Method */}

  <div className="rounded-2xl border bg-white p-6">

    <h3 className="text-xl font-bold">

      ⭐ STAR Method

    </h3>

    <div className="mt-4 space-y-3">

      <p><strong>S</strong> — Situation</p>
      <p><strong>T</strong> — Task</p>
      <p><strong>A</strong> — Action</p>
      <p><strong>R</strong> — Result</p>

    </div>

    <div className="mt-4 rounded-xl bg-slate-50 p-4">

      <p className="font-semibold">

        Example:

      </p>

      <p className="mt-2">

        Situation: Team project deadline approaching.

      </p>

      <p>

        Task: Complete frontend module.

      </p>

      <p>

        Action: Built reusable React components.

      </p>

      <p>

        Result: Delivered project 3 days early.

      </p>

    </div>

  </div>

  {/* Technical Round */}

  <div className="rounded-2xl border bg-white p-6">

    <h3 className="text-xl font-bold">

      💻 Technical Interview Tips

    </h3>

    <div className="mt-4 space-y-2">

      <p>• Explain your thought process</p>
      <p>• Clarify assumptions</p>
      <p>• Discuss trade-offs</p>
      <p>• Use real examples</p>
      <p>• Mention scalability where relevant</p>
      <p>• Stay calm if you don't know the answer</p>

    </div>

  </div>

  {/* HR Round */}

  <div className="rounded-2xl border bg-white p-6">

    <h3 className="text-xl font-bold">

      💼 HR Interview Tips

    </h3>

    <div className="mt-4 space-y-2">

      <p>• Tell me about yourself</p>
      <p>• Why should we hire you?</p>
      <p>• What are your strengths and weaknesses?</p>
      <p>• Where do you see yourself in 5 years?</p>
      <p>• Why do you want this role?</p>

    </div>

  </div>

  {/* Body Language */}

  <div className="rounded-2xl border bg-white p-6">

    <h3 className="text-xl font-bold">

      🧍 Professional Body Language

    </h3>

    <div className="mt-4 grid gap-3 md:grid-cols-2">

      <p>✅ Maintain eye contact</p>
      <p>✅ Sit straight</p>
      <p>✅ Smile naturally</p>
      <p>✅ Use confident gestures</p>

      <p>❌ Avoid crossed arms</p>
      <p>❌ Avoid looking away frequently</p>

    </div>

  </div>

  {/* Virtual Interviews */}

  <div className="rounded-2xl border bg-white p-6">

    <h3 className="text-xl font-bold">

      💻 Virtual Interview Checklist

    </h3>

    <div className="mt-4 grid gap-3 md:grid-cols-2">

      <p>✅ Stable internet connection</p>
      <p>✅ Proper lighting</p>
      <p>✅ Clear microphone</p>
      <p>✅ Professional background</p>
      <p>✅ Camera at eye level</p>
      <p>✅ No distractions</p>

    </div>

  </div>

  {/* Final Checklist */}

  <div className="rounded-2xl border bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">

    <h3 className="text-xl font-bold">

      🎯 Interview Day Checklist

    </h3>

    <div className="mt-4 grid gap-3 md:grid-cols-2">

      <p>□ Resume Ready</p>
      <p>□ Portfolio Ready</p>
      <p>□ LinkedIn Updated</p>
      <p>□ Company Research Done</p>
      <p>□ Self Introduction Practiced</p>
      <p>□ Positive Mindset</p>

    </div>

  </div>

</div>

)}

      {/* Report */}

      {activeTab === "report" && (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold">
            📊 Performance Report
          </h2>

          {feedback ? (

  <>

    {/* Score Cards */}

    <div className="mb-6 grid gap-4 md:grid-cols-4">

      <div className="rounded-2xl bg-blue-50 p-5 text-center">

        <p className="text-sm text-slate-500">
          Overall
        </p>

        <h3 className="mt-2 text-3xl font-black text-blue-600">
          {scores.overall}
        </h3>

      </div>

      <div className="rounded-2xl bg-green-50 p-5 text-center">

        <p className="text-sm text-slate-500">
          Communication
        </p>

        <h3 className="mt-2 text-3xl font-black text-green-600">
          {scores.communication}
        </h3>

      </div>

      <div className="rounded-2xl bg-violet-50 p-5 text-center">

        <p className="text-sm text-slate-500">
          Technical
        </p>

        <h3 className="mt-2 text-3xl font-black text-violet-600">
          {scores.technical}
        </h3>

      </div>

      <div className="rounded-2xl bg-orange-50 p-5 text-center">

        <p className="text-sm text-slate-500">
          Confidence
        </p>

        <h3 className="mt-2 text-3xl font-black text-orange-600">
          {scores.confidence}
        </h3>

      </div>

    </div>

    {/* CareerForge Insight */}

    <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white">

      <h3 className="font-bold">
        🚀 CareerForge Insight
      </h3>

      <p className="mt-2 text-sm">

        {scores.technical >
        scores.communication
          ? "Your technical knowledge is stronger than your communication skills. Improving communication can significantly increase your interview success."
          : "You communicate well. Focus on strengthening technical depth to maximize interview performance."}

      </p>

    </div>

    {/* Original AI Feedback */}

    <div className="rounded-xl bg-slate-50 p-5">

      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">

        {feedback}

      </div>

    </div>

  </>

) : (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                Complete a mock interview first.
              </p>

            </div>

          )}

        </div>

      )}

      {/* Recommended */}

      {activeTab === "recommended" && (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-3xl font-bold">
  🚀 Quick Preparation Hub
</h2>

<p className="mt-2 text-slate-500">
  Quick access to the most important interview preparation resources.
</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div
  onClick={() => {
    setSelectedCategory(
      questionBankData.find(
        item =>
          item.category === "HR Interview"
      )
    )
    setActiveTab("questions")
  }}
  className="cursor-pointer rounded-xl bg-slate-50 p-5 hover:bg-blue-50"
>
  <h3 className="font-bold">
    💼 HR Interview Essentials
  </h3>
  <p className="mt-2 text-sm text-slate-600">
    Self introduction, strengths,
    weaknesses and career goals.
  </p>
</div>

<div
  onClick={() => {
    setSelectedCategory(
      questionBankData.find(
        item =>
          item.category === "HR Interview"
      )
    )
    setActiveTab("questions")
  }}
  className="cursor-pointer rounded-xl bg-slate-50 p-5 hover:bg-green-50"
>
  <h3 className="font-bold">
    🗣 Communication Skills
  </h3>
  <p className="mt-2 text-sm text-slate-600">
    Improve confidence,
    presentations and workplace communication.
  </p>
</div>

<div
  onClick={() => {
    setSelectedCategory(
      questionBankData.find(
        item =>
          item.category === "HR Interview"
      )
    )
    setActiveTab("questions")
  }}
  className="cursor-pointer rounded-xl bg-slate-50 p-5 hover:bg-orange-50"
>
  <h3 className="font-bold">
    👥 Group Discussion Practice
  </h3>
  <p className="mt-2 text-sm text-slate-600">
    Practice trending GD topics
    and placement discussions.
  </p>
</div>

<div
  onClick={() => {
    setActiveTab("mock")
    setRole("Software Engineer")
  }}
  className="cursor-pointer rounded-xl bg-slate-50 p-5 hover:bg-violet-50"
>
  <h3 className="font-bold">
    🎤 Mock Interview Challenge
  </h3>
  <p className="mt-2 text-sm text-slate-600">
    Start a role-based mock interview
    and receive AI feedback.
  </p>
</div>

<div
  onClick={() => {
    setActiveTab("tips")
  }}
  className="cursor-pointer rounded-xl bg-slate-50 p-5 hover:bg-cyan-50"
>
  <h3 className="font-bold">
    ✅ Interview Day Checklist
  </h3>
  <p className="mt-2 text-sm text-slate-600">
    Final preparation guide before
    attending interviews.
  </p>
</div>

<div
  onClick={() => {
    setActiveTab("report")
  }}
  className="cursor-pointer rounded-xl bg-slate-50 p-5 hover:bg-pink-50"
>
  <h3 className="font-bold">
    📊 Performance Insights
  </h3>
  <p className="mt-2 text-sm text-slate-600">
    Review scores, strengths,
    weaknesses and recommendations.
  </p>
</div>

          </div>

        </div>

      )}

    </div>

  )

}

export default InterviewPrepPage

          

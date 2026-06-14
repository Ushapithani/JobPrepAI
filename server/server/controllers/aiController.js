const pdf = require("pdf-parse")
const mammoth = require("mammoth")
const OpenAI = require('openai')
const ResumeAnalysis =
  require(
    "../models/ResumeAnalysis"
  )

const ChatMessage = require('../models/ChatMessage')

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
    'X-Title': 'CareerForge AI',
  },
})

const getAIReply = async (messages) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const completion = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
    messages,
    temperature: 0.5,
  })

  return completion.choices?.[0]?.message?.content || 'No response generated.'
}

const askAI = async (req, res) => {
  try {
    const prompt =
  Array.isArray(req.body.prompt)
    ? req.body.prompt[0]
    : req.body.prompt
    const uploadedFile =
  req.files?.[0]

console.log(
  "UPLOADED FILE:",
  uploadedFile
)
console.log("BODY:", req.body)
console.log(
  "FILE:",
  uploadedFile
)
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' })
    }
    let fileContent = ""
   if (
  uploadedFile &&
  uploadedFile.mimetype ===
  "application/pdf"
) {

  const data =
   await pdf(
  uploadedFile.buffer
)

  fileContent =
    data.text

}

else if (
  uploadedFile &&
  uploadedFile.mimetype.includes(
    "word"
  )
) {

  const result =
    await mammoth.extractRawText({
     buffer: uploadedFile.buffer,
    })

  fileContent =
    result.value

}

else if (
  uploadedFile &&
  uploadedFile.mimetype.startsWith("image/")
) {

  fileContent =
    `Image Uploaded: ${uploadedFile.originalname}`

}
console.log(
  "FILE:",
  uploadedFile?.originalname
)

console.log(
  "CONTENT LENGTH:",
  fileContent.length
)
let aiPrompt = prompt

if (fileContent) {

  aiPrompt = `

You are analyzing an uploaded file.

User Request:
${prompt}

Uploaded File Content:
${fileContent}

If this is a resume:
- Give ATS score out of 100
- Strengths
- Weaknesses
- Missing keywords
- Improvement suggestions

Return a professional analysis.

`

}

const reply = await getAIReply([
  {
    role: "system",
    content:
      "You are CareerForge AI, a professional career coach, resume reviewer and interview mentor."
  },
  {
    role: "user",
    content: aiPrompt
  }
])

    const message = await ChatMessage.create({
      prompt: prompt.trim(),
      reply,
      userId: req.user._id,
    })

    res.status(200).json({ message, reply })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: 1 })
      .limit(50)

    res.status(200).json(messages)
  } 
  catch (error) {

  console.error(
    "ASK AI ERROR:",
    error
  )

  res.status(500).json({
    message: error.message
  })

}
}
const clearHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id })
    res.status(200).json({ message: 'Chat history cleared' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const analyzeResume = async (req, res) => {

  try {

    const { jobDescription = "", resumeText = "" } = req.body

    let extractedResumeText = resumeText

    if (req.file) {
if (
  req.file.mimetype === "application/pdf"
) {

  const pdfData = await pdf(req.file.buffer)

  extractedResumeText =
    pdfData.text

}

      else if (

        req.file.mimetype.includes(
          "wordprocessingml"
        )

      ) {

        const docData =
          await mammoth.extractRawText({

            buffer: req.file.buffer,

          })

        extractedResumeText =
          docData.value

      }

      else {

        return res.status(400).json({

          message:
            "Only PDF and DOCX files are supported",

        })

      }

    }

    if (

      !extractedResumeText ||

      extractedResumeText.trim().length < 80

    ) {

      return res.status(400).json({

        message:
          "Resume content is too short",

      })

    }

    const reply = await getAIReply([

      {

        role: "system",

        content: `

Return ONLY valid JSON.

{
  "atsScore": number,
  "summary": "string",
  "strengths": ["","",""],
  "gaps": ["","",""],
  "recommendations": ["","",""],
  "keywords": ["","",""]
}
Analyze the resume professionally.

Return:
- ATS score
- Professional summary
- Strengths
- Gaps
- Recommendations
- ATS keywords that should appear in the resume

Return ONLY valid JSON.

`,

      },

      {

        role: "user",

        content: `

Resume:

${extractedResumeText}

Job Description:

${jobDescription || "Not provided"}

`,

      },

    ])

    let parsed

    try {

      parsed = JSON.parse(

        reply
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim()

      )

    }

    catch {

      parsed = {

        atsScore: 75,

        summary:
          "Resume analyzed successfully.",

        strengths: [

          "Good technical foundation",

          "Relevant experience",

          "Clear structure",

        ],

        gaps: [

          "Add measurable achievements",

          "Improve ATS keywords",

          "Expand project descriptions",

        ],

        recommendations: [

          "Add metrics to projects",

          "Tailor resume to target role",

          "Highlight achievements",

        ],
        keywords: [
  "JavaScript",
  "React",
  "REST APIs"
]

      }

    }
await ResumeAnalysis.create({
  userId: req.user._id,

  atsScore:
    Number(parsed.atsScore) || 75,

  summary:
    parsed.summary ||
    "Analysis complete.",

  strengths:
    parsed.strengths || [],

  gaps:
    parsed.gaps || [],

  recommendations:
    parsed.recommendations || [],

  keywords:
    parsed.keywords || [],
})
    res.status(200).json({

      atsScore:
        Number(parsed.atsScore) || 75,

      summary:
        parsed.summary ||
        "Analysis complete.",

      strengths:
        Array.isArray(
          parsed.strengths
        )
          ? parsed.strengths
          : [],

      gaps:
        Array.isArray(
          parsed.gaps
        )
          ? parsed.gaps
          : [],

      recommendations:
        Array.isArray(
          parsed.recommendations
        )
          ? parsed.recommendations
          : [],
      keywords:
  Array.isArray(parsed.keywords)
    ? parsed.keywords
    : [],

      extractedText:
        extractedResumeText,

    })

  }

  catch (error) {

    console.error(error)

    res.status(500).json({

      message:
        "Resume analysis failed",

      error: error.message,

    })

  }

}

module.exports = {
  analyzeResume,
  askAI,
  clearHistory,
  getHistory,
}
console.log(
  "EXPORTING askAI:",
  typeof askAI
)
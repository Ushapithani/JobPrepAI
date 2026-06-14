import { useState } from "react"
import api from "../../services/api"
import { saveAs } from "file-saver"
function CoverLetterGenerator() {
    

  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [resumeSummary, setResumeSummary] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)

  
  const generateCoverLetter = async () => {

    
    if (
      !jobTitle.trim() ||
      !company.trim() ||
      !resumeSummary.trim() ||
      !jobDescription.trim()
    ) {
      alert("Please fill all fields")
      return
    }

    try {

      setLoading(true)



const profile =
  JSON.parse(
    localStorage.getItem(
      "careerforgeProfile"
    ) || "{}"
  )


      const prompt = `
You are a professional cover letter writer.

RULES:

1. Use ONLY information provided.

2. Never invent:
- Degrees
- Companies
- Certifications
- Achievements
- Work Experience
- Addresses

3. If information is missing,
do not create fake details.


IMPORTANT RULES:

1. Use ONLY the information provided below.

2. NEVER invent:
- Degrees
- Certifications
- Companies
- Work Experience
- Achievements
- Addresses

3. NEVER output:
[Your Name]
[Your Address]
[Your Email]
[Your Phone]
[Date]
[Today's Date]
[Company Address]

4. If a value is missing, omit it completely.

5. Use the following header exactly:

${profile.fullName || ""}
${profile.email || ""}
${profile.phone || ""}
${profile.location || ""}

Company Name:
${company}

You MUST mention the company name above.
Do not replace it with:
"your company"
"your organization"

6. Generate a professional ATS-friendly cover letter.

7. You MUST mention at least:

- One project from Resume Summary
- One internship from Resume Summary
- Two technical skills from Resume Summary

Do not generate a cover letter without referencing them.

8. Avoid generic phrases such as:

- strong background
- commitment to excellence
- adaptable professional
- valuable asset
- passionate individual
- dynamic professional

Use concrete skills, projects and internships instead.

9. Make the letter personalized to the target role and company.
Applicant Information:

Name:
${profile.fullName || ""}

Email:
${profile.email || ""}

Phone:
${profile.phone || ""}

Location:
${profile.location || ""}

Target Role:
${jobTitle}

Resume Summary:
${resumeSummary}

Job Description:
${jobDescription}

Current Date:
${new Date().toLocaleDateString()}

Use the Current Date above.
Do not output [Date] or [Today's Date].

Return ONLY the final cover letter.

`

      const response = await api.post(
  "/ai/ask",
  { prompt }
)
      console.log(response.data)

      setCoverLetter(
        response.data.reply ||
        JSON.stringify(response.data, null, 2)
      )

    } catch (error) {

      console.error(error)

      alert(
        error?.response?.data?.message ||
        error.message ||
        "Failed to generate cover letter"
      )

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl bg-white p-6 shadow">

        <input
          className="mb-4 w-full rounded-xl border p-3"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) =>
            setJobTitle(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded-xl border p-3"
          placeholder="Company Name"
          value={company}
          onChange={(e) =>
            setCompany(e.target.value)
          }
        />

        <textarea
          className="mb-4 h-40 w-full rounded-xl border p-3"
          placeholder="Resume Summary"
          value={resumeSummary}
          onChange={(e) =>
            setResumeSummary(e.target.value)
          }
        />

        <textarea
          className="mb-4 h-40 w-full rounded-xl border p-3"
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(e.target.value)
          }
        />
<button
  onClick={generateCoverLetter}
  disabled={loading}
  className="rounded-xl bg-blue-600 px-6 py-3 text-white"
>
          {loading
            ? "Generating..."
            : "Generate Cover Letter"}
        </button>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="mb-4 text-2xl font-bold">
          Generated Cover Letter
        </h2>


{coverLetter && (

  <div className="mb-4 flex gap-3">

    <button
      onClick={() => {

        navigator.clipboard.writeText(
          coverLetter
        )

        alert("Copied!")

      }}
      className="rounded-xl bg-slate-900 px-4 py-2 text-white"
    >
      📋 Copy
    </button>

    <button
      onClick={() => {

        const blob = new Blob(
          [coverLetter],
          {
            type:
              "text/plain;charset=utf-8",
          }
        )

        saveAs(
  blob,
  `${company}-Cover-Letter.txt`
)

      }}
      className="rounded-xl bg-green-600 px-4 py-2 text-white"
    >
      📥 Download
    </button>

  </div>

)}
        <div className="whitespace-pre-wrap leading-7 text-slate-700">
          {coverLetter ||
            "Generate a cover letter to see the result."}
        </div>

      </div>

    </div>
  )
}

export default CoverLetterGenerator
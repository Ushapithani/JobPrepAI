import CoverLetterGenerator from "../components/coverletter/CoverLetterGenerator"
function CoverLetterPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-black text-slate-950">
          AI Cover Letter Generator 📄
        </h1>

        <p className="mt-2 text-slate-500">
          Create professional, ATS-friendly cover letters
          tailored to specific job roles and companies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow">
          <h3 className="font-bold text-blue-600">
            🎯 Personalized
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Generate cover letters based on your
            skills, experience, and target role.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h3 className="font-bold text-green-600">
            🚀 ATS Optimized
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Improve application success with
            recruiter-friendly formatting.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h3 className="font-bold text-violet-600">
            ⚡ AI Powered
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Generate professional content in
            seconds using AI.
          </p>
        </div>

      </div>

      <CoverLetterGenerator />

    </div>
  )
}

export default CoverLetterPage
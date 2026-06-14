
import PageHeader from "../components/ui/PageHeader"
import ResumeAnalyzer from "../components/resume/ResumeAnalyzer"

function ResumeAnalyzerPage() {
  return (
    <>
      <PageHeader
        description="Paste your resume and an optional target job description to get ATS scoring, gaps, and stronger rewrite suggestions."
        eyebrow="Resume intelligence"
        title="Resume Analyzer"
      />
      <ResumeAnalyzer />
    </>
  )
}

export default ResumeAnalyzerPage

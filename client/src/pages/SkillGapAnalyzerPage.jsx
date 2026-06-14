import SkillGapAnalyzer from "../components/skillgap/SkillGapAnalyzer"

function SkillGapAnalyzerPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-black text-slate-950">
          🎯 Job Match Analyzer
        </h1>

        <p className="mt-2 text-slate-500">
  Upload your resume and compare it with a job description
  to discover your match percentage, missing skills,
  and learning recommendations.
</p>
      </div>

      <SkillGapAnalyzer />

    </div>
  )
}

export default SkillGapAnalyzerPage

import PageHeader from "../components/ui/PageHeader"
import JobTracker from "../components/jobs/JobTracker"
function JobTrackerPage() {
  return (
    <>
      <PageHeader
        description="Track companies, roles, status changes, follow-ups, interviews, and outcomes in one place."
        eyebrow="Pipeline"
        title="Job Tracker"
      />
      <JobTracker />
    </>
  )
}

export default JobTrackerPage

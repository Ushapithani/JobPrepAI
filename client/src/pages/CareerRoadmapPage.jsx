import PageHeader from "../components/ui/PageHeader"
import CareerRoadmap from "../components/roadmap/CareerRoadmap"

function CareerRoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Career Planning"
        title="Career Roadmap Generator"
        description="Generate a personalized AI career roadmap based on your current skills and target role."
      />
      <CareerRoadmap />
    </>
  )
}

export default CareerRoadmapPage
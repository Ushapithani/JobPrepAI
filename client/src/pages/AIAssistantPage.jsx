
import PageHeader from "../components/ui/PageHeader"
import AIAssistant from "../components/ai/AIAssistant"

function AIAssistantPage() {
  return (
    <>
      <PageHeader
        description="Ask for resume bullets, interview practice, job search strategy, offer negotiation, or role-specific learning paths."
        eyebrow="AI workspace"
        title="AI Assistant"
      />
      <AIAssistant />
    </>
  )
}

export default AIAssistantPage

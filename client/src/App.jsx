import { Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute from './components/common/ProtectedRoute'
import CareerRoadmapPage from "./pages/CareerRoadmapPage"
import SkillGapAnalyzerPage from "./pages/SkillGapAnalyzerPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import MainLayout from "./layouts/MainLayout"
import AIAssistantPage from "./pages/AIAssistantPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import Dashboard from "./pages/Dashboard"
import InterviewPrepPage from "./pages/InterviewPrepPage"
import JobTrackerPage from "./pages/JobTrackerPage"
import Login from "./pages/Login"
import ResumeAnalyzerPage from "./pages/ResumeAnalyzerPage"
import Signup from "./pages/Signup"
import CoverLetterPage from "./pages/CoverLetterPage"
import ForgotPassword from "./pages/ForgotPassword"
import ResumeHistoryPage from "./pages/ResumeHistoryPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/job-tracker" element={<JobTrackerPage />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
          <Route path="/resume-history"element={<ResumeHistoryPage />}/>
          <Route path="/interview-prep" element={<InterviewPrepPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile"element={<ProfilePage />}/>
          <Route path="/settings"element={<SettingsPage />}/>
          <Route path="/career-roadmap"element={<CareerRoadmapPage />}/>
          <Route path="/cover-letter"element={<CoverLetterPage />}/>
          <Route path="/skill-gap" element={<SkillGapAnalyzerPage />}/>
          
          
          
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App

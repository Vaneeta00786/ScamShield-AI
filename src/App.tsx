import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Toast } from './components/ui/Toast';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import CompanyVerifyPage from './pages/CompanyVerifyPage';
import ScamIntelligencePage from './pages/ScamIntelligencePage';
import SafetyCenterPage from './pages/SafetyCenterPage';
import ReportPage from './pages/ReportPage';
import ScamSimulatorPage from './pages/ScamSimulatorPage';
import QuizPage from './pages/QuizPage';
import LossCalculatorPage from './pages/LossCalculatorPage';
import StoryPage from './pages/StoryPage';
import ScamDnaPage from './pages/ScamDnaPage';
import LinkInspectorPage from './pages/LinkInspectorPage';
import EvidenceLockerPage from './pages/EvidenceLockerPage';
import ScamRadarPage from './pages/ScamRadarPage';
import AiCoachPage from './pages/AiCoachPage';

export default function App() {
  return (
    <ToastProvider>
      <Toast />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/verify" element={<CompanyVerifyPage />} />
        <Route path="/intelligence" element={<ScamIntelligencePage />} />
        <Route path="/safety" element={<SafetyCenterPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/simulator" element={<ScamSimulatorPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/calculator" element={<LossCalculatorPage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/dna" element={<ScamDnaPage />} />
        <Route path="/links" element={<LinkInspectorPage />} />
        <Route path="/evidence" element={<EvidenceLockerPage />} />
        <Route path="/radar" element={<ScamRadarPage />} />
        <Route path="/coach" element={<AiCoachPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}

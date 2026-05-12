import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import ChatHistory from "./pages/ChatHistory"
import GovtSchemes from "./pages/GovtSchemes"
import MandiBhav from "./pages/MandiBhav"
import Login from "./pages/Login"
import AIAnalytics from "./pages/AIAnalytics"
import Notifications from "./pages/Notifications"
import Sellers from "./pages/Sellers"
import DiseaseAnalysis from "./pages/DiseaseAnalysis"
import AIConfig from "./pages/AIConfig"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="chat-history" element={<ChatHistory />} />
            <Route path="govt-schemes" element={<GovtSchemes />} />
            <Route path="mandi-bhav" element={<MandiBhav />} />
            <Route path="analytics" element={<AIAnalytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="disease-analysis" element={<DiseaseAnalysis />} />
            <Route path="ai-config" element={<AIConfig />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

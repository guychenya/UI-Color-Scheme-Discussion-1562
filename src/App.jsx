import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProblemsPage from './pages/ProblemsPage';
import GoalsPage from './pages/GoalsPage';
import MissionPage from './pages/MissionPage';
import ChallengesPage from './pages/ChallengesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatbotAssistant from './components/ChatbotAssistant';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <Navbar />
          <ProtectedRoute>
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-20"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/mission" element={<MissionPage />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Routes>
            </motion.main>
            
            {/* Chatbot Assistant */}
            <ChatbotAssistant />
          </ProtectedRoute>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
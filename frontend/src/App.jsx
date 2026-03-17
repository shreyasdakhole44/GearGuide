import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AssistantPage from './pages/AssistantPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
      <div className="min-h-screen bg-[#F8FAFC] selection:bg-blue-500/30">
        {/* Sidebar removed as per user request for a single-page interface */}
        <main className="w-full min-h-screen">
          {children}
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage setAuth={setIsAuthenticated} />} />

        {/* 
            Single-Page AI Interface: 
            The AssistantPage is now the primary dashboard.
        */}
        <Route path="/dashboard" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
        <Route path="/assistant" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch-all to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

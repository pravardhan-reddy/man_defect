import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import DefectAnalytics from './pages/DefectAnalytics';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
import Predictor from './pages/Predictor';
import CapaManager from './pages/CapaManager';
import BeforeAfter from './pages/BeforeAfter';
import Reports from './pages/Reports';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prefilledCapaData, setPrefilledCapaData] = useState(null);

  // Initialize from localStorage if present
  useEffect(() => {
    const savedUser = localStorage.getItem('defectiq_user');
    const savedToken = localStorage.getItem('defectiq_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('defectiq_user', JSON.stringify(userData));
    localStorage.setItem('defectiq_token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('defectiq_user');
    localStorage.removeItem('defectiq_token');
  };

  const handleCreateCapaFromPrediction = (capaPayload) => {
    setPrefilledCapaData(capaPayload);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar user={user} onLogout={handleLogout} activeTab={activeTab} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-16">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'upload' && <DataUpload setActiveTab={setActiveTab} />}
          {activeTab === 'analytics' && <DefectAnalytics />}
          {activeTab === 'root-cause' && <RootCauseAnalysis setActiveTab={setActiveTab} />}
          {activeTab === 'predict' && (
            <Predictor
              setActiveTab={setActiveTab}
              onCreateCapaFromPrediction={handleCreateCapaFromPrediction}
            />
          )}
          {activeTab === 'capa' && (
            <CapaManager
              prefilledData={prefilledCapaData}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'before-after' && <BeforeAfter />}
          {activeTab === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

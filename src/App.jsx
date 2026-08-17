import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Zap, Sun, Moon } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Programs from './pages/Programs';
import AICoach from './pages/AICoach';
import Nutrition from './pages/Nutrition';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import BottomNav from './components/BottomNav';

export default function App() {
  const { currentUser } = useAuth();
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // If user is not logged in, show Auth / Onboarding Screen
  if (!currentUser) {
    return (
      <div className="app-container" style={{ paddingBottom: 0 }}>
        <Auth />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Application Header */}
      <header className="app-header">
        <div className="brand-logo">
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--accent-lime)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} fill="#000" color="#000" />
          </div>
          <span>AURA PULSE</span>
          <span className="brand-badge">AI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {currentUser?.avatarUrl && (
            <img
              src={currentUser.avatarUrl}
              alt="Profile"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--accent-lime)'
              }}
            />
          )}
        </div>
      </header>

      {/* Page Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

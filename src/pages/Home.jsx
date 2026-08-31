import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, Dumbbell, Home as HomeIcon, Zap, Play, Calendar, CheckCircle, ArrowRight, Flame, Clock } from 'lucide-react';

export default function Home() {
  const { currentUser, updateProfileData } = useAuth();
  const navigate = useNavigate();

  const userName = currentUser?.displayName || 'Olivia Rose';
  const environment = currentUser?.environment || 'Gym'; // Gym, Home, Hybrid
  const goal = currentUser?.goal || 'Tone & Strength';
  const experience = currentUser?.experience || 'Beginner';

  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic 7-day Weekly Goal calendar calculation based on real-world date
  const getDynamicWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // Calculate Monday of the current week (Sunday is 7th day of week)
    const distToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distToMonday);

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    return dayLabels.map((dayLabel, idx) => {
      const current = new Date(monday);
      current.setDate(monday.getDate() + idx);
      const currentMidnight = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();

      const isToday = currentMidnight === todayMidnight;
      const isPast = currentMidnight < todayMidnight;

      return {
        day: dayLabel,
        date: current.getDate(),
        isToday: isToday,
        completed: isPast || isToday
      };
    });
  };

  const weekDays = getDynamicWeekDays();
  const completedCount = weekDays.filter(w => w.completed).length;

  // Active Dynamic Challenge based on Home vs Gym choice
  const activeChallenge = environment === 'Home' ? {
    title: 'Express Bodyweight Burn',
    subtitle: 'Zero Equipment • Core & Leg Sculpting',
    duration: '25 Days',
    time: '20 Min',
    kcal: '240 kcal',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    badge: 'AI Home Plan'
  } : {
    title: 'Peach Palace & Lower Body',
    subtitle: '4-Week Glute & Leg Power Building',
    duration: '28 Days',
    time: '45 Min',
    kcal: '420 kcal',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    badge: 'AI Gym Recommended'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '20px' }}>
      {/* Top Welcome Bar (Image 1 Header) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--accent-lime)'
          }}>
            <img 
              src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
              alt="User Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Good Evening! 👋</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.1 }}>{userName}</h3>
          </div>
        </div>

        {/* Home vs Gym Venue Toggle Badge */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => updateProfileData({ environment: environment === 'Home' ? 'Gym' : 'Home' })}
            className="badge badge-lime"
            style={{ cursor: 'pointer', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {environment === 'Home' ? <HomeIcon size={14} /> : <Dumbbell size={14} />}
            <span>{environment} Mode</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar (Screenshot 1 Middle) */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-full)',
        padding: '12px 18px',
        border: '1px solid var(--border-subtle)'
      }}>
        <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workouts, plans, meals..."
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            width: '100%'
          }}
        />
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--accent-lime)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={16} color="#000" />
        </div>
      </div>

      {/* Weekly Goal Tracker Strip (Screenshot 1 Middle - Fully Dynamic) */}
      <div className="card" style={{ padding: '16px', marginBottom: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>Weekly Goal</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-lime)' }}>
            {completedCount}/6 Done 🎯
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
          {weekDays.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 4px',
                borderRadius: 'var(--radius-md)',
                background: item.isToday 
                  ? '#ffffff' 
                  : item.completed 
                    ? 'rgba(198, 255, 0, 0.15)' 
                    : 'var(--bg-main)',
                color: item.isToday 
                  ? '#000000' 
                  : item.completed 
                    ? 'var(--accent-lime)' 
                    : 'var(--text-muted)',
                fontWeight: item.isToday || item.completed ? 900 : 600,
                border: item.isToday 
                  ? '2px solid #ffffff' 
                  : item.completed 
                    ? '1px solid rgba(198, 255, 0, 0.3)' 
                    : '1px solid var(--border-subtle)',
                boxShadow: item.isToday ? '0 4px 12px rgba(255, 255, 255, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.68rem', marginBottom: '2px', opacity: item.isToday ? 0.9 : 0.8 }}>{item.day}</div>
              <div style={{ fontSize: '0.95rem' }}>{item.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(198, 255, 0, 0.12), rgba(19, 22, 31, 0.95))',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Sparkles size={24} color="var(--accent-lime)" />
        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          Let today mark the beginning of your incredible transformation!
        </span>
      </div>

      {/* Main Challenge Card (Screenshot 1 & 3) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Challenge Plan</h3>
          <span className="badge badge-lime">{activeChallenge.badge}</span>
        </div>

        <div className="card" style={{
          padding: '0',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ position: 'relative', height: '180px' }}>
            <img 
              src={activeChallenge.image} 
              alt={activeChallenge.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(19, 22, 31, 1) 10%, transparent 80%)'
            }} />
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--accent-lime)'
            }}>
              📍 {environment} Routine
            </div>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '4px' }}>
              {activeChallenge.title} 🔥
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              {activeChallenge.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="var(--accent-lime)" /> {activeChallenge.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={14} color="var(--accent-coral)" /> {activeChallenge.kcal}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="var(--accent-blue)" /> {activeChallenge.duration}
              </span>
            </div>

            <button 
              onClick={() => navigate('/programs')}
              className="btn-primary"
            >
              Start Workout <Play size={18} fill="#000" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick AI Prompt Pills Bar (Screenshot 1 Prompt Launcher) */}
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          ASK YOUR AI COACH QUICK PROMPTS
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {[
            'I feel tired today',
            'Quick 5-min session',
            'Make it harder',
            'Suggest a recovery plan'
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => navigate('/ai-coach')}
              className="prompt-chip"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

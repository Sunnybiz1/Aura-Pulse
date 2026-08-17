import React, { useState, useEffect } from 'react';
import { Timer, X, Plus } from 'lucide-react';

export default function RestTimer({ seconds = 60, onClose }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const addTime = (secs) => {
    setTimeLeft(prev => prev + secs);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="rest-timer-overlay">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Timer style={{ color: 'var(--accent-orange)' }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>REST TIMER</div>
          <div className="timer-countdown">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={() => addTime(30)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <Plus size={14} /> 30s
        </button>

        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

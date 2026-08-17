import React, { useState } from 'react';
import { Sparkles, Calendar, Search, Filter, Flame, Trophy, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { INITIAL_LOGS } from '../data/mockData';
import PremiumGateModal from '../components/PremiumGateModal';

export default function Progress() {
  const { isPremiumActive } = useSubscription();
  const [activeTab, setActiveTab] = useState('total'); // 'total' | 'bench'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SVG Chart Dimensions
  const chartWidth = 360;
  const chartHeight = 150;
  const padding = 20;

  // Chart data calculation
  const totalVolumeData = INITIAL_LOGS.map((log, idx) => ({
    x: padding + (idx * (chartWidth - padding * 2)) / (INITIAL_LOGS.length - 1),
    y: chartHeight - padding - ((log.weightLiftedTotal - 3500) * (chartHeight - padding * 2)) / 2500,
    val: log.weightLiftedTotal,
    date: log.date
  }));

  const benchMaxData = [
    { date: 'Jul 10', val: 205 },
    { date: 'Jul 12', val: 210 },
    { date: 'Jul 15', val: 215 },
    { date: 'Jul 18', val: 220 }
  ].map((d, idx) => ({
    x: padding + (idx * (chartWidth - padding * 2)) / 3,
    y: chartHeight - padding - ((d.val - 190) * (chartHeight - padding * 2)) / 40,
    val: d.val,
    date: d.date
  }));

  const chartPoints = activeTab === 'total' ? totalVolumeData : benchMaxData;
  const pathData = chartPoints.reduce((acc, point, i) => {
    return acc + `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y} `;
  }, '');

  // Fill area under line for neon gradient effect
  const fillPathData = pathData + 
    `L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - padding} ` + 
    `L ${chartPoints[0].x} ${chartHeight - padding} Z`;

  const filteredLogs = INITIAL_LOGS.filter(log => 
    log.workoutName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Your Progress</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Detailed analytics of your strength development.
        </p>
      </div>

      {/* PR Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '12px', margin: 0, textAlign: 'center' }}>
          <Trophy size={18} style={{ color: 'var(--accent-orange)', marginBottom: '4px' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>220 lbs</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>BENCH MAX</div>
        </div>

        <div className="card" style={{ padding: '12px', margin: 0, textAlign: 'center' }}>
          <Trophy size={18} style={{ color: 'var(--accent-orange)', marginBottom: '4px' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>325 lbs</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>DEADLIFT</div>
        </div>

        <div className="card" style={{ padding: '12px', margin: 0, textAlign: 'center' }}>
          <Trophy size={18} style={{ color: 'var(--accent-orange)', marginBottom: '4px' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>275 lbs</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>SQUAT</div>
        </div>
      </div>

      {/* Progress Charts (Premium Gated) */}
      <div className="card" style={{ position: 'relative', overflow: 'hidden', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem' }}>Performance Charts</div>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              onClick={() => setActiveTab('total')}
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'total' ? 'var(--accent-orange)' : 'var(--bg-main)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Volume
            </button>
            <button 
              onClick={() => {
                if (!isPremiumActive()) {
                  setIsModalOpen(true);
                } else {
                  setActiveTab('bench');
                }
              }}
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'bench' ? 'var(--accent-orange)' : 'var(--bg-main)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {!isPremiumActive() && <Lock size={10} />} Bench Max
            </button>
          </div>
        </div>

        {/* Visual Chart Canvas */}
        <div style={{ 
          filter: isPremiumActive() ? 'none' : 'blur(4px)',
          pointerEvents: isPremiumActive() ? 'auto' : 'none',
          transition: 'all 0.3s ease',
          height: `${chartHeight}px`,
          position: 'relative'
        }}>
          <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Gradients */}
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-orange)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-orange)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border-subtle)" strokeDasharray="4 4" />
            <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--border-subtle)" strokeDasharray="4 4" />
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--border-subtle)" strokeDasharray="4 4" />

            {/* Neon Fill Area */}
            <path d={fillPathData} fill="url(#chartGlow)" />

            {/* Spline Path */}
            <path d={pathData} fill="none" stroke="var(--accent-orange)" strokeWidth="3.5" strokeLinecap="round" />

            {/* Dots */}
            {chartPoints.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#fff" stroke="var(--accent-orange)" strokeWidth="3" />
                <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="var(--text-primary)" fontSize="8" fontWeight="bold">
                  {pt.val} {activeTab === 'total' ? 'lbs' : 'lbs'}
                </text>
                <text x={pt.x} y={chartHeight - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                  {pt.date}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Locked Feature Gate Overlay */}
        {!isPremiumActive() && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(21, 23, 30, 0.4)',
            textAlign: 'center',
            padding: '20px',
            zIndex: 10
          }}>
            <Lock size={22} style={{ color: 'var(--accent-orange)', marginBottom: '6px' }} />
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '2px' }}>
              Charts Premium Gated
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Subscribers get detailed progression and trend lines.
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'var(--accent-orange)',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Unlock Analytics
            </button>
          </div>
        )}
      </div>

      {/* History Search & Logs List */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Workout Log History</h3>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '10px 10px 10px 38px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* List of past workouts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredLogs.map((log) => (
            <div key={log.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{log.workoutName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {log.date}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '14px', marginBottom: '10px' }}>
                <span>⏱️ {log.durationMinutes} mins</span>
                <span>🏋️ {log.weightLiftedTotal} lbs volume</span>
              </div>

              {/* Set details - premium only */}
              {isPremiumActive() ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', background: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  {log.completedSets.map((s, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', background: 'var(--bg-card)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      {s.exerciseName.split(' ').slice(-1)}: {s.weight}lbs × {s.reps}
                    </span>
                  ))}
                </div>
              ) : (
                <div 
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-orange)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Lock size={12} /> Unlock set-by-set details
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <PremiumGateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

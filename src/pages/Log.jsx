import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Timer, Plus, Save, Award } from 'lucide-react';
import { INITIAL_PROGRAMS } from '../data/mockData';
import RestTimer from '../components/RestTimer';

export default function Log() {
  const navigate = useNavigate();
  const workout = INITIAL_PROGRAMS[0].workouts[0]; // Workout A

  // State to track sets completed
  const [completedSets, setCompletedSets] = useState({});
  const [setInputs, setSetInputs] = useState({
    '0-0': { weight: 195, reps: 8 },
    '0-1': { weight: 195, reps: 8 },
    '0-2': { weight: 205, reps: 6 },
    '0-3': { weight: 205, reps: 6 },
    '1-0': { weight: 295, reps: 5 },
    '1-1': { weight: 315, reps: 5 },
    '1-2': { weight: 315, reps: 5 }
  });

  const [activeRestTimer, setActiveRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);

  const toggleSet = (exIdx, setIdx) => {
    const key = `${exIdx}-${setIdx}`;
    const newStatus = !completedSets[key];

    setCompletedSets(prev => ({ ...prev, [key]: newStatus }));

    if (newStatus) {
      // Trigger rest timer
      setRestSeconds(90);
      setActiveRestTimer(true);
    }
  };

  const handleInputChange = (exIdx, setIdx, field, val) => {
    const key = `${exIdx}-${setIdx}`;
    setSetInputs(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: Number(val) || 0
      }
    }));
  };

  const handleFinishWorkout = () => {
    alert("Workout Log Saved! Great job staying consistent.");
    navigate('/progress');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span className="badge badge-free" style={{ marginBottom: '4px' }}>EXECUTIVE STRENGTH</span>
          <h2 style={{ fontSize: '1.3rem' }}>{workout.name}</h2>
        </div>
        <button 
          onClick={handleFinishWorkout}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto' }}
        >
          <Save size={16} /> Finish Log
        </button>
      </div>

      {/* Exercises List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {workout.exercises.map((exercise, exIdx) => (
          <div key={exIdx} className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-orange)' }}>
                {exercise.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target: {exercise.sets} × {exercise.reps} (Rest: {exercise.restTime})
              </div>
            </div>

            {/* Set Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '35px 1fr 1fr 45px', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, paddingBottom: '6px' }}>
              <span>SET</span>
              <span>LBS</span>
              <span>REPS</span>
              <span>LOG</span>
            </div>

            {/* Set Rows */}
            {Array.from({ length: exercise.sets }).map((_, setIdx) => {
              const key = `${exIdx}-${setIdx}`;
              const isDone = completedSets[key];
              const inputVal = setInputs[key] || { weight: 135, reps: 8 };

              return (
                <div key={setIdx} className="set-row">
                  <span className="set-number">{setIdx + 1}</span>

                  <input 
                    type="number"
                    className="input-num"
                    value={inputVal.weight}
                    onChange={(e) => handleInputChange(exIdx, setIdx, 'weight', e.target.value)}
                  />

                  <input 
                    type="number"
                    className="input-num"
                    value={inputVal.reps}
                    onChange={(e) => handleInputChange(exIdx, setIdx, 'reps', e.target.value)}
                  />

                  <button 
                    onClick={() => toggleSet(exIdx, setIdx)}
                    className={`check-btn ${isDone ? 'completed' : ''}`}
                  >
                    <Check size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Floating Rest Timer Component */}
      {activeRestTimer && (
        <RestTimer 
          seconds={restSeconds} 
          onClose={() => setActiveRestTimer(false)} 
        />
      )}
    </div>
  );
}

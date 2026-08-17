import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Dumbbell, Sparkles, ChevronRight, Lock, Play, Check, Clock, ShieldAlert, RefreshCw, Zap } from 'lucide-react';
import RestTimer from '../components/RestTimer';
import { supabase } from '../supabase';
import { generateAIWorkoutPlan } from '../services/geminiService';

export default function Programs() {
  const { currentUser, updateProfileData } = useAuth();
  const [activeVenue, setActiveVenue] = useState(currentUser?.environment || 'Gym');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeWorkoutSession, setActiveWorkoutSession] = useState(null);
  const [restTimerSeconds, setRestTimerSeconds] = useState(null);
  
  // AI Workout Generator State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiCustomPlan, setAiCustomPlan] = useState(null);
  
  const userId = currentUser?.uid || 'demo_user';

  const handleGenerateAIWorkout = async () => {
    setIsGeneratingAI(true);
    try {
      const plan = await generateAIWorkoutPlan(currentUser, activeVenue);
      setAiCustomPlan(plan);
      setSelectedProgram({
        id: 'ai_custom_' + Date.now(),
        name: plan.title || `AI Personalized ${activeVenue} Routine`,
        tag: 'Gemini AI Generated',
        venue: activeVenue,
        duration: '35-45 Mins',
        difficulty: currentUser?.experience || 'Intermediate',
        description: plan.description,
        exercises: plan.exercises
      });
    } catch (e) {
      console.warn("AI Generation error:", e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const logWorkoutToSupabase = async (programName, exerciseName) => {
    try {
      await supabase.from('workout_logs').insert([
        {
          user_id: userId,
          program_name: `${programName} - ${exerciseName}`,
          venue: activeVenue,
          duration_minutes: 30,
          calories_burned: 250
        }
      ]);
    } catch (err) {
      console.warn("Supabase workout_logs insert warning:", err);
    }
  };

  // Home Programs List
  const homePrograms = [
    {
      id: 'h1',
      name: 'Full Body Express Burn',
      tag: 'Zero Equipment',
      venue: 'Home',
      duration: '20-25 Mins',
      difficulty: currentUser?.experience || 'Beginner',
      description: 'High-intensity calisthenics designed to burn fat and build core endurance without any machines.',
      exercises: [
        { name: 'Declined Push-Ups', sets: 4, reps: '12-15 reps' },
        { name: 'Bodyweight Squats', sets: 4, reps: '20 reps' },
        { name: 'Mountain Climbers', sets: 3, reps: '45 seconds' },
        { name: 'Plank Knee Tucks', sets: 3, reps: '60 seconds' },
        { name: 'Glute Bridges', sets: 4, reps: '15 reps' }
      ]
    },
    {
      id: 'h2',
      name: 'Dumbbell & Resistance Shred',
      tag: 'Minimal Gear',
      venue: 'Home',
      duration: '35 Mins',
      difficulty: 'Intermediate',
      description: 'Targeted muscle sculpting using dumbbells or resistance bands.',
      exercises: [
        { name: 'Dumbbell Goblet Squat', sets: 4, reps: '12 reps' },
        { name: 'Dumbbell Floor Chest Press', sets: 4, reps: '12 reps' },
        { name: 'Bent-Over Dumbbell Rows', sets: 4, reps: '12 reps' },
        { name: 'Overhead Dumbbell Press', sets: 3, reps: '10 reps' },
        { name: 'Bicep Curls to Tricep Extensions', sets: 3, reps: '15 reps' }
      ]
    }
  ];

  // Gym Programs List
  const gymPrograms = [
    {
      id: 'g1',
      name: 'Peach Palace & Lower Body Power',
      tag: 'Barbell & Cables',
      venue: 'Gym',
      duration: '45-50 Mins',
      difficulty: 'Intermediate',
      description: 'Heavy compound leg hypertrophy split for glute development and quadricep strength.',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '8-10 reps' },
        { name: 'Romanian Deadlift (RDL)', sets: 4, reps: '10 reps' },
        { name: 'Cable Kickbacks', sets: 3, reps: '12 reps' },
        { name: 'Leg Extension Machine', sets: 3, reps: '15 reps' },
        { name: 'Seated Calf Raises', sets: 4, reps: '15 reps' }
      ]
    },
    {
      id: 'g2',
      name: 'Hypertrophy Push-Pull Split',
      tag: 'Full Gym Setup',
      venue: 'Gym',
      duration: '50 Mins',
      difficulty: 'Advanced',
      description: 'Upper body chest, back, and shoulder power routine engineered for progressive overload.',
      exercises: [
        { name: 'Incline Bench Press', sets: 4, reps: '8 reps' },
        { name: 'Lat Pulldowns', sets: 4, reps: '10 reps' },
        { name: 'Seated Cable Rows', sets: 4, reps: '12 reps' },
        { name: 'Lateral Dumbbell Raises', sets: 4, reps: '15 reps' },
        { name: 'Cable Face Pulls', sets: 3, reps: '15 reps' }
      ]
    }
  ];

  const displayedPrograms = activeVenue === 'Home' ? homePrograms : gymPrograms;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '20px' }}>
      {/* Venue Switcher Tabs (Home vs Gym) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Workout Programs</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Tailored to {currentUser?.displayName || 'you'} ({currentUser?.experience || 'Beginner'} • {currentUser?.weight}kg)
          </p>
        </div>
      </div>

      {/* Mode Selector Pill Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        background: 'var(--bg-card)',
        padding: '6px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => {
            setActiveVenue('Home');
            updateProfileData({ environment: 'Home' });
          }}
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-full)',
            background: activeVenue === 'Home' ? 'var(--accent-lime)' : 'transparent',
            color: activeVenue === 'Home' ? '#000' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Home size={18} /> Home Workouts
        </button>

        <button
          onClick={() => {
            setActiveVenue('Gym');
            updateProfileData({ environment: 'Gym' });
          }}
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-full)',
            background: activeVenue === 'Gym' ? 'var(--accent-lime)' : 'transparent',
            color: activeVenue === 'Gym' ? '#000' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Dumbbell size={18} /> Gym Workouts
        </button>
      </div>

      {/* Gemini AI Plan Generator Banner Button */}
      <button
        onClick={handleGenerateAIWorkout}
        disabled={isGeneratingAI}
        className="btn-primary"
        style={{
          background: 'linear-gradient(135deg, var(--accent-lime), #a3e635)',
          color: '#000',
          boxShadow: 'var(--shadow-lime)'
        }}
      >
        <Sparkles size={20} className={isGeneratingAI ? 'animate-spin' : ''} />
        {isGeneratingAI ? 'Gemini AI Creating Custom Plan...' : `Generate AI Custom ${activeVenue} Plan`}
      </button>

      {/* Active Session Detail / Logging View */}
      {selectedProgram ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button 
            onClick={() => setSelectedProgram(null)}
            className="btn-secondary"
            style={{ width: 'fit-content', padding: '6px 14px', fontSize: '0.82rem' }}
          >
            ← Back to {activeVenue} Plans
          </button>

          <div className="card" style={{ border: '1px solid var(--accent-lime)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{selectedProgram.name}</h3>
              <span className="badge badge-lime">{selectedProgram.tag}</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              {selectedProgram.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>⏱️ Duration: {selectedProgram.duration}</span>
              <span>⚡ Level: {selectedProgram.difficulty}</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Exercise Schedule & Sets</h3>
          {selectedProgram.exercises.map((ex, idx) => (
            <div key={idx} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {idx + 1}. {ex.name}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', fontWeight: 800 }}>
                  {ex.sets} Sets × {ex.reps}
                </span>
              </div>

              {/* Set & Rep logger buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: ex.sets }).map((_, setIdx) => (
                  <button
                    key={setIdx}
                    onClick={() => {
                      setRestTimerSeconds(60);
                      logWorkoutToSupabase(selectedProgram.name, ex.name);
                    }}
                    className="prompt-chip"
                    style={{ flex: 1, padding: '8px', textAlign: 'center', fontSize: '0.75rem' }}
                  >
                    Set {setIdx + 1} ✓
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Program Cards List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayedPrograms.map((prog) => (
            <div 
              key={prog.id}
              onClick={() => setSelectedProgram(prog)}
              className="card"
              style={{ cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>{prog.name}</h3>
                <span className="badge badge-lime">{prog.tag}</span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                {prog.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>⏱️ {prog.duration} • Level: {prog.difficulty}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-lime)', fontWeight: 800 }}>
                  Start Routine <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rest Timer Drawer */}
      {restTimerSeconds && (
        <RestTimer 
          seconds={restTimerSeconds}
          onClose={() => setRestTimerSeconds(null)}
        />
      )}
    </div>
  );
}

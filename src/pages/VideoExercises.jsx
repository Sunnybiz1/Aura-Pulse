import React, { useState } from 'react';
import { Search, Play, X, Dumbbell, Zap, Flame, Clock, CheckCircle2, ChevronRight, Sparkles, Home as HomeIcon } from 'lucide-react';
import { videoExercisesData } from '../data/videoExercisesData';

export default function VideoExercises() {
  const [selectedVenue, setSelectedVenue] = useState('Gym'); // 'Home' or 'Gym'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Chest');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Beginner');
  const [activeModalExercise, setActiveModalExercise] = useState(null);

  const categories = ['Chest', 'Back', 'Arms', 'Legs', 'Abs', 'Cardio', 'Full Body'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Filter exercises based on Venue (Home vs Gym), Category, Difficulty, and Search
  const categoryExercises = videoExercisesData.filter(item => {
    const matchesVenue = item.venue === selectedVenue || item.venue === 'Both';
    const matchesCategory = item.category === selectedCategory;
    const matchesDifficulty = item.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equipment.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesVenue && matchesCategory && matchesDifficulty && matchesSearch;
  });

  // Group exercises into sections by difficulty level
  const difficultySections = [
    { level: 'Beginner', icon: '🟢', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' },
    { level: 'Intermediate', icon: '🟡', color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.3)' },
    { level: 'Advanced', icon: '🔴', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '30px' }}>
      {/* Top Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-lime)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Interactive Demo Guide
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.1 }}>
            Video Exercise Library
          </h2>
        </div>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'rgba(198, 255, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(198, 255, 0, 0.3)'
        }}>
          <Play size={20} color="var(--accent-lime)" fill="var(--accent-lime)" />
        </div>
      </div>

      {/* 🌟 Segmented Home vs Gym Venue Toggle Bar (Matching User Screenshot 100%) */}
      <div style={{
        background: '#0d1117',
        borderRadius: 'var(--radius-full)',
        padding: '5px',
        border: '1px solid var(--border-subtle)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
      }}>
        <button
          onClick={() => setSelectedVenue('Home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-full)',
            background: selectedVenue === 'Home' ? 'var(--accent-lime)' : 'transparent',
            color: selectedVenue === 'Home' ? '#000000' : 'var(--text-primary)',
            fontWeight: selectedVenue === 'Home' ? 900 : 700,
            fontSize: '0.92rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: selectedVenue === 'Home' ? '0 4px 14px rgba(198, 255, 0, 0.35)' : 'none'
          }}
        >
          <HomeIcon size={18} color={selectedVenue === 'Home' ? '#000000' : 'var(--text-primary)'} />
          <span>Home Workouts</span>
        </button>

        <button
          onClick={() => setSelectedVenue('Gym')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-full)',
            background: selectedVenue === 'Gym' ? 'var(--accent-lime)' : 'transparent',
            color: selectedVenue === 'Gym' ? '#000000' : 'var(--text-primary)',
            fontWeight: selectedVenue === 'Gym' ? 900 : 700,
            fontSize: '0.92rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: selectedVenue === 'Gym' ? '0 4px 14px rgba(198, 255, 0, 0.35)' : 'none'
          }}
        >
          <Dumbbell size={18} color={selectedVenue === 'Gym' ? '#000000' : 'var(--text-primary)'} />
          <span>Gym Workouts</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-full)',
        padding: '10px 16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${selectedVenue.toLowerCase()} exercises, muscle, equipment...`}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            outline: 'none',
            width: '100%'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 1. Primary Muscle Category Selector */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.5px' }}>
          MUSCLE GROUP CATEGORIES ({selectedVenue.toUpperCase()})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--accent-lime)' : 'var(--bg-card)',
                  color: isActive ? '#000000' : 'var(--text-primary)',
                  fontWeight: isActive ? 900 : 700,
                  fontSize: '0.78rem',
                  border: isActive ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  boxShadow: isActive ? '0 2px 10px rgba(198, 255, 0, 0.25)' : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Secondary Difficulty Sub-Filter Tabs */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '10px 14px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Difficulty Level Filter
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {difficulties.map(diff => {
            const isActive = selectedDifficulty === diff;
            const badgeColor = diff === 'Beginner' ? '#22c55e' : diff === 'Intermediate' ? '#eab308' : '#ef4444';
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? badgeColor : 'var(--bg-main)',
                  color: isActive ? (diff === 'Intermediate' ? '#000' : '#fff') : 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  border: isActive ? `1px solid ${badgeColor}` : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {diff === 'Beginner' && '🟢 '}
                {diff === 'Intermediate' && '🟡 '}
                {diff === 'Advanced' && '🔴 '}
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sectional Grouping by Difficulty Level */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {difficultySections
          .filter(sec => selectedDifficulty === sec.level)
          .map(sec => {
            const sectionExercises = categoryExercises.filter(ex => ex.difficulty === sec.level);
            if (sectionExercises.length === 0) return null;

            return (
              <div key={sec.level}>
                {/* Section Header Title */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  paddingBottom: '6px',
                  borderBottom: `2px solid ${sec.border}`
                }}>
                  <span style={{ fontSize: '1rem' }}>{sec.icon}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {selectedVenue} {sec.level} {selectedCategory}
                  </h3>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: sec.bg,
                    color: sec.color,
                    border: `1px solid ${sec.border}`,
                    marginLeft: 'auto'
                  }}>
                    {sectionExercises.length} {sectionExercises.length === 1 ? 'Exercise' : 'Exercises'}
                  </span>
                </div>

                {/* Section Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '14px'
                }}>
                  {sectionExercises.map(exercise => (
                    <div
                      key={exercise.id}
                      className="card"
                      style={{
                        padding: '0',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        border: '1px solid var(--border-subtle)',
                        transition: 'transform 0.2s ease, border-color 0.2s ease'
                      }}
                      onClick={() => setActiveModalExercise(exercise)}
                    >
                      {/* Video Thumbnail Box with Overlay Play Button */}
                      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
                        <img 
                          src={exercise.thumbnail} 
                          alt={exercise.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {/* Animated Glow Play Button */}
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.75)',
                            border: '2px solid var(--accent-lime)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(198, 255, 0, 0.4)',
                            backdropFilter: 'blur(4px)'
                          }}>
                            <Play size={20} color="var(--accent-lime)" fill="var(--accent-lime)" style={{ marginLeft: '3px' }} />
                          </div>
                        </div>

                        {/* Badges Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          right: '10px',
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(0,0,0,0.75)',
                            color: 'var(--accent-lime)',
                            border: '1px solid rgba(198, 255, 0, 0.4)',
                            backdropFilter: 'blur(4px)'
                          }}>
                            {exercise.category} • {exercise.venue}
                          </span>

                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: sec.color,
                            color: sec.level === 'Intermediate' ? '#000000' : '#ffffff'
                          }}>
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Card Body Info */}
                      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.2 }}>
                            {exercise.title}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            💪 {exercise.targetMuscle}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--border-subtle)',
                          marginTop: '4px'
                        }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-lime)' }}>
                            ⚡ {exercise.duration}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            Watch Demo <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {categoryExercises.length === 0 && (
          <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
            <Dumbbell size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>No Exercises Found</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              No {selectedVenue.toLowerCase()} exercises match the selected category/difficulty. Try clearing your search or switching filters.
            </p>
          </div>
        )}
      </div>

      {/* Full Interactive Exercise Video Modal */}
      {activeModalExercise && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '0',
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-active)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
          }}>
            {/* Modal Header Bar */}
            <div style={{
              position: 'relative',
              width: '100%',
              background: '#000000',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              {/* HTML5 Video Player */}
              <video 
                controls 
                autoPlay 
                playsInline
                poster={activeModalExercise.thumbnail}
                style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
              >
                <source src={activeModalExercise.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video demo.
              </video>

              {/* Close X Button */}
              <button
                onClick={() => setActiveModalExercise(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Details */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-lime">{activeModalExercise.category} • {activeModalExercise.venue}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {activeModalExercise.difficulty}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '6px' }}>
                {activeModalExercise.title}
              </h3>
              
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                {activeModalExercise.description}
              </p>

              {/* Specs Pills */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px',
                background: 'var(--bg-main)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target Muscle</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-lime)' }}>{activeModalExercise.targetMuscle}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Equipment</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800 }}>{activeModalExercise.equipment}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Recommended Protocol</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800 }}>{activeModalExercise.duration}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rest Interval</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800 }}>{activeModalExercise.rest}</div>
                </div>
              </div>

              {/* Step-by-Step Form Instructions */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 900, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="var(--accent-lime)" />
                  Step-by-Step Form Guide
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeModalExercise.instructions.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'rgba(198, 255, 0, 0.15)',
                        color: 'var(--accent-lime)',
                        fontWeight: 900,
                        fontSize: '0.72rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Trainer Tip */}
              {activeModalExercise.tips && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(198, 255, 0, 0.12), rgba(19, 22, 31, 0.95))',
                  border: '1px solid rgba(198, 255, 0, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  <Sparkles size={18} color="var(--accent-lime)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    <strong style={{ color: 'var(--accent-lime)' }}>Pro Coach Tip: </strong>
                    {activeModalExercise.tips}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Search, Play, X, Dumbbell, Zap, Flame, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { videoExercisesData } from '../data/videoExercisesData';

export default function VideoExercises() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalExercise, setActiveModalExercise] = useState(null);

  const categories = ['All', 'Chest', 'Back', 'Arms', 'Legs', 'Abs', 'Cardio', 'Full Body'];

  // Filter exercises based on search query and selected category
  const filteredExercises = videoExercisesData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equipment.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
          placeholder="Search by exercise name, muscle, or equipment..."
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

      {/* Category Filter Pills */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.5px' }}>
          MUSCLE GROUP CATEGORY
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

      {/* Exercise Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>
            {selectedCategory === 'All' ? 'All Guided Exercises' : `${selectedCategory} Exercises`}
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing {filteredExercises.length} results
          </span>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
            <Dumbbell size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>No Exercises Found</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Try adjusting your search query or switching to another category.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {filteredExercises.map(exercise => (
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

                  {/* Category & Difficulty Badges Overlay */}
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
                      {exercise.category}
                    </span>

                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: exercise.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.85)' : exercise.difficulty === 'Intermediate' ? 'rgba(234, 179, 8, 0.85)' : 'rgba(239, 68, 68, 0.85)',
                      color: '#ffffff'
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
                <span className="badge badge-lime">{activeModalExercise.category}</span>
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

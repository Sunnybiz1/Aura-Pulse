import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, Sparkles, User, Mail, Phone, Lock, ArrowRight, ArrowLeft, Home, Dumbbell, Activity, Check } from 'lucide-react';

export default function Auth() {
  const { login, signup, loginWithGoogle, loginDemoUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phone: '',
    height: 175,
    weight: 72,
    targetWeight: 68,
    age: 25,
    experience: 'Beginner', // Beginner, Intermediate, Advanced
    environment: 'Gym', // Home, Gym, Hybrid
    goal: 'Muscle Growth & Tone',
    allergies: [],
    dietType: 'High-Protein'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAllergy = (allergy) => {
    setFormData(prev => {
      const exists = prev.allergies.includes(allergy);
      if (exists) {
        return { ...prev, allergies: prev.allergies.filter(a => a !== allergy) };
      } else {
        return { ...prev, allergies: [...prev.allergies, allergy] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp && step < 4) {
      setStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signup(formData.email, formData.password, formData);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const allergyList = ['Dairy', 'Eggs', 'Gluten', 'Peanuts', 'Tree Nuts', 'Soy', 'Seafood', 'Mustard'];

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '10px 0'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-lime)',
          color: '#000',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          boxShadow: 'var(--shadow-lime)'
        }}>
          <Zap size={32} fill="#000" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>AURA PULSE AI</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
          Personalized Home & Gym Workout Engine
        </p>
      </div>

      <div className="card" style={{ padding: '24px 20px' }}>
        {/* Auth Mode Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {isSignUp ? `Setup Profile (${step}/4)` : 'Sign In to Aura Pulse'}
          </h3>
          {isSignUp && (
            <div style={{
              display: 'flex',
              gap: '6px',
              justifyContent: 'center',
              marginTop: '10px'
            }}>
              {[1, 2, 3, 4].map(s => (
                <div 
                  key={s} 
                  style={{
                    height: '4px',
                    width: '32px',
                    borderRadius: '2px',
                    background: s <= step ? 'var(--accent-lime)' : 'var(--border-subtle)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 59, 96, 0.15)',
            border: '1px solid var(--accent-coral)',
            color: 'var(--accent-coral)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* STEP 1: Basic Credentials */}
          {(!isSignUp || step === 1) && (
            <>
              {isSignUp && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    className="input-num"
                    style={{ marginTop: '6px' }}
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="e.g. Olivia Rose"
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  className="input-num"
                  style={{ marginTop: '6px' }}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="you@domain.com"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>PHONE NUMBER</label>
                  <input 
                    type="tel" 
                    className="input-num"
                    style={{ marginTop: '6px' }}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>PASSWORD</label>
                <input 
                  type="password" 
                  className="input-num"
                  style={{ marginTop: '6px' }}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </>
          )}

          {/* STEP 2: Body Metrics */}
          {isSignUp && step === 2 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>HEIGHT (CM)</label>
                  <input 
                    type="number" 
                    className="input-num"
                    style={{ marginTop: '6px', textAlign: 'center' }}
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    min="100" max="250"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>AGE (YEARS)</label>
                  <input 
                    type="number" 
                    className="input-num"
                    style={{ marginTop: '6px', textAlign: 'center' }}
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    min="14" max="90"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>CURRENT WEIGHT (KG)</label>
                  <input 
                    type="number" 
                    className="input-num"
                    style={{ marginTop: '6px', textAlign: 'center' }}
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    min="30" max="250"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TARGET WEIGHT (KG)</label>
                  <input 
                    type="number" 
                    className="input-num"
                    style={{ marginTop: '6px', textAlign: 'center' }}
                    value={formData.targetWeight}
                    onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                    min="30" max="250"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Experience Level & Goal */}
          {isSignUp && step === 3 && (
            <>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  WORKOUT EXPERIENCE LEVEL
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(exp => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => handleInputChange('experience', exp)}
                      className={`prompt-chip ${formData.experience === exp ? 'active' : ''}`}
                      style={{ padding: '12px 6px', textAlign: 'center' }}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  PRIMARY FITNESS GOAL
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Weight Loss & Fat Burn',
                    'Muscle Hypertrophy & Growth',
                    'Tone & Conditioning',
                    'Athletic Power & Strength'
                  ].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleInputChange('goal', g)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: formData.goal === g ? 'rgba(198, 255, 0, 0.12)' : 'var(--bg-main)',
                        border: `1px solid ${formData.goal === g ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                        color: formData.goal === g ? 'var(--accent-lime)' : 'var(--text-primary)',
                        fontWeight: 700,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {g}
                      {formData.goal === g && <Check size={18} />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 4: Home vs Gym & Dietary Allergies */}
          {isSignUp && step === 4 && (
            <>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  PREFERRED WORKOUT VENUE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'Home', icon: Home, label: 'Home' },
                    { id: 'Gym', icon: Dumbbell, label: 'Gym' },
                    { id: 'Hybrid', icon: Activity, label: 'Hybrid' }
                  ].map(item => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleInputChange('environment', item.id)}
                        style={{
                          padding: '14px 8px',
                          borderRadius: 'var(--radius-md)',
                          background: formData.environment === item.id ? 'var(--accent-lime)' : 'var(--bg-main)',
                          color: formData.environment === item.id ? '#000' : 'var(--text-primary)',
                          border: `1px solid ${formData.environment === item.id ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <IconComponent size={20} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  DO YOU HAVE ANY FOOD ALLERGIES?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allergyList.map(allergy => {
                    const isSelected = formData.allergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => toggleAllergy(allergy)}
                        className={`prompt-chip ${isSelected ? 'active' : ''}`}
                        style={{ fontSize: '0.78rem' }}
                      >
                        {allergy}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Form Action Controls */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {isSignUp && step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="btn-secondary"
                style={{ flex: '0 0 50px', padding: '0' }}
              >
                <ArrowLeft size={18} />
              </button>
            )}

            <button 
              type="submit" 
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {isSignUp ? (step === 4 ? 'Create Plan & Start' : 'Continue Step') : 'Sign In'} <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Google Sign In */}
        <button 
          onClick={loginWithGoogle}
          className="btn-secondary"
          style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}
        >
          <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.26.612 4.47 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.706 1 2.24 5.466 2.24 11s4.466 10 10 10c5.776 0 10-4.06 10-10 0-.614-.057-1.2-.166-1.715H12.24z"/>
          </svg>
          Continue with Google
        </button>

        {/* Demo Mode Previews */}
        <div style={{
          marginTop: '20px',
          background: 'var(--bg-main)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
            ⚡ INSTANT DEMO PREVIEWS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              onClick={() => loginDemoUser(false)}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '10px 4px' }}
            >
              Free Trial
            </button>
            <button 
              onClick={() => loginDemoUser(true)}
              className="btn-primary"
              style={{ fontSize: '0.75rem', padding: '10px 4px', boxShadow: 'none' }}
            >
              Pro Athlete
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.84rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setStep(1);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', fontWeight: 800, cursor: 'pointer' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

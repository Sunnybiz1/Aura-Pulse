import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Sun, Moon, Shield, Sparkles, Phone, Activity, Dumbbell, Home as HomeIcon, Check, Edit2, Save, Camera, Upload } from 'lucide-react';

export default function Profile() {
  const { currentUser, logout, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || 'Olivia Rose',
    phone: currentUser?.phone || '+1 (555) 019-2834',
    height: currentUser?.height || 175,
    weight: currentUser?.weight || 72,
    targetWeight: currentUser?.targetWeight || 68,
    experience: currentUser?.experience || 'Beginner',
    environment: currentUser?.environment || 'Gym',
    goal: currentUser?.goal || 'Tone & Strength'
  });

  // Handle Photo Avatar File Upload with HTML5 Canvas Compression
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 350;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to lightweight Data URL (JPEG, 0.85 quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

        // Sync to AuthContext & Supabase `avatar_url` database column
        updateProfileData({ avatarUrl: compressedBase64 });
        setIsUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfileData(formData);
    setIsEditing(false);
  };

  // BMI Calculation
  const heightMeters = (Number(formData.height) || 175) / 100;
  const bmi = (Number(formData.weight) / (heightMeters * heightMeters)).toFixed(1);

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'var(--accent-blue)' };
    if (val < 25) return { label: 'Optimal / Athletic', color: 'var(--accent-lime)' };
    if (val < 30) return { label: 'Slightly Overweight', color: 'var(--accent-coral)' };
    return { label: 'High Body Mass', color: 'var(--accent-coral)' };
  };

  const bmiCat = getBmiCategory(Number(bmi));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '20px' }}>
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        style={{ display: 'none' }}
      />

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>User Profile & Metrics</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Personal details & avatar photo sync
          </p>
        </div>

        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
        >
          {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
          {isEditing ? 'Save Metrics' : 'Edit Profile'}
        </button>
      </div>

      {/* Main Profile Info Card with Photo Avatar Uploader */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-subtle)' }}>
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Click to upload profile photo"
        >
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt="User Avatar"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-lime)',
                boxShadow: 'var(--shadow-lime)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'var(--accent-lime)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.5rem',
              boxShadow: 'var(--shadow-lime)'
            }}>
              {formData.displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Camera Upload Badge Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '2px solid var(--bg-card)',
            color: 'var(--accent-lime)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
          }}>
            <Camera size={13} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{formData.displayName}</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-lime)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </button>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            📧 {currentUser?.email || 'user@aurapulse.com'}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            📞 {formData.phone || 'No phone added'}
          </p>
        </div>
      </div>

      {/* Body Mass Index (BMI) & Goal Metrics */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #13161f, #0d0f16)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 900 }}>Body Mass Index (BMI)</span>
          <span className="badge badge-lime" style={{ background: 'rgba(198, 255, 0, 0.15)', color: bmiCat.color, borderColor: bmiCat.color }}>
            {bmiCat.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-lime)' }}>{bmi}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kg/m²</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>HEIGHT</div>
            {isEditing ? (
              <input
                type="number"
                className="input-num"
                style={{ textAlign: 'center', padding: '4px', marginTop: '4px' }}
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            ) : (
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '2px' }}>{formData.height} cm</div>
            )}
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>WEIGHT</div>
            {isEditing ? (
              <input
                type="number"
                className="input-num"
                style={{ textAlign: 'center', padding: '4px', marginTop: '4px' }}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            ) : (
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '2px' }}>{formData.weight} kg</div>
            )}
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>TARGET</div>
            {isEditing ? (
              <input
                type="number"
                className="input-num"
                style={{ textAlign: 'center', padding: '4px', marginTop: '4px' }}
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
              />
            ) : (
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '2px' }}>{formData.targetWeight} kg</div>
            )}
          </div>
        </div>
      </div>

      {/* Workout Preferences Settings */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '14px' }}>Training Settings</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Venue Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Workout Environment</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Choose Home vs Gym routines</div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['Home', 'Gym'].map(env => (
                <button
                  key={env}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, environment: env }));
                    updateProfileData({ environment: env });
                  }}
                  className={`prompt-chip ${formData.environment === env ? 'active' : ''}`}
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  {env === 'Home' ? <HomeIcon size={12} /> : <Dumbbell size={12} />} {env}
                </button>
              ))}
            </div>
          </div>

          {/* Experience level */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Experience Level</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Adjust workout intensity</div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['Beginner', 'Intermediate', 'Advanced'].map(exp => (
                <button
                  key={exp}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, experience: exp }));
                    updateProfileData({ experience: exp });
                  }}
                  className={`prompt-chip ${formData.experience === exp ? 'active' : ''}`}
                  style={{ padding: '6px 10px', fontSize: '0.72rem' }}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Controls */}
      <button 
        onClick={logout}
        className="btn-secondary"
        style={{ color: 'var(--accent-coral)', borderColor: 'rgba(255, 59, 96, 0.3)', width: '100%' }}
      >
        <LogOut size={18} /> Sign Out of Aura Pulse
      </button>
    </div>
  );
}

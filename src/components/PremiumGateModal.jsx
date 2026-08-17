import React, { useState } from 'react';
import { Shield, Sparkles, X, Check, Loader2 } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

export default function PremiumGateModal({ isOpen, onClose }) {
  const { triggerStripeCheckout } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'annual'

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    await triggerStripeCheckout(selectedPlan);
    setLoading(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--accent-orange)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '400px',
        padding: '24px',
        position: 'relative',
        boxShadow: 'var(--shadow-glow)',
        textAlign: 'center'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-orange-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: 'var(--accent-orange)'
        }}>
          <Sparkles size={30} />
        </div>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          Unlock JabbFit Premium
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Get full access to all professional strength programs, advanced charts, custom workouts, and PR tracking.
        </p>

        {/* Bullet points */}
        <div style={{ textAlign: 'left', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            'Complete program library access',
            'Advanced progress charts & trends',
            'Create unlimited custom workouts',
            'Full history search & filtering',
            'Manage anytime via Customer Portal'
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <Check size={16} style={{ color: 'var(--accent-orange)' }} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div 
            onClick={() => setSelectedPlan('monthly')}
            style={{
              border: `2px solid ${selectedPlan === 'monthly' ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              cursor: 'pointer',
              background: selectedPlan === 'monthly' ? 'var(--accent-orange-glow)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Monthly</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>$9</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>billed monthly</div>
          </div>

          <div 
            onClick={() => setSelectedPlan('annual')}
            style={{
              border: `2px solid ${selectedPlan === 'annual' ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              cursor: 'pointer',
              background: selectedPlan === 'annual' ? 'var(--accent-orange-glow)' : 'transparent',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--accent-orange)',
              color: '#fff',
              fontSize: '0.6rem',
              fontWeight: 900,
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              whiteSpace: 'nowrap'
            }}>
              SAVE 27%
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Annual</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>$79</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>billed yearly</div>
          </div>
        </div>

        <button 
          onClick={handleSubscribe}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Securing Payment...
            </>
          ) : (
            `Upgrade to Premium`
          )}
        </button>

        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          Secure Checkout via Stripe. Cancel anytime in one click.
        </div>
      </div>
    </div>
  );
}

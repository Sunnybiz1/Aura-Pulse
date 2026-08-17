import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
  const { currentUser, updatePremiumStatus, isDemoMode } = useAuth();
  const [loading, setLoading] = useState(false);

  // Simulated stripe checkout session
  const triggerStripeCheckout = async (planType) => {
    setLoading(true);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Upgrade local state
    updatePremiumStatus(true);
    setLoading(false);
    
    // Return checkout status
    return { success: true, url: window.location.href };
  };

  // Simulated stripe customer portal
  const triggerCustomerPortal = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Toggle/Cancel logic
    updatePremiumStatus(false);
    setLoading(false);
    
    alert("Stripe Customer Portal Mock: Subscription cancelled. User status reverted to Free.");
  };

  const isPremiumActive = () => {
    if (!currentUser) return false;
    // Premium checks
    return currentUser.isPremium || currentUser.subscriptionStatus === 'active';
  };

  const value = {
    triggerStripeCheckout,
    triggerCustomerPortal,
    isPremiumActive,
    loading
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

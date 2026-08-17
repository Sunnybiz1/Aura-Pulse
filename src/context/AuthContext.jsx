import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { supabase } from '../supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Helper to fetch profile from Supabase
  const fetchSupabaseProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (!error && data) {
        return {
          uid: data.id,
          email: data.email,
          displayName: data.display_name,
          phone: data.phone,
          avatarUrl: data.avatar_url || '',
          height: Number(data.height),
          weight: Number(data.weight),
          targetWeight: Number(data.target_weight),
          age: Number(data.age),
          experience: data.experience,
          environment: data.environment,
          goal: data.goal,
          allergies: data.allergies || [],
          dietType: data.diet_type,
          isPremium: data.is_premium,
          subscriptionStatus: data.is_premium ? 'active' : 'free'
        };
      }
    } catch (e) {
      console.warn("Supabase fetch profile fallback:", e);
    }
    return null;
  };

  // Helper to upsert profile to Supabase
  const upsertSupabaseProfile = async (profile) => {
    try {
      const payload = {
        id: profile.uid,
        email: profile.email,
        display_name: profile.displayName,
        phone: profile.phone || '',
        avatar_url: profile.avatarUrl || '',
        height: Number(profile.height) || 175,
        weight: Number(profile.weight) || 70,
        target_weight: Number(profile.targetWeight) || 65,
        age: Number(profile.age) || 25,
        experience: profile.experience || 'Beginner',
        environment: profile.environment || 'Gym',
        goal: profile.goal || 'General Fitness',
        allergies: profile.allergies || [],
        diet_type: profile.dietType || 'High-Protein',
        is_premium: !!profile.isPremium
      };

      const { data, error } = await supabase.from('profiles').upsert(payload);
      if (error) {
        console.warn("Supabase profiles table upsert notice (Make sure RLS is disabled or Trigger is active):", error.message);
      } else {
        console.log("Supabase profiles table updated successfully for UID:", profile.uid);
      }
    } catch (e) {
      console.warn("Supabase upsert profile exception:", e);
    }
  };

  // Listen to Supabase Auth State Changes
  useEffect(() => {
    const initSession = async () => {
      // 1. Try Supabase Auth Session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const remote = await fetchSupabaseProfile(session.user.id);
        if (remote) {
          setCurrentUser(remote);
          localStorage.setItem('jabbfit_current_user', JSON.stringify(remote));
          setIsDemoMode(false);
          setLoading(false);
          return;
        }
      }

      // 2. Local session fallback
      const savedUser = localStorage.getItem('jabbfit_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setIsDemoMode(parsed.isDemo);

        if (parsed.uid) {
          const remote = await fetchSupabaseProfile(parsed.uid);
          if (remote) {
            const merged = { ...parsed, ...remote };
            setCurrentUser(merged);
            localStorage.setItem('jabbfit_current_user', JSON.stringify(merged));
          }
        }
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    initSession();

    // Subscribe to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        setIsDemoMode(false);
        const remote = await fetchSupabaseProfile(session.user.id);
        if (remote) {
          setCurrentUser(remote);
          localStorage.setItem('jabbfit_current_user', JSON.stringify(remote));
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Demo Profile Login Helper
  const loginDemoUser = (premium = false) => {
    setIsDemoMode(true);
    const defaultFitnessMetrics = {
      phone: '+1 (555) 234-5678',
      height: 175,
      weight: 72,
      targetWeight: 68,
      age: 26,
      experience: 'Intermediate',
      environment: 'Gym',
      goal: 'Muscle Hypertrophy & Fat Loss',
      allergies: ['Gluten-Free'],
      dietType: 'High-Protein'
    };

    const demoProfile = {
      uid: premium ? 'demo_premium_user' : 'demo_free_user',
      email: premium ? 'premium@aurapulse.com' : 'demo@aurapulse.com',
      displayName: premium ? 'Olivia Rose' : 'Alex Rivera',
      joinedDate: new Date().toISOString(),
      isPremium: premium,
      subscriptionStatus: premium ? 'active' : 'free',
      subscriptionPeriodEnd: premium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      isDemo: true,
      ...defaultFitnessMetrics
    };
    setCurrentUser(demoProfile);
    localStorage.setItem('jabbfit_current_user', JSON.stringify(demoProfile));
    upsertSupabaseProfile(demoProfile);
    setLoading(false);
  };

  // Hybrid local-storage user listing
  const getLocalUsers = () => {
    const users = localStorage.getItem('jabbfit_local_users');
    return users ? JSON.parse(users) : {};
  };

  const saveLocalUser = (email, profile) => {
    const users = getLocalUsers();
    users[email.toLowerCase()] = profile;
    localStorage.setItem('jabbfit_local_users', JSON.stringify(users));
  };

  const login = async (email, password) => {
    if (email === 'demo@jabbfit.com' || email === 'demo@aurapulse.com') {
      loginDemoUser(false);
      return;
    }
    if (email === 'premium@jabbfit.com' || email === 'premium@aurapulse.com') {
      loginDemoUser(true);
      return;
    }

    // 1. Try Supabase Auth Sign In
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (!error && data?.user) {
        setIsDemoMode(false);
        const remote = await fetchSupabaseProfile(data.user.id);
        const userProfile = remote || {
          uid: data.user.id,
          email: data.user.email,
          displayName: email.split('@')[0],
          joinedDate: new Date().toISOString()
        };
        setCurrentUser(userProfile);
        localStorage.setItem('jabbfit_current_user', JSON.stringify(userProfile));
        return userProfile;
      }
    } catch (supaErr) {
      console.warn("Supabase Auth signin attempt:", supaErr);
    }

    // 2. Check local registered user list fallback
    const localUsers = getLocalUsers();
    const existingUser = localUsers[email.toLowerCase()];
    if (existingUser && existingUser.password === password) {
      setIsDemoMode(true);
      setCurrentUser(existingUser);
      localStorage.setItem('jabbfit_current_user', JSON.stringify(existingUser));
      upsertSupabaseProfile(existingUser);
      return existingUser;
    }

    // 3. Auto-fallback for demo
    const uid = 'local_' + Math.random().toString(36).substr(2, 9);
    const newLocalProfile = {
      uid: uid,
      email: email,
      password: password,
      displayName: email.split('@')[0],
      joinedDate: new Date().toISOString(),
      isPremium: false,
      subscriptionStatus: 'free',
      isDemo: true,
      phone: '',
      height: 170,
      weight: 68,
      targetWeight: 65,
      age: 24,
      experience: 'Beginner',
      environment: 'Home',
      goal: 'General Fitness',
      allergies: [],
      dietType: 'Balanced'
    };
    saveLocalUser(email, newLocalProfile);
    setIsDemoMode(true);
    setCurrentUser(newLocalProfile);
    localStorage.setItem('jabbfit_current_user', JSON.stringify(newLocalProfile));
    upsertSupabaseProfile(newLocalProfile);
    return newLocalProfile;
  };

  const signup = async (email, password, extraData = {}) => {
    let authUid = null;
    const fullMetrics = {
      displayName: extraData.displayName || email.split('@')[0],
      display_name: extraData.displayName || email.split('@')[0],
      phone: extraData.phone || '',
      height: Number(extraData.height) || 175,
      weight: Number(extraData.weight) || 70,
      targetWeight: Number(extraData.targetWeight) || 65,
      target_weight: Number(extraData.targetWeight) || 65,
      age: Number(extraData.age) || 25,
      experience: extraData.experience || 'Beginner',
      environment: extraData.environment || 'Home',
      goal: extraData.goal || 'General Fitness',
      allergies: extraData.allergies || [],
      dietType: extraData.dietType || 'Balanced',
      diet_type: extraData.dietType || 'Balanced'
    };

    // 1. Register User in Supabase Authentication Users List (with user_metadata)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: fullMetrics
        }
      });

      if (!error && data?.user) {
        authUid = data.user.id;
        console.log("Registered in Supabase Auth Users with Metadata ID:", authUid);
      } else if (error) {
        console.warn("Supabase Auth SignUp Notice:", error.message);
      }
    } catch (authErr) {
      console.warn("Supabase Auth SignUp Exception:", authErr);
    }

    if (!authUid) {
      authUid = 'user_' + Math.random().toString(36).substr(2, 9);
    }

    const profilePayload = {
      uid: authUid,
      email: email,
      password: password,
      ...fullMetrics,
      joinedDate: new Date().toISOString(),
      isPremium: false,
      subscriptionStatus: 'free',
      isDemo: false
    };

    // Save to Local Storage & Upsert to Supabase `profiles` table
    saveLocalUser(email, profilePayload);
    setIsDemoMode(false);
    setCurrentUser(profilePayload);
    localStorage.setItem('jabbfit_current_user', JSON.stringify(profilePayload));
    
    // Sync to Supabase DB Profiles Table
    await upsertSupabaseProfile(profilePayload);

    return profilePayload;
  };

  const updateProfileData = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('jabbfit_current_user', JSON.stringify(updated));
      if (prev.email) {
        saveLocalUser(prev.email, updated);
      }
      upsertSupabaseProfile(updated);
      return updated;
    });
  };


  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setIsDemoMode(false);
      return result.user;
    } catch (error) {
      console.warn("Google popup blocked/failed. Auto-signing in with demo account.");
      loginDemoUser(true);
    }
  };

  const logout = async () => {
    localStorage.removeItem('jabbfit_current_user');
    try {
      await signOut(auth);
    } catch (err) {
      // Ignore
    }
    setCurrentUser(null);
  };

  const updatePremiumStatus = (premium) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        isPremium: premium,
        subscriptionStatus: premium ? 'active' : 'free'
      };
      localStorage.setItem('jabbfit_current_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    currentUser,
    isDemoMode,
    loginDemoUser,
    login,
    signup,
    updateProfileData,
    loginWithGoogle,
    logout,
    updatePremiumStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}


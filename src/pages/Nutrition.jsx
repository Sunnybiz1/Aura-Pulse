import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Utensils, Flame, Sparkles, ShoppingBag, Check, Plus, RefreshCw, ChevronRight, Apple, Globe } from 'lucide-react';
import { supabase } from '../supabase';
import { generateAIDietPlan } from '../services/geminiService';
import { africanMealsDataset } from '../data/africanMeals';

export default function Nutrition() {
  const { currentUser, updateProfileData } = useAuth();
  const userName = currentUser?.displayName?.split(' ')[0] || 'Athlete';
  const weight = currentUser?.weight || 70;
  const height = currentUser?.height || 175;
  const goal = currentUser?.goal || 'General Fitness';
  const userId = currentUser?.uid || 'demo_user';

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Calculate dynamic target TDEE calories
  const targetCalories = Math.round(weight * 26 + 300);
  const [consumedCalories, setConsumedCalories] = useState(1250);

  // Macros state (Carbs, Protein, Fat)
  const targetCarbs = 250;
  const consumedCarbs = 180;
  
  const targetProtein = Math.round(weight * 2);
  const consumedProtein = 115;

  const targetFat = 65;
  const consumedFat = 45;

  // Grocery List State
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [groceryItems, setGroceryItems] = useState([
    { category: 'Proteins', items: ['Chicken Breast (1kg)', 'Organic Eggs (12-pack)', 'Wild Salmon Fillets', 'Greek Yogurt 0%'] },
    { category: 'Carbs & Grains', items: ['Rolled Oats', 'Basmati Rice', 'Quinoa', 'Sweet Potatoes'] },
    { category: 'Veggies & Greens', items: ['Baby Spinach', 'Broccoli', 'Avocados', 'Bell Peppers'] },
    { category: 'Healthy Fats & Seeds', items: ['Raw Almonds', 'Chia Seeds', 'Extra Virgin Olive Oil'] }
  ]);

  const [checkedGrocery, setCheckedGrocery] = useState({});

  // Sync Grocery Item Checkmark state with Supabase
  useEffect(() => {
    const fetchSupabaseGrocery = async () => {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from('grocery_items')
          .select('*')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          const map = {};
          data.forEach(item => {
            map[item.item_name] = item.is_checked;
          });
          setCheckedGrocery(map);
        }
      } catch (err) {
        console.warn("Supabase grocery fetch fallback:", err);
      }
    };

    fetchSupabaseGrocery();
  }, [userId]);

  const toggleGroceryItem = async (item) => {
    const nextState = !checkedGrocery[item];
    setCheckedGrocery(prev => ({ ...prev, [item]: nextState }));

    try {
      await supabase.from('grocery_items').upsert([
        {
          user_id: userId,
          category: 'Grocery',
          item_name: item,
          is_checked: nextState
        }
      ]);
    } catch (err) {
      console.warn("Supabase grocery item upsert warning:", err);
    }
  };

  // Daily Meal Plans (Integrated African/Nigerian Specials & Standard Fitness Dishes)
  const [meals, setMeals] = useState([
    ...africanMealsDataset.map((item, idx) => ({
      ...item,
      time: item.type === 'Breakfast' ? '08:30 AM' : item.type === 'Lunch' ? '01:15 PM' : item.type === 'Dinner' ? '07:30 PM' : '04:00 PM',
      logged: idx === 0 || idx === 4 // Mark Suya & Jollof logged by default for demo
    })),
    {
      id: 'std_1',
      name: 'Oatmeal with Pumpkin & Chia Seeds',
      category: 'Breakfast & Snacks',
      type: 'Breakfast',
      time: '08:30 AM',
      kcal: 380,
      protein: 24,
      carbs: 52,
      fat: 10,
      tag: 'Fitness Breakfast',
      image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=400&q=80',
      logged: false
    },
    {
      id: 'std_2',
      name: 'Grilled Salmon & Quinoa Bowl',
      category: 'High-Protein',
      type: 'Dinner',
      time: '07:30 PM',
      kcal: 480,
      protein: 38,
      carbs: 40,
      fat: 18,
      tag: 'High-Protein',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
      logged: false
    }
  ]);

  const toggleMealLog = async (id) => {
    const targetMeal = meals.find(m => m.id === id);
    if (!targetMeal) return;

    const updatedLogged = !targetMeal.logged;

    setMeals(prev => prev.map(m => {
      if (m.id === id) {
        if (updatedLogged) setConsumedCalories(c => c + m.kcal);
        else setConsumedCalories(c => Math.max(0, c - m.kcal));
        return { ...m, logged: updatedLogged };
      }
      return m;
    }));

    if (updatedLogged) {
      try {
        await supabase.from('meal_logs').insert([
          {
            user_id: userId,
            meal_name: targetMeal.name,
            meal_type: targetMeal.type,
            calories: targetMeal.kcal,
            protein_g: targetMeal.protein,
            carbs_g: targetMeal.carbs,
            fat_g: targetMeal.fat
          }
        ]);
      } catch (err) {
        console.warn("Supabase meal_logs insert warning:", err);
      }
    }
  };

  const handleGenerateAIDiet = async () => {
    setIsGeneratingAI(true);
    try {
      const plan = await generateAIDietPlan(currentUser);
      if (plan && plan.meals) {
        const formatted = plan.meals.map((m, idx) => ({
          id: Date.now() + idx,
          name: m.name,
          type: m.type || 'Meal',
          time: m.type === 'Breakfast' ? '08:30 AM' : m.type === 'Lunch' ? '01:15 PM' : m.type === 'Dinner' ? '07:30 PM' : '04:00 PM',
          kcal: m.kcal,
          protein: m.protein,
          carbs: m.carbs,
          fat: m.fat,
          image: idx % 2 === 0 
            ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
          logged: false
        }));
        setMeals(formatted);
      }
    } catch (e) {
      console.warn("AI Diet generation error:", e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const allergyList = ['Dairy', 'Eggs', 'Gluten', 'Peanuts', 'Tree Nuts', 'Soy', 'Seafood', 'Mustard'];
  const userAllergies = currentUser?.allergies || ['Gluten-Free'];

  // Calorie Ring Percentage
  const progressPercent = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));
  const strokeDashoffset = 314 - (314 * progressPercent) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Nutrition & Macros</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Tailored to your {weight}kg target & goal
          </p>
        </div>

        <button 
          onClick={() => setShowGroceryList(!showGroceryList)}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
        >
          <ShoppingBag size={16} color="var(--accent-lime)" />
          {showGroceryList ? 'Close List' : 'Grocery List'}
        </button>
      </div>

      {/* Main Calorie & Macro Progress Dial (Matching Screenshot 2 & 3) */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #13161f, #0e1017)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '12px' }}>
          {/* Circular SVG Gauge */}
          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="130" height="130" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
              />
              <circle
                className="progress-ring-circle"
                cx="60" cy="60" r="50"
                fill="none"
                stroke="var(--accent-lime)"
                strokeWidth="10"
                strokeDasharray="314"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <Flame size={20} color="var(--accent-lime)" style={{ margin: '0 auto' }} />
              <div style={{ fontSize: '1.35rem', fontWeight: 900, lineHeight: 1 }}>{consumedCalories}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>of {targetCalories} kcal</div>
            </div>
          </div>

          {/* Macro Breakdown Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {/* Carbs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Carbs</span>
                <span>{consumedCarbs} / {targetCarbs}g</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(consumedCarbs / targetCarbs) * 100}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Protein */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: 'var(--accent-lime)' }}>Protein</span>
                <span>{consumedProtein} / {targetProtein}g</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(consumedProtein / targetProtein) * 100}%`, height: '100%', background: 'var(--accent-lime)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Fat */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: 'var(--accent-coral)' }}>Fats</span>
                <span>{consumedFat} / {targetFat}g</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(consumedFat / targetFat) * 100}%`, height: '100%', background: 'var(--accent-coral)', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grocery Drawer View (Screenshot 2 Right Panel) */}
      {showGroceryList ? (
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-active)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} color="var(--accent-lime)" /> Weekly Grocery List
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700 }}>AI Generated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {groceryItems.map((cat, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', uppercase: 'true', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  {cat.category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cat.items.map(item => {
                    const isChecked = !!checkedGrocery[item];
                    return (
                      <button
                        key={item}
                        onClick={() => toggleGroceryItem(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: isChecked ? 'rgba(198, 255, 0, 0.1)' : 'var(--bg-main)',
                          border: `1px solid ${isChecked ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                          color: isChecked ? 'var(--accent-lime)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ textDecoration: isChecked ? 'line-through' : 'none', fontSize: '0.88rem', fontWeight: 600 }}>
                          {item}
                        </span>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          border: `1px solid ${isChecked ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                          background: isChecked ? 'var(--accent-lime)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isChecked && <Check size={14} color="#000" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Dietary Restrictions Tags (Screenshot 2 Bottom Panel) */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              YOUR FOOD ALLERGIES & PREFERENCES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allergyList.map(allergy => {
                const isActive = userAllergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    onClick={() => {
                      const nextAllergies = isActive
                        ? userAllergies.filter(a => a !== allergy)
                        : [...userAllergies, allergy];
                      updateProfileData({ allergies: nextAllergies });
                    }}
                    className={`prompt-chip ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                  >
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gemini AI Meal Plan Generator Banner Button */}
          <button
            onClick={handleGenerateAIDiet}
            disabled={isGeneratingAI}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, var(--accent-lime), #a3e635)',
              color: '#000',
              boxShadow: 'var(--shadow-lime)',
              margin: '8px 0 14px 0'
            }}
          >
            <Sparkles size={20} className={isGeneratingAI ? 'animate-spin' : ''} />
            {isGeneratingAI ? 'Gemini AI Customizing Diet Plan...' : 'Generate AI Custom Diet Plan'}
          </button>

          {/* Meal Category Filter Pills (Clean 2-Row Wrapped Layout) */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.5px' }}>
              FILTER BY CATEGORY
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: '✨ All Meals', value: 'All' },
                { label: '🇳🇬 Nigerian', value: 'Nigerian Specials' },
                { label: '💪 High-Protein', value: 'High-Protein' },
                { label: '🌾 Complex Carbs', value: 'Complex Carbs' },
                { label: '🥗 Low-Carb Soups', value: 'Low-Carb Soups' },
                { label: '🍳 Breakfast & Snacks', value: 'Breakfast & Snacks' }
              ].map(cat => {
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    style={{
                      padding: '7px 13px',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'var(--accent-lime)' : 'var(--bg-card)',
                      color: isActive ? '#000000' : 'var(--text-primary)',
                      fontWeight: isActive ? 900 : 700,
                      fontSize: '0.76rem',
                      border: isActive ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-in-out',
                      boxShadow: isActive ? '0 2px 10px rgba(198, 255, 0, 0.25)' : 'none'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Meal Plan Cards (Matching Screenshot 2 & 3) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>
                {activeCategory === 'All' ? 'All Recommended Meals' : `${activeCategory}`}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tap button to log</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {meals
                .filter(meal => {
                  if (activeCategory === 'All') return true;
                  if (activeCategory === 'Nigerian Specials') return meal.id.toString().startsWith('ng_');
                  return meal.category === activeCategory;
                })
                .map(meal => (
                  <div
                    key={meal.id}
                    className="card"
                    style={{
                      padding: '14px',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      marginBottom: '0',
                      border: meal.logged ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
                      background: meal.logged ? 'rgba(198, 255, 0, 0.04)' : 'var(--bg-card)'
                    }}
                  >
                    <img 
                      src={meal.image} 
                      alt={meal.name}
                      style={{ width: '74px', height: '74px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-lime)', textTransform: 'uppercase' }}>
                          {meal.tag || `${meal.type} • ${meal.time}`}
                        </span>
                        {meal.prepTime && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            • ⏱️ {meal.prepTime}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.2 }}>
                        {meal.name}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span>🔥 <b>{meal.kcal}</b> kcal</span>
                        <span>💪 <b>{meal.protein}g</b> P</span>
                        <span>🌾 <b>{meal.carbs}g</b> C</span>
                        <span>🥑 <b>{meal.fat}g</b> F</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMealLog(meal.id)}
                      className={meal.logged ? 'btn-primary' : 'btn-secondary'}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.74rem',
                        width: 'auto',
                        minWidth: '70px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {meal.logged ? <Check size={14} /> : <Plus size={14} />}
                      {meal.logged ? 'Logged' : 'Log'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

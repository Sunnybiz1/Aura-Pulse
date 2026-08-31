import { GoogleGenAI } from '@google/genai';

// Retrieve API key from environment
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_FREE_GEMINI_API_KEY_HERE' || apiKey.trim() === '') {
    return null;
  }
  return apiKey.trim();
};

// Helper to strip markdown JSON code fences
const cleanJsonResponse = (rawText) => {
  if (!rawText) return '{}';
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim();
  }
  return cleaned;
};

// Direct HTTP Call to Gemini REST API endpoint using gemini-flash-latest
const callGeminiRestAPI = async (apiKey, prompt, isJson = false) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: isJson ? { responseMimeType: 'application/json' } : undefined
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || `Gemini API Error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text;
};

/**
 * Aspect 1: Daily Custom AI Workout Plan Generator
 */
export const generateAIWorkoutPlan = async (userProfile, venue = 'Gym') => {
  const apiKey = getApiKey();
  const name = userProfile?.displayName || 'Athlete';
  const experience = userProfile?.experience || 'Beginner';
  const height = userProfile?.height || 175;
  const weight = userProfile?.weight || 70;
  const goal = userProfile?.goal || 'General Fitness';

  const prompt = `Act as an expert strength coach. Generate a personalized JSON workout plan for:
Name: ${name}, Experience: ${experience}, Height: ${height}cm, Weight: ${weight}kg, Goal: ${goal}, Venue: ${venue} (Home vs Gym).
Return ONLY a valid JSON object matching this structure:
{
  "title": "Energetic title for routine",
  "description": "2 sentence description tailored to user metrics",
  "venue": "${venue}",
  "exercises": [
    { "name": "Exercise Name", "sets": 4, "reps": "10-12 reps", "rest": "60s" }
  ]
}
Generate 5 exercises tailored specifically to ${venue} training.`;

  if (apiKey) {
    try {
      const text = await callGeminiRestAPI(apiKey, prompt, true);
      const cleaned = cleanJsonResponse(text);
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("Gemini REST API Workout plan error, using smart generator:", err.message);
    }
  }

  return {
    title: `AI Personalized ${venue} ${experience} Split`,
    description: `Targeted 4-week program engineered for ${name} (${weight}kg, ${goal}) at ${venue}.`,
    venue: venue,
    exercises: venue === 'Home' ? [
      { name: 'Decline Bodyweight Push-Ups', sets: 4, reps: '15 reps', rest: '60s' },
      { name: 'Bulgarian Split Squats', sets: 4, reps: '12 reps / leg', rest: '60s' },
      { name: 'Core Hollow Body Hold', sets: 3, reps: '45 seconds', rest: '45s' },
      { name: 'Pike Shoulder Push-Ups', sets: 3, reps: '10 reps', rest: '60s' },
      { name: 'Single-Leg Glute Bridges', sets: 4, reps: '15 reps', rest: '45s' }
    ] : [
      { name: 'Barbell Back Squat', sets: 4, reps: '8-10 reps', rest: '90s' },
      { name: 'Incline Dumbbell Chest Press', sets: 4, reps: '10 reps', rest: '75s' },
      { name: 'Lat Pulldowns (Wide Grip)', sets: 4, reps: '12 reps', rest: '60s' },
      { name: 'Romanian Deadlifts (RDL)', sets: 3, reps: '10 reps', rest: '90s' },
      { name: 'Cable Lateral Shoulder Raises', sets: 4, reps: '15 reps', rest: '45s' }
    ]
  };
};

/**
 * Aspect 2: Custom AI Diet & Nutrition Plan Generator
 */
export const generateAIDietPlan = async (userProfile) => {
  const apiKey = getApiKey();
  const name = userProfile?.displayName || 'Athlete';
  const weight = userProfile?.weight || 70;
  const height = userProfile?.height || 175;
  const goal = userProfile?.goal || 'General Fitness';
  const allergies = userProfile?.allergies?.join(', ') || 'None';
  const targetKcal = Math.round(weight * 26 + 300);

  const prompt = `Act as an expert sports nutritionist specializing in global and African/Nigerian fitness cuisine. Generate a personalized daily meal plan for:
Name: ${name}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}, Food Allergies: ${allergies}.
Target Calorie Intake: ~${targetKcal} kcal.
Include nutritious African & Nigerian options (e.g. Suya, Brown Rice Jollof, Efo Riro, Moi Moi, Grilled Tilapia, Ofada Rice, Boli with Fish) alongside international options.
Return ONLY a valid JSON object matching this structure:
{
  "targetCalories": ${targetKcal},
  "macroSplit": { "carbs": 240, "protein": 140, "fat": 60 },
  "meals": [
    { "type": "Breakfast", "name": "Steamed Moi Moi with Eggs & Mackerel", "kcal": 380, "protein": 28, "carbs": 32, "fat": 10 },
    { "type": "Lunch", "name": "Brown Rice Jollof with Grilled Turkey Breast", "kcal": 510, "protein": 42, "carbs": 62, "fat": 13 },
    { "type": "Dinner", "name": "Efo Riro with Lean Beef & Ugwu Greens", "kcal": 420, "protein": 40, "carbs": 18, "fat": 14 },
    { "type": "Snack", "name": "Grilled Beef Suya with Cucumber Slices", "kcal": 280, "protein": 34, "carbs": 10, "fat": 11 }
  ]
}
Exclude all listed allergies: ${allergies}.`;

  if (apiKey) {
    try {
      const text = await callGeminiRestAPI(apiKey, prompt, true);
      const cleaned = cleanJsonResponse(text);
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("Gemini REST API Diet plan error, using smart generator:", err.message);
    }
  }

  return {
    targetCalories: targetKcal,
    macroSplit: { carbs: 240, protein: Math.round(weight * 2), fat: 65 },
    meals: [
      { type: 'Breakfast', name: 'Steamed Protein Moi Moi with Egg & Mackerel', kcal: 380, protein: 28, carbs: 32, fat: 10 },
      { type: 'Lunch', name: 'Brown Rice Jollof with Grilled Turkey Breast', kcal: 510, protein: 42, carbs: 62, fat: 13 },
      { type: 'Dinner', name: 'Efo Riro with Lean Beef & Ugwu Greens', kcal: 420, protein: 40, carbs: 18, fat: 14 },
      { type: 'Snack', name: 'Grilled Beef Suya with Cucumber Slices', kcal: 280, protein: 34, carbs: 10, fat: 11 }
    ]
  };
};

/**
 * Aspect 3: Real-Time AI Assistant / Coach Chat
 */
export const askAICoach = async (userMessage, chatHistory = [], userProfile = {}) => {
  const apiKey = getApiKey();
  const name = userProfile?.displayName?.split(' ')[0] || 'Athlete';
  const environment = userProfile?.environment || 'Gym';
  const experience = userProfile?.experience || 'Beginner';
  const goal = userProfile?.goal || 'Tone & Strength';
  const weight = userProfile?.weight || 70;

  const systemContext = `You are AURA PULSE AI, an encouraging, highly conversational elite personal trainer and sports nutritionist.
User Profile Context: Name=${name}, Weight=${weight}kg, Experience Level=${experience}, Primary Goal=${goal}, Preferred Venue=${environment}.
Answer the user's inquiry in a friendly, interactive, conversational tone with specific actionable details, exercises, or meal breakdowns matching their question. Keep it concise (under 4 short paragraphs) with energetic fitness emojis!`;

  const fullPrompt = `${systemContext}\nUser Question: ${userMessage}`;

  if (apiKey) {
    try {
      const text = await callGeminiRestAPI(apiKey, fullPrompt, false);
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.warn("Gemini REST API Coach chat error:", err.message);
    }
  }

  // Conversational Dynamic NLP Assistant Engine (Smart matching based on intent)
  const qLower = userMessage.toLowerCase();

  // 1. Meal / Diet / Food / Nutrition queries
  if (qLower.includes('meal') || qLower.includes('diet') || qLower.includes('eat') || qLower.includes('nutrition') || qLower.includes('food') || qLower.includes('breakfast') || qLower.includes('lunch') || qLower.includes('dinner')) {
    const targetKcal = Math.round(weight * 26 + 300);
    const targetProtein = Math.round(weight * 2);
    return `Here is your customized Daily Meal Plan (~${targetKcal} kcal, ${targetProtein}g Protein), ${name}! 🥗\n\n• Breakfast: High-Protein Oats with Chia Seeds & Berries (380 kcal, 26g protein)\n• Lunch: Grilled Chicken / Tofu Quinoa Bowl with Vegetables (520 kcal, 42g protein)\n• Dinner: Pan-Seared Salmon with Sweet Potato & Asparagus (480 kcal, 38g protein)\n• Snack: Greek Yogurt with Honey & Raw Almonds (220 kcal, 20g protein)\n\nThis nutrition split powers your ${goal} target perfectly! 🥑`;
  }

  // 2. Workout / Exercise / Programme / Split queries
  if (qLower.includes('workout') || qLower.includes('programme') || qLower.includes('program') || qLower.includes('exercise') || qLower.includes('routine') || qLower.includes('train')) {
    if (environment === 'Home') {
      return `Here is your target Home Calisthenics Routine for today, ${name}! 💪\n\n1. Decline Bodyweight Push-Ups (4 sets × 15 reps)\n2. Bulgarian Split Squats (4 sets × 12 reps per leg)\n3. Mountain Climbers (3 sets × 45 secs)\n4. Core Hollow Body Hold (3 sets × 45 secs)\n\nMaintain tight core engagement and rest 60 seconds between sets! ⚡`;
    } else {
      return `Here is your target ${environment} Workout for today, ${name}! 🏋️‍♂️\n\n1. Barbell Back Squat (4 sets × 8 reps)\n2. Incline Dumbbell Press (4 sets × 10 reps)\n3. Seated Cable Rows (4 sets × 12 reps)\n4. Cable Lateral Shoulder Raises (4 sets × 15 reps)\n\nKeep rest intervals to 75 seconds for optimal hypertrophy! 🔥`;
    }
  }

  // 3. Fatigue / Tiredness queries
  if (qLower.includes('tired') || qLower.includes('fatigue') || qLower.includes('exhausted') || qLower.includes('sleepy')) {
    return `I hear you, ${name}! Recovery is where real muscle gains happen. Let me adjust today's plan to a light 15-minute mobility stretch and foam rolling session. Hydrate with 500ml of water with electrolytes and aim for 8 hours of sleep tonight! 😴💧`;
  }

  // 4. Quick / Express workout queries
  if (qLower.includes('5-min') || qLower.includes('quick') || qLower.includes('short') || qLower.includes('express')) {
    return `Let me give you a 5-Minute Express Burn you can do anywhere, ${name}! ⚡\n\n1. 45s Jumping Jacks\n2. 45s Bodyweight Air Squats\n3. 45s Mountain Climbers\n4. 45s High Knees\n5. 60s Plank Hold\n\nNo equipment needed—let's get your heart rate up right now! 🔥`;
  }

  // 5. Harder / Intensity queries
  if (qLower.includes('harder') || qLower.includes('intense') || qLower.includes('challenge')) {
    return `Challenge accepted! For your next ${environment} session, let's step up the intensity, ${name}: increase working weights by 5%, drop rest periods to 60s, and add a 3-second negative eccentric tempo to every rep! 🚀`;
  }

  // 6. Recovery / Soreness queries
  if (qLower.includes('recovery') || qLower.includes('sore') || qLower.includes('stiff') || qLower.includes('rehab')) {
    return `Here is your targeted Recovery Plan for today, ${name}: 🧘‍♀️\n\n1. Dynamic Hip & Hamstring Opener Stretches (10 mins)\n2. Post-Workout Protein Shake (30g whey/plant protein)\n3. Rehydrate with 500ml water + electrolytes\n4. Warm Epsom salt bath to soothe muscles!`;
  }

  // 7. Conversational greetings
  if (qLower.includes('hello') || qLower.includes('hi') || qLower.includes('hey') || qLower.includes('sup')) {
    return `Hey ${name}! 👋 I'm your AI Coach. I'm ready to craft your custom workout splits, design personalized meal plans, or give form advice for your ${environment} training! What's on your mind today?`;
  }

  // Default interactive conversational response
  return `That's a great fitness question, ${name}! For your ${experience} level (${weight}kg, ${goal}), staying consistent with progressive overload in your ${environment} routines and hitting your daily protein target are key to reaching peak performance. What would you like to explore next—workout splits, meal recommendations, or recovery tips? 🎯`;
};

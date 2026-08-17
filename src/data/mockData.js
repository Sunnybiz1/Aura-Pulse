export const INITIAL_PROGRAMS = [
  {
    id: 'starter_fullbody',
    name: '3-Day Executive Strength (Starter)',
    description: 'Designed for busy professionals. 3 efficient 45-minute sessions per week for maximum muscle and strength density.',
    difficulty: 'Intermediate',
    isPremium: false,
    workoutCount: 3,
    workouts: [
      {
        id: 'fb_a',
        name: 'Workout A: Upper Push & Lower Pull',
        estimatedDuration: '45 mins',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '6-8', restTime: '90s', notes: 'Maintain tight scapular retraction.' },
          { name: 'Barbell Deadlift', sets: 3, reps: '5', restTime: '120s', notes: 'Hinge cleanly, keep spine neutral.' },
          { name: 'Overhead Dumbbell Press', sets: 3, reps: '8-10', restTime: '60s', notes: 'Control the eccentric phase.' },
          { name: 'Leg Extensions', sets: 3, reps: '12-15', restTime: '60s', notes: 'Squeeze at top peak contraction.' }
        ]
      },
      {
        id: 'fb_b',
        name: 'Workout B: Upper Pull & Lower Push',
        estimatedDuration: '45 mins',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', restTime: '120s', notes: 'Depth below parallel.' },
          { name: 'Lat Pulldowns / Pull-Ups', sets: 4, reps: '8-10', restTime: '90s', notes: 'Pull chest up to bar.' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restTime: '60s', notes: 'Full stretch at bottom.' },
          { name: 'Hamstring Curl Machine', sets: 3, reps: '12', restTime: '60s', notes: 'Slow negative reps.' }
        ]
      },
      {
        id: 'fb_c',
        name: 'Workout C: Full Body Hypertrophy Finisher',
        estimatedDuration: '40 mins',
        exercises: [
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', restTime: '90s', notes: 'Feel deep hamstring stretch.' },
          { name: 'Dumbbell Bent-Over Row', sets: 3, reps: '10-12', restTime: '60s', notes: 'Drive elbows to hips.' },
          { name: 'Standing Calf Raises', sets: 4, reps: '15-20', restTime: '45s', notes: 'Pause 2s at bottom.' },
          { name: 'Plank Holds', sets: 3, reps: '60s', restTime: '45s', notes: 'Brace core hard.' }
        ]
      }
    ]
  },
  {
    id: 'ppl_hypertrophy',
    name: 'Push / Pull / Legs Hypertrophy',
    description: 'High volume hypertrophy split tailored for optimal muscle hypertrophy and muscle symmetry.',
    difficulty: 'Advanced',
    isPremium: true,
    workoutCount: 4,
    workouts: [
      {
        id: 'push_1',
        name: 'Push Focus: Heavy Chest & Shoulders',
        estimatedDuration: '55 mins',
        exercises: [
          { name: 'Incline Barbell Press', sets: 4, reps: '6-8', restTime: '90s', notes: 'Focus on upper chest contraction.' },
          { name: 'Dumbbell Shoulder Press', sets: 4, reps: '8-10', restTime: '90s', notes: 'Keep elbows slightly tucked.' }
        ]
      }
    ]
  },
  {
    id: 'time_saver_20',
    name: '20-Minute High-Intensity Express',
    description: 'Ultra-fast compound density supersets for maximum calorie burn and hypertrophy when short on time.',
    difficulty: 'Beginner to Advanced',
    isPremium: true,
    workoutCount: 3,
    workouts: []
  },
  {
    id: 'athletic_power',
    name: 'Athletic Explosive Power',
    description: 'Unilateral movements, plyometrics, and core stability for rotational power and athleticism.',
    difficulty: 'Advanced',
    isPremium: true,
    workoutCount: 4,
    workouts: []
  }
];

export const INITIAL_LOGS = [
  {
    id: 'log_1',
    userId: 'demo_user_123',
    programId: 'starter_fullbody',
    workoutId: 'fb_a',
    workoutName: 'Workout A: Upper Push & Lower Pull',
    date: '2026-07-10',
    weightLiftedTotal: 4200,
    durationMinutes: 42,
    notes: 'Felt strong on bench press today.',
    completedSets: [
      { exerciseName: 'Barbell Bench Press', setNumber: 1, reps: 8, weight: 185 },
      { exerciseName: 'Barbell Bench Press', setNumber: 2, reps: 8, weight: 195 },
      { exerciseName: 'Barbell Bench Press', setNumber: 3, reps: 6, weight: 205 },
      { exerciseName: 'Barbell Deadlift', setNumber: 1, reps: 5, weight: 275 },
      { exerciseName: 'Barbell Deadlift', setNumber: 2, reps: 5, weight: 295 },
      { exerciseName: 'Barbell Deadlift', setNumber: 3, reps: 5, weight: 315 }
    ]
  },
  {
    id: 'log_2',
    userId: 'demo_user_123',
    programId: 'starter_fullbody',
    workoutId: 'fb_b',
    workoutName: 'Workout B: Upper Pull & Lower Push',
    date: '2026-07-12',
    weightLiftedTotal: 4850,
    durationMinutes: 44,
    notes: 'Hit a new PR on back squats!',
    completedSets: [
      { exerciseName: 'Barbell Back Squat', setNumber: 1, reps: 8, weight: 225 },
      { exerciseName: 'Barbell Back Squat', setNumber: 2, reps: 8, weight: 245 },
      { exerciseName: 'Barbell Back Squat', setNumber: 3, reps: 6, weight: 265 },
      { exerciseName: 'Lat Pulldowns', setNumber: 1, reps: 10, weight: 150 },
      { exerciseName: 'Lat Pulldowns', setNumber: 2, reps: 10, weight: 160 }
    ]
  },
  {
    id: 'log_3',
    userId: 'demo_user_123',
    programId: 'starter_fullbody',
    workoutId: 'fb_a',
    workoutName: 'Workout A: Upper Push & Lower Pull',
    date: '2026-07-15',
    weightLiftedTotal: 5100,
    durationMinutes: 45,
    notes: 'Bench press moving smoothly.',
    completedSets: [
      { exerciseName: 'Barbell Bench Press', setNumber: 1, reps: 8, weight: 195 },
      { exerciseName: 'Barbell Bench Press', setNumber: 2, reps: 8, weight: 205 },
      { exerciseName: 'Barbell Bench Press', setNumber: 3, reps: 7, weight: 215 },
      { exerciseName: 'Barbell Deadlift', setNumber: 1, reps: 5, weight: 305 },
      { exerciseName: 'Barbell Deadlift', setNumber: 2, reps: 5, weight: 325 }
    ]
  },
  {
    id: 'log_4',
    userId: 'demo_user_123',
    programId: 'starter_fullbody',
    workoutId: 'fb_b',
    workoutName: 'Workout B: Upper Pull & Lower Push',
    date: '2026-07-18',
    weightLiftedTotal: 5400,
    durationMinutes: 41,
    notes: 'Crushed legs session.',
    completedSets: [
      { exerciseName: 'Barbell Back Squat', setNumber: 1, reps: 8, weight: 235 },
      { exerciseName: 'Barbell Back Squat', setNumber: 2, reps: 8, weight: 255 },
      { exerciseName: 'Barbell Back Squat', setNumber: 3, reps: 6, weight: 275 }
    ]
  }
];

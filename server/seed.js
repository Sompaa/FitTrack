// Combined FitTrack seed — English demo data + Szeged Hungarian data
// Run: npm run seed  (from the server directory or via package.json script)
const mongoose = require('mongoose');
const Workout    = require('./src/models/Workout');
const Recipe     = require('./src/models/Recipe');
const User       = require('./src/models/User');
const WeightLog  = require('./src/models/WeightLog');
const WorkoutLog = require('./src/models/WorkoutLog');
const Location   = require('./src/models/Location');
const FitnessGoal = require('./src/models/FitnessGoal');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack')
  .then(async () => {
    console.log('MongoDB connected for seeding');
    await seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ============================================================
// HELPERS
// ============================================================
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function generateWeightLogs(userId, startWeight, height, lossPerDay) {
  const logs = [];
  for (let ago = 30; ago >= 0; ago--) {
    const date = new Date();
    date.setDate(date.getDate() - ago);
    date.setHours(7, 0, 0, 0);
    const weight = +(startWeight - lossPerDay * (30 - ago)).toFixed(1);
    const bmi = +(weight / Math.pow(height / 100, 2)).toFixed(1);
    logs.push({ userId, weight, bmi, date, measurementTime: 'morning',
      notes: ago === 30 ? 'Starting measurement' : '' });
  }
  return logs;
}

function generateWorkoutLogs(userId, workoutRefs) {
  const activeDays = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29];
  return activeDays.map((ago, i) => {
    const date = new Date();
    date.setDate(date.getDate() - ago);
    date.setHours(18, 0, 0, 0);
    const w = workoutRefs[i % workoutRefs.length];
    return {
      userId,
      workoutId: w.id,
      date,
      duration: w.duration + Math.floor(Math.random() * 10 - 5),
      caloriesBurned: w.calories + Math.floor(Math.random() * 40 - 20),
      perceivedEffort: 5 + Math.floor(Math.random() * 4),
      completed: true,
    };
  });
}

// Convert opening-hours to Map-of-String for the Location model.
// Handles three input shapes:
//   {monday:{open,close}, ...}  → "HH:MM-HH:MM" per day
//   {monday: null, ...}         → "Closed" for that day
//   "szabadtéri, ingyenes" etc  → all days "00:00-23:59" (always open)
function convertHours(raw) {
  const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  if (!raw) return {};
  if (typeof raw === 'string') {
    const result = {};
    DAYS.forEach(d => { result[d] = '00:00-23:59'; });
    return result;
  }
  const result = {};
  for (const [day, val] of Object.entries(raw)) {
    result[day] = (val && val.open && val.close) ? `${val.open}-${val.close}` : 'Closed';
  }
  return result;
}

// ============================================================
// 1. DEMO USERS (3) — proper bcrypt via User.create
// ============================================================
const DEMO_USERS = [
  { name: 'Admin User',  username: 'admin',       email: 'admin@fittrack.com',
    password: 'password123', isAdmin: true,  fitnessLevel: 'advanced',
    height: 178, currentWeight: 75, goalWeight: 72, gender: 'male',
    dateOfBirth: new Date('1990-03-15') },
  { name: 'Alex Johnson', username: 'alexjohnson', email: 'demo1@fittrack.com',
    password: 'password123', isAdmin: false, fitnessLevel: 'intermediate',
    height: 175, currentWeight: 80, goalWeight: 72, gender: 'male',
    dateOfBirth: new Date('1995-06-20') },
  { name: 'Sam Rivera',   username: 'samrivera',   email: 'demo2@fittrack.com',
    password: 'password123', isAdmin: false, fitnessLevel: 'beginner',
    height: 165, currentWeight: 70, goalWeight: 63, gender: 'female',
    dateOfBirth: new Date('1998-11-08') },
];

// ============================================================
// 2. HUNGARIAN USERS (10) — inserted with pre-hashed placeholders
//    (these are demo-only; they cannot be logged into)
// ============================================================
const HU_USERS = [
  { name: 'Kovacs Peter',  username: 'kovacs_peter',  email: 'kovacs.peter@gmail.com',
    password: '$2b$10$KOVACSpeterDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 182, currentWeight: 88, goalWeight: 80, gender: 'male',
    fitnessLevel: 'intermediate', dateOfBirth: new Date('1995-03-14') },
  { name: 'Nagy Anna',     username: 'nagy_anna',      email: 'nagy.anna@freemail.hu',
    password: '$2b$10$NAGYannaDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 165, currentWeight: 62, goalWeight: 58, gender: 'female',
    fitnessLevel: 'beginner', dateOfBirth: new Date('1998-07-22') },
  { name: 'Toth Balazs',   username: 'toth_balazs',   email: 'toth.balazs@citromail.hu',
    password: '$2b$10$TOTHbalazssDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 178, currentWeight: 75, goalWeight: 78, gender: 'male',
    fitnessLevel: 'advanced', dateOfBirth: new Date('1993-11-05') },
  { name: 'Szabo Eszter',  username: 'szabo_eszter',  email: 'szabo.eszter@szeged.hu',
    password: '$2b$10$SZABOeszterDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 170, currentWeight: 67, goalWeight: 63, gender: 'female',
    fitnessLevel: 'intermediate', dateOfBirth: new Date('2000-01-30') },
  { name: 'Horvath Gabor', username: 'horvath_gabor', email: 'horvath.gabor@sze.hu',
    password: '$2b$10$HORVATHgaborDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 185, currentWeight: 95, goalWeight: 85, gender: 'male',
    fitnessLevel: 'beginner', dateOfBirth: new Date('1990-06-18') },
  { name: 'Kiss Reka',     username: 'kiss_reka',     email: 'kiss.reka@gmail.com',
    password: '$2b$10$KISSrekaDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 160, currentWeight: 55, goalWeight: 53, gender: 'female',
    fitnessLevel: 'intermediate', dateOfBirth: new Date('2002-09-12') },
  { name: 'Varga Zoltan',  username: 'varga_zoltan',  email: 'varga.zoltan@freemail.hu',
    password: '$2b$10$VARGAzoltanDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 175, currentWeight: 82, goalWeight: 75, gender: 'male',
    fitnessLevel: 'advanced', dateOfBirth: new Date('1988-04-27') },
  { name: 'Molnar Judit',  username: 'molnar_judit',  email: 'molnar.judit@citromail.hu',
    password: '$2b$10$MOLNARjuditDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 168, currentWeight: 70, goalWeight: 65, gender: 'female',
    fitnessLevel: 'beginner', dateOfBirth: new Date('1996-12-03') },
  { name: 'Farkas Adam',   username: 'farkas_adam',   email: 'farkas.adam@szeged.hu',
    password: '$2b$10$FARKASadamDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 180, currentWeight: 78, goalWeight: 80, gender: 'male',
    fitnessLevel: 'intermediate', dateOfBirth: new Date('1997-08-15') },
  { name: 'Nemeth Kata',   username: 'nemeth_kata',   email: 'nemeth.kata@sze.hu',
    password: '$2b$10$NEMETHkataDemoHashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    height: 162, currentWeight: 59, goalWeight: 56, gender: 'female',
    fitnessLevel: 'advanced', dateOfBirth: new Date('2001-05-20') },
];

// ============================================================
// 3. WORKOUTS (24 English + 10 Hungarian = 34 total)
// ============================================================
const EN_WORKOUTS = [
  {
    name: 'Beginner Indoor Full Body Workout',
    description: 'Perfect for those with higher BMI, focuses on low-impact exercises that are gentle on joints',
    difficulty: 'beginner', duration: 25, type: 'mixed', equipment: ['none'],
    exercises: [
      { name: 'Chair Squats', sets: 3, reps: 10, description: 'Stand in front of a chair, lower yourself as if sitting, then stand up' },
      { name: 'Wall Push-ups', sets: 3, reps: 8, description: 'Stand arms length from wall, lean in and push back' },
      { name: 'Seated Leg Raises', sets: 3, reps: 12, description: 'Sit in chair, raise one leg at a time' },
      { name: 'Arm Circles', duration: 60, description: 'Stand and rotate arms in circles' },
      { name: 'Gentle Stretching', duration: 300, description: 'Full body stretching routine' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true }, indoorOutdoor: 'indoor', caloriesBurned: 150,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop'
  },
  {
    name: 'Morning Gentle Yoga',
    description: 'Wake up your body with gentle stretches and breathing exercises',
    difficulty: 'beginner', duration: 20, type: 'flexibility', equipment: ['mat'],
    exercises: [
      { name: 'Cat-Cow Stretch', sets: 10, description: 'Alternate arching and rounding spine on hands and knees' },
      { name: "Child's Pose", duration: 60, description: 'Resting pose, knees bent, arms forward' },
      { name: 'Gentle Spinal Twist', sets: 5, description: 'Lying on back, bring knees to one side' },
      { name: 'Seated Forward Fold', duration: 60, description: 'Sit and reach for toes' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true }, indoorOutdoor: 'both', caloriesBurned: 100,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
  },
  {
    name: 'Walking for Beginners',
    description: 'Low-impact cardio perfect for starting your fitness journey',
    difficulty: 'beginner', duration: 30, type: 'cardio', equipment: ['none'],
    exercises: [
      { name: 'Warm-up Walk', duration: 300, description: 'Walk at comfortable pace' },
      { name: 'Brisk Walking', duration: 1200, description: 'Increase pace slightly' },
      { name: 'Cool-down', duration: 300, description: 'Slow walking and stretches' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true }, indoorOutdoor: 'outdoor', caloriesBurned: 180,
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop'
  },
  {
    name: 'Chair Exercises for Seniors',
    description: 'Safe and effective exercises done while seated',
    difficulty: 'beginner', duration: 20, type: 'strength', equipment: ['none'],
    exercises: [
      { name: 'Seated Marching', sets: 3, reps: 20, description: 'Lift knees alternately while seated' },
      { name: 'Arm Raises', sets: 3, reps: 15, description: 'Raise arms overhead while seated' },
      { name: 'Ankle Circles', sets: 2, reps: 10, description: 'Rotate ankles in circles' },
      { name: 'Shoulder Rolls', sets: 3, reps: 10, description: 'Roll shoulders forward and back' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true }, indoorOutdoor: 'indoor', caloriesBurned: 90,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop'
  },
  {
    name: 'Swimming for Fitness',
    description: 'Full-body low-impact workout in the pool',
    difficulty: 'beginner', duration: 30, type: 'cardio', equipment: ['none'],
    exercises: [
      { name: 'Water Walking', duration: 300, description: 'Walk in chest-deep water' },
      { name: 'Easy Swimming', duration: 1200, description: 'Swim at comfortable pace' },
      { name: 'Pool Stretches', duration: 300, description: 'Gentle stretches in water' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true }, indoorOutdoor: 'indoor', caloriesBurned: 250,
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop'
  },
  {
    name: 'Intermediate Running Program',
    description: 'Interval running program for weight loss and cardiovascular health',
    difficulty: 'intermediate', duration: 40, type: 'cardio', equipment: ['none'],
    exercises: [
      { name: 'Warm-up Walk', duration: 300, description: 'Walk at comfortable pace' },
      { name: 'Run/Walk Intervals', sets: 10, description: '1 min run, 2 min walk' },
      { name: 'Cool-down Walk', duration: 300, description: 'Slow walking' },
      { name: 'Stretching', duration: 300, description: 'Leg and hip stretches' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 29.9, jointFriendly: false }, indoorOutdoor: 'outdoor', caloriesBurned: 350,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop'
  },
  {
    name: 'Strength Training with Dumbbells',
    description: 'Build muscle and strength with basic dumbbell exercises',
    difficulty: 'intermediate', duration: 45, type: 'strength', equipment: ['dumbbells'],
    exercises: [
      { name: 'Bicep Curls', sets: 3, reps: 12, description: 'Curl dumbbells to shoulders' },
      { name: 'Shoulder Press', sets: 3, reps: 10, description: 'Press dumbbells overhead' },
      { name: 'Bent-over Rows', sets: 3, reps: 12, description: 'Row dumbbells to chest' },
      { name: 'Goblet Squats', sets: 3, reps: 15, description: 'Squat holding dumbbell at chest' },
      { name: 'Lunges', sets: 3, reps: 10, description: 'Step forward and lower body' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: false }, indoorOutdoor: 'indoor', caloriesBurned: 280,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop'
  },
  {
    name: 'Cycling Workout',
    description: 'Outdoor cycling for endurance and leg strength',
    difficulty: 'intermediate', duration: 50, type: 'cardio', equipment: ['none'],
    exercises: [
      { name: 'Easy Ride', duration: 600, description: 'Warm up at easy pace' },
      { name: 'Hill Intervals', sets: 6, duration: 120, description: 'Moderate hills' },
      { name: 'Flat Recovery', duration: 600, description: 'Easy flat riding' },
      { name: 'Cool Down', duration: 600, description: 'Easy pace to finish' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true }, indoorOutdoor: 'outdoor', caloriesBurned: 450,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
  },
  {
    name: 'Bodyweight Circuit Training',
    description: 'No equipment needed full-body workout',
    difficulty: 'intermediate', duration: 35, type: 'mixed', equipment: ['none'],
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 15, description: 'Standard push-ups' },
      { name: 'Squats', sets: 3, reps: 20, description: 'Bodyweight squats' },
      { name: 'Plank', sets: 3, duration: 45, description: 'Hold plank position' },
      { name: 'Jumping Jacks', sets: 3, reps: 30, description: 'Classic jumping jacks' },
      { name: 'Mountain Climbers', sets: 3, duration: 30, description: 'Fast pace' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 30, jointFriendly: false }, indoorOutdoor: 'both', caloriesBurned: 320,
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop'
  },
  {
    name: 'Pilates Core Workout',
    description: 'Strengthen your core with controlled movements',
    difficulty: 'intermediate', duration: 30, type: 'strength', equipment: ['mat'],
    exercises: [
      { name: 'The Hundred', sets: 1, reps: 100, description: 'Pulse arms while holding legs elevated' },
      { name: 'Roll Up', sets: 10, description: 'Slow controlled sit-up' },
      { name: 'Single Leg Circles', sets: 10, description: 'Draw circles with leg' },
      { name: 'Criss Cross', sets: 20, description: 'Bicycle abs movement' },
      { name: 'Plank to Pike', sets: 12, description: 'Plank position to downward dog' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true }, indoorOutdoor: 'indoor', caloriesBurned: 200,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop'
  },
  {
    name: 'Vinyasa Flow Yoga',
    description: 'Dynamic yoga practice linking breath with movement',
    difficulty: 'intermediate', duration: 45, type: 'flexibility', equipment: ['mat'],
    exercises: [
      { name: 'Sun Salutations', sets: 5, description: 'Complete flow sequence' },
      { name: 'Warrior Sequence', sets: 3, description: 'Warrior I, II, and III' },
      { name: 'Balance Poses', sets: 3, duration: 30, description: 'Tree pose and eagle pose' },
      { name: 'Hip Openers', duration: 300, description: 'Pigeon pose and lizard pose' },
      { name: 'Savasana', duration: 300, description: 'Final relaxation' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true }, indoorOutdoor: 'both', caloriesBurned: 240,
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop'
  },
  {
    name: 'Resistance Band Full Body',
    description: 'Use resistance bands for a portable strength workout',
    difficulty: 'intermediate', duration: 40, type: 'strength', equipment: ['resistance-band'],
    exercises: [
      { name: 'Band Squats', sets: 3, reps: 15, description: 'Stand on band, hold handles at shoulders' },
      { name: 'Band Chest Press', sets: 3, reps: 12, description: 'Press band forward from chest' },
      { name: 'Band Rows', sets: 3, reps: 15, description: 'Pull band to chest' },
      { name: 'Band Shoulder Raises', sets: 3, reps: 12, description: 'Lateral raises with band' },
      { name: 'Band Leg Curls', sets: 3, reps: 15, description: 'Curl leg against band' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true }, indoorOutdoor: 'both', caloriesBurned: 250,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop'
  },
  {
    name: 'Kickboxing Cardio',
    description: 'High-energy cardio with punches and kicks',
    difficulty: 'intermediate', duration: 35, type: 'cardio', equipment: ['none'],
    exercises: [
      { name: 'Jab-Cross Combo', sets: 5, reps: 20, description: 'Punching combinations' },
      { name: 'Front Kicks', sets: 3, reps: 15, description: 'Kick forward with each leg' },
      { name: 'Roundhouse Kicks', sets: 3, reps: 12, description: 'Circular kicks' },
      { name: 'Speed Bag', sets: 3, duration: 60, description: 'Fast punching motion' },
      { name: 'Cool Down Shadow Boxing', duration: 300, description: 'Easy pace combinations' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 30, jointFriendly: false }, indoorOutdoor: 'indoor', caloriesBurned: 380,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop'
  },
  {
    name: 'Step Aerobics',
    description: 'Classic aerobic workout using a step platform',
    difficulty: 'intermediate', duration: 40, type: 'cardio', equipment: ['bench'],
    exercises: [
      { name: 'Basic Step', sets: 5, reps: 20, description: 'Step up and down' },
      { name: 'V-Step', sets: 4, reps: 15, description: 'Step in V pattern' },
      { name: 'Knee Lifts', sets: 4, reps: 20, description: 'Step up with knee raise' },
      { name: 'Grapevine', sets: 3, reps: 15, description: 'Side stepping pattern' },
      { name: 'Cool Down Stretches', duration: 300, description: 'Lower body stretches' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 32, jointFriendly: false }, indoorOutdoor: 'indoor', caloriesBurned: 340,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
  },
  {
    name: 'TRX Suspension Training',
    description: 'Bodyweight resistance training using suspension straps',
    difficulty: 'intermediate', duration: 35, type: 'strength', equipment: ['pull-up-bar'],
    exercises: [
      { name: 'TRX Rows', sets: 3, reps: 12, description: 'Pull body up to straps' },
      { name: 'TRX Chest Press', sets: 3, reps: 12, description: 'Push away from anchor point' },
      { name: 'TRX Squats', sets: 3, reps: 15, description: 'Squat holding straps' },
      { name: 'TRX Pike', sets: 3, reps: 10, description: 'Plank to pike with feet in straps' },
      { name: 'TRX Bicep Curls', sets: 3, reps: 12, description: 'Curl body up' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 30, jointFriendly: false }, indoorOutdoor: 'both', caloriesBurned: 300,
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop'
  },
  {
    name: 'Advanced HIIT Workout',
    description: 'High-intensity interval training for advanced fitness enthusiasts',
    difficulty: 'advanced', duration: 30, type: 'mixed', equipment: ['none'],
    exercises: [
      { name: 'Burpees', sets: 5, reps: 10, description: 'Full body exercise combining squat, plank, and jump' },
      { name: 'Mountain Climbers', sets: 5, duration: 30, description: 'Plank position, alternate bringing knees to chest' },
      { name: 'Jump Squats', sets: 5, reps: 15, description: 'Squat down, then jump explosively' },
      { name: 'High Knees', sets: 5, duration: 30, description: 'Run in place bringing knees high' },
      { name: 'Plank Hold', duration: 60, description: 'Hold plank position' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false }, indoorOutdoor: 'both', caloriesBurned: 450,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop'
  },
  {
    name: 'CrossFit WOD',
    description: 'Workout of the Day - intense functional fitness',
    difficulty: 'advanced', duration: 25, type: 'mixed', equipment: ['dumbbells', 'pull-up-bar'],
    exercises: [
      { name: 'Thrusters', sets: 5, reps: 15, description: 'Squat to overhead press' },
      { name: 'Pull-ups', sets: 5, reps: 10, description: 'Strict pull-ups' },
      { name: 'Box Jumps', sets: 5, reps: 15, description: 'Jump onto elevated surface' },
      { name: 'Kettlebell Swings', sets: 5, reps: 20, description: 'Hip hinge swing' },
      { name: 'Burpee Pull-ups', sets: 3, reps: 10, description: 'Burpee into pull-up' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 27, jointFriendly: false }, indoorOutdoor: 'indoor', caloriesBurned: 500,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop'
  },
  {
    name: 'Marathon Training Long Run',
    description: 'Endurance run for marathon preparation',
    difficulty: 'advanced', duration: 90, type: 'cardio', equipment: ['none'],
    exercises: [
      { name: 'Easy Pace Warm-up', duration: 600, description: 'Light jog to warm up' },
      { name: 'Steady State Run', duration: 4200, description: 'Consistent comfortable pace' },
      { name: 'Negative Split Finish', duration: 900, description: 'Increase pace gradually' },
      { name: 'Walking Cool Down', duration: 600, description: 'Walk and stretch' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false }, indoorOutdoor: 'outdoor', caloriesBurned: 900,
    imageUrl: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&h=400&fit=crop'
  },
  {
    name: 'Olympic Lifting Session',
    description: 'Power and strength with Olympic lifts',
    difficulty: 'advanced', duration: 60, type: 'strength', equipment: ['barbell'],
    exercises: [
      { name: 'Clean and Jerk', sets: 5, reps: 3, description: 'Full Olympic lift' },
      { name: 'Snatch', sets: 5, reps: 3, description: 'Single movement overhead lift' },
      { name: 'Front Squats', sets: 4, reps: 6, description: 'Squat with bar at shoulders' },
      { name: 'Overhead Squats', sets: 3, reps: 8, description: 'Squat with bar overhead' },
      { name: 'Romanian Deadlifts', sets: 3, reps: 10, description: 'Hip hinge movement' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 27, jointFriendly: false }, indoorOutdoor: 'indoor', caloriesBurned: 400,
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop'
  },
  {
    name: 'Plyometric Power Training',
    description: 'Explosive movements for power development',
    difficulty: 'advanced', duration: 40, type: 'mixed', equipment: ['none'],
    exercises: [
      { name: 'Box Jumps', sets: 4, reps: 10, description: 'Jump onto box' },
      { name: 'Broad Jumps', sets: 4, reps: 8, description: 'Jump forward for distance' },
      { name: 'Depth Jumps', sets: 3, reps: 6, description: 'Step off box and jump immediately' },
      { name: 'Clap Push-ups', sets: 3, reps: 10, description: 'Explosive push-up with clap' },
      { name: 'Tuck Jumps', sets: 4, reps: 12, description: 'Jump bringing knees to chest' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false }, indoorOutdoor: 'both', caloriesBurned: 420,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop'
  },
  {
    name: 'Ashtanga Yoga Primary Series',
    description: 'Traditional challenging yoga sequence',
    difficulty: 'advanced', duration: 90, type: 'flexibility', equipment: ['mat'],
    exercises: [
      { name: 'Sun Salutations A & B', sets: 10, description: 'Traditional sequence' },
      { name: 'Standing Poses', duration: 1200, description: 'Full standing sequence' },
      { name: 'Seated Poses', duration: 1800, description: 'Forward folds and twists' },
      { name: 'Finishing Sequence', duration: 900, description: 'Shoulder stand and headstand' },
      { name: 'Savasana', duration: 600, description: 'Final deep relaxation' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 28, jointFriendly: true }, indoorOutdoor: 'both', caloriesBurned: 350,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
  },
  {
    name: 'Triathlon Brick Workout',
    description: 'Bike to run transition training',
    difficulty: 'advanced', duration: 75, type: 'cardio', equipment: ['none'],
    exercises: [
      { name: 'Cycling', duration: 2700, description: '45 min moderate to hard pace' },
      { name: 'Transition', duration: 300, description: 'Quick change to running gear' },
      { name: 'Running', duration: 1200, description: '20 min tempo run' },
      { name: 'Cool Down Jog', duration: 300, description: 'Easy pace recovery' }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false }, indoorOutdoor: 'outdoor', caloriesBurned: 850,
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=400&fit=crop'
  }
];

const HU_WORKOUTS = [
  {
    name: 'Kezdo Teljes Test Edzes',
    description: 'Kezdoknek szolo teljes testes eroedzes alapfelszerelesssel',
    difficulty: 'beginner', duration: 45, type: 'strength', indoorOutdoor: 'indoor',
    equipment: ['dumbbells', 'bench'], caloriesBurned: 280,
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    exercises: [
      { name: 'Guggolas sulyzoval', sets: 3, reps: 12, description: 'Hat egyenes!' },
      { name: 'Fekvenyomas padon', sets: 3, reps: 10, description: 'Lasso ereszedes' },
      { name: 'Evezees gumiszalaggal', sets: 3, reps: 12, description: 'Lapockak osszejarva' },
      { name: 'Plank', sets: 3, duration: 30, description: 'Csipo ne emelkedjen' },
    ]
  },
  {
    name: 'Futas-Alapu Kardio Edzes',
    description: 'Futason alapulo kardio edzes kinti terepen – zsiregeto, allokepesseg-fejleszto',
    difficulty: 'intermediate', duration: 40, type: 'cardio', indoorOutdoor: 'outdoor',
    equipment: [], caloriesBurned: 420,
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: false },
    exercises: [
      { name: 'Bemelegito seta', sets: 1, duration: 300, description: '5 percig' },
      { name: 'Lassu futas', sets: 1, duration: 1200, description: '20 perc, pulzus 130-150' },
      { name: 'Sprint intervallumok', sets: 6, duration: 30, description: 'Max effort, majd 60s seta' },
      { name: 'Levezetes', sets: 1, duration: 300, description: '5 perc seta es nyujtas' },
    ]
  },
  {
    name: 'Halado HIIT – Testzszir Egetes',
    description: 'Haladoknak szolo, nagyon intenziv HIIT edzes maximalis zsiregetessel',
    difficulty: 'advanced', duration: 30, type: 'hiit', indoorOutdoor: 'indoor',
    equipment: ['jump-rope'], caloriesBurned: 500,
    suitableFor: { minBMI: 0, maxBMI: 27, jointFriendly: false },
    exercises: [
      { name: 'Burpee', sets: 4, reps: 15, description: 'Robbanekony' },
      { name: 'Ugroel', sets: 4, duration: 60, description: 'Folyamatosan' },
      { name: 'Mountain Climber', sets: 4, duration: 45, description: 'Mag es kardio' },
      { name: 'Box Jump', sets: 4, reps: 10, description: 'Lagy landolas!' },
    ]
  },
  {
    name: 'Joga – Reggeli Ebreedes',
    description: 'Reggeli joga szekcio, minden szintnek megfelo rugalmassag-fejleszto edzes',
    difficulty: 'beginner', duration: 30, type: 'yoga', indoorOutdoor: 'indoor',
    equipment: ['mat'], caloriesBurned: 120,
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    exercises: [
      { name: 'Nap-udvoezlet', sets: 3, duration: 120, description: 'Surya Namaskar sorozat' },
      { name: 'Lefele nezo kutya', sets: 1, duration: 60, description: 'Hat es vallak nyujtasa' },
      { name: 'Harcos I-II pozok', sets: 2, duration: 90, description: 'Labak es core' },
      { name: 'Savasana', sets: 1, duration: 300, description: 'Piheno poz' },
    ]
  },
  {
    name: 'Uszas Edzes – Allokeepesseg',
    description: 'Medenceben vezett komplex uszas edzes allokepesseg-fejlesztesre',
    difficulty: 'intermediate', duration: 60, type: 'swimming', indoorOutdoor: 'indoor',
    equipment: ['swimming-goggles', 'swimming-cap'], caloriesBurned: 550,
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    exercises: [
      { name: 'Melegito vegyes uszas', sets: 4, reps: 1, description: '4x25m' },
      { name: 'Melluszas', sets: 4, reps: 1, description: '4x50m' },
      { name: 'Gyorsuszas sprint', sets: 6, reps: 1, description: '6x25m sprint' },
      { name: 'Hatuszas', sets: 2, reps: 1, description: '2x100m' },
    ]
  },
  {
    name: 'Felsootest Ero – Halado',
    description: 'Haladoknak szolo felsotestregi eroedzes – izomtomeg novelese a cel',
    difficulty: 'advanced', duration: 60, type: 'strength', indoorOutdoor: 'indoor',
    equipment: ['dumbbells', 'bench', 'pull-up-bar', 'barbell'], caloriesBurned: 380,
    suitableFor: { minBMI: 0, maxBMI: 30, jointFriendly: false },
    exercises: [
      { name: 'Fekvenyomas lapos padon', sets: 5, reps: 5, description: 'Max sulyly, 3 perces szunet' },
      { name: 'Huzodzkodas', sets: 4, reps: 8, description: 'Hat es bicepsz' },
      { name: 'Valnyomas allva', sets: 4, reps: 8, description: 'Vallak' },
      { name: 'Tricepsz nyomas kotelen', sets: 3, reps: 12, description: 'Tricepsz' },
      { name: 'Bicepsz gorgeto', sets: 3, reps: 12, description: 'Bicepsz' },
    ]
  },
  {
    name: 'Terepi Futas – Ujszegedi Liget',
    description: 'Kinti terepi futas az Ujszegedi Ligetben – allokepesseg-fejleszto',
    difficulty: 'intermediate', duration: 50, type: 'cardio', indoorOutdoor: 'outdoor',
    equipment: ['running-shoes', 'water-bottle'], caloriesBurned: 480,
    suitableFor: { minBMI: 0, maxBMI: 32, jointFriendly: false },
    exercises: [
      { name: 'Bemelegito seta', sets: 1, duration: 300, description: 'Lazu seta' },
      { name: 'Kozepes tempou futas', sets: 1, duration: 1800, description: '30 perc egyenletes' },
      { name: 'Dombos terep sprint', sets: 5, duration: 45, description: 'Labak es kardio' },
      { name: 'Levezetes', sets: 1, duration: 300, description: 'Seta es nyujtas' },
    ]
  },
  {
    name: 'Core es Stabilitas Trening',
    description: 'Mag- es stabilizacios edzes hat problemak megelozesere es funktionalis erore',
    difficulty: 'intermediate', duration: 35, type: 'strength', indoorOutdoor: 'both',
    equipment: ['mat', 'resistance-band'], caloriesBurned: 220,
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    exercises: [
      { name: 'Plank variaciok', sets: 3, duration: 45, description: 'Mag edzese' },
      { name: 'Dead Bug', sets: 3, reps: 10, description: 'Mag es csipo' },
      { name: 'Side plank', sets: 3, duration: 30, description: 'Oldalizmok' },
      { name: 'Hid poz', sets: 3, reps: 20, description: 'Farizom es mag' },
    ]
  },
  {
    name: 'Kerekparozas – Tisza-parti Kor',
    description: 'Kellemes Tisza-parti kerekparos kor aktiv pihenes vagy kezdo kardio celobol',
    difficulty: 'beginner', duration: 90, type: 'cardio', indoorOutdoor: 'outdoor',
    equipment: ['bicycle', 'helmet', 'water-bottle'], caloriesBurned: 600,
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    exercises: [
      { name: 'Tisza-parti kerekparozas', sets: 1, duration: 5400, description: '90 perc, korut' },
    ]
  },
  {
    name: 'Teljes Test – Funkcionalis Mozgas',
    description: 'Funkcionalis mozgasformak kettlebellel es gumiszalaggal – kozepes szintu edzoknek',
    difficulty: 'intermediate', duration: 55, type: 'strength', indoorOutdoor: 'both',
    equipment: ['kettlebell', 'resistance-band'], caloriesBurned: 350,
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: false },
    exercises: [
      { name: 'Kettlebell Swing', sets: 4, reps: 15, description: 'Farizom, hat, kardio' },
      { name: 'Gumiszalagos evezees', sets: 3, reps: 12, description: 'Hat' },
      { name: 'Kitoeres guggolassal', sets: 3, reps: 10, description: 'Labak, egyensuly' },
      { name: 'Goblet Squat', sets: 3, reps: 12, description: 'Labak, mag' },
    ]
  },
];

// ============================================================
// 4. LOCATIONS (34 Szeged — 11 corrected originals + 23 real venues)
// ============================================================
const LOCATIONS = [
  // ── Originals with corrected GPS coordinates ──────────────
  {
    name: 'Tisza-parti Futóövezet – Belvárosi szakasz', type: 'trail',
    address: 'Felső Tisza-sor, 6720 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1337, 46.2497] },
    openingHours: convertHours('outdoor'),
    amenities: ['futóösvény', 'padok', 'ivókút', 'kerékpárút'], rating: 4.7
  },
  {
    name: 'Anna-fürdő Szeged', type: 'swimming_pool',
    address: 'Tisza Lajos körút 24, 6720 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1493, 46.2559] }, // corrected
    openingHours: convertHours({ monday: {open:'06:00',close:'20:00'}, tuesday: {open:'06:00',close:'20:00'}, wednesday: {open:'06:00',close:'20:00'}, thursday: {open:'06:00',close:'20:00'}, friday: {open:'06:00',close:'20:00'}, saturday: {open:'08:00',close:'18:00'}, sunday: {open:'08:00',close:'16:00'} }),
    amenities: ['uszoda', 'termálfürdő', 'öltöző', 'szauna', 'parkoló'],
    rating: 4.3, phone: '+36 62 553 940', website: 'https://annafurdo.hu'
  },
  {
    name: 'Széchenyi tér – Városi Park', type: 'park',
    address: 'Széchenyi tér, 6720 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1490, 46.2538] }, // corrected
    openingHours: convertHours('outdoor'),
    amenities: ['szabadtéri fitness', 'padok', 'szökőkút', 'wifi'], rating: 4.5
  },
  {
    name: 'SZTE Sportközpont', type: 'sports_hall',
    address: 'Topolya sor, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1412, 46.2379] }, // corrected
    openingHours: convertHours({ monday: {open:'07:00',close:'21:00'}, tuesday: {open:'07:00',close:'21:00'}, wednesday: {open:'07:00',close:'21:00'}, thursday: {open:'07:00',close:'21:00'}, friday: {open:'07:00',close:'19:00'}, saturday: {open:'09:00',close:'15:00'}, sunday: {open:'10:00',close:'14:00'} }),
    amenities: ['súlyzóterem', 'aerobic terem', 'sportcsarnok', 'öltöző', 'diákkedvezmény'],
    rating: 4.2, phone: '+36 62 544 000', website: 'https://www.u-szeged.hu'
  },
  {
    name: 'Újszegedi Liget és Sportterület', type: 'park',
    address: 'Bertalan utca, 6726 Szeged (Újszeged)',
    coordinates: { type: 'Point', coordinates: [20.1589, 46.2427] },
    openingHours: convertHours('outdoor'),
    amenities: ['focipálya', 'kosárlabda', 'játszótér', 'futópálya', 'ivókút', 'grillhely'], rating: 4.4
  },
  {
    name: 'Szeged Sportcsarnok', type: 'sports_hall',
    address: 'Temesvári krt. 54, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1490, 46.2459] }, // corrected
    openingHours: convertHours({ monday: {open:'08:00',close:'22:00'}, tuesday: {open:'08:00',close:'22:00'}, wednesday: {open:'08:00',close:'22:00'}, thursday: {open:'08:00',close:'22:00'}, friday: {open:'08:00',close:'20:00'}, saturday: {open:'09:00',close:'18:00'}, sunday: {open:'10:00',close:'16:00'} }),
    amenities: ['kosárlabda', 'röplabda', 'tollaslabda', 'öltöző', 'büfé'],
    rating: 4.0, phone: '+36 62 421 080'
  },
  {
    name: 'Pick Aréna Szeged', type: 'sports_hall',
    address: 'Felső Tisza-part 35, 6723 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1742, 46.2589] }, // corrected (~4 km off before)
    openingHours: convertHours({ monday: {open:'08:00',close:'20:00'}, tuesday: {open:'08:00',close:'20:00'}, wednesday: {open:'08:00',close:'20:00'}, thursday: {open:'08:00',close:'20:00'}, friday: {open:'08:00',close:'20:00'}, saturday: {open:'10:00',close:'18:00'}, sunday: null }),
    amenities: ['kézilabda pálya', 'lelátó', 'büfé', 'parkoló', 'akadálymentesített'],
    rating: 4.6, phone: '+36 62 553 960', website: 'https://pickhandball.hu'
  },
  {
    name: 'Szegedi Csónakázó-tó', type: 'outdoor',
    address: 'Maros utca környéke, 6724 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1606, 46.2575] }, // corrected
    openingHours: convertHours('outdoor'),
    amenities: ['evezés', 'kerékpárút', 'horgászat', 'padok', 'zöldterület'], rating: 4.1
  },
  {
    name: 'Dugonics tér – Szabadtéri Fitneszpark', type: 'outdoor',
    address: 'Dugonics tér, 6720 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1449, 46.2507] }, // corrected
    openingHours: convertHours('outdoor'),
    amenities: ['guggolótámasz', 'húzódzkodó', 'párhuzamos rudak', 'padok'], rating: 3.9
  },
  {
    name: 'Arena Fitness and Wellness Szeged', type: 'fitness_center',
    address: 'Kossuth Lajos sugárút 72, 6722 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1502, 46.2548] },
    openingHours: convertHours({ monday: {open:'06:00',close:'22:00'}, tuesday: {open:'06:00',close:'22:00'}, wednesday: {open:'06:00',close:'22:00'}, thursday: {open:'06:00',close:'22:00'}, friday: {open:'06:00',close:'21:00'}, saturday: {open:'08:00',close:'18:00'}, sunday: {open:'09:00',close:'16:00'} }),
    amenities: ['kardió gépek', 'súlyzóterem', 'csoportos órák', 'szauna', 'öltöző', 'parkoló', 'személyi edző'],
    rating: 4.4, phone: '+36 62 420 100'
  },
  {
    name: 'Tisza Fitness Club – Újszeged', type: 'fitness_center',
    address: 'Közép fasor 34, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1623, 46.2442] },
    openingHours: convertHours({ monday: {open:'06:30',close:'21:30'}, tuesday: {open:'06:30',close:'21:30'}, wednesday: {open:'06:30',close:'21:30'}, thursday: {open:'06:30',close:'21:30'}, friday: {open:'06:30',close:'20:00'}, saturday: {open:'09:00',close:'17:00'}, sunday: {open:'10:00',close:'15:00'} }),
    amenities: ['súlygépek', 'szabad súlyok', 'aerobic', 'öltöző', 'szauna'],
    rating: 4.2, phone: '+36 70 315 2244'
  },

  // ── New GPS-verified Szeged venues ────────────────────────
  {
    name: 'Erzsébet-liget', type: 'park',
    address: 'Népkert sor, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1626966, 46.248077] },
    openingHours: convertHours('outdoor'),
    amenities: ['padok', 'sétányok', 'zöldterület', 'szabadtéri kondigépek'], rating: 4.7
  },
  {
    name: 'Vértó', type: 'park',
    address: 'Vértó, 6724 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1443433, 46.2733355] },
    openingHours: convertHours('outdoor'),
    amenities: ['tó', 'sétány', 'zöldterület', 'padok'], rating: 4.7
  },
  {
    name: 'Forma1 Fitnesz', type: 'fitness_center',
    address: 'Attila u. 17-19, 6722 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1419429, 46.2555619] },
    openingHours: convertHours({ monday: {open:'06:00',close:'21:30'}, tuesday: {open:'06:00',close:'21:30'}, wednesday: {open:'06:00',close:'21:30'}, thursday: {open:'06:00',close:'21:30'}, friday: {open:'06:00',close:'21:30'}, saturday: {open:'09:00',close:'20:00'}, sunday: {open:'14:00',close:'20:00'} }),
    amenities: ['konditerem', 'kardió gépek', 'öltöző', 'zuhanyzó'],
    rating: 4.3, phone: '+36 70 320 0488'
  },
  {
    name: 'Global Fitness', type: 'fitness_center',
    address: 'Makkosházi krt. 1, 6723 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1571109, 46.2734548] },
    openingHours: convertHours({ monday: {open:'05:30',close:'23:00'}, tuesday: {open:'05:30',close:'23:00'}, wednesday: {open:'05:30',close:'23:00'}, thursday: {open:'05:30',close:'23:00'}, friday: {open:'05:30',close:'23:00'}, saturday: {open:'05:30',close:'23:00'}, sunday: {open:'05:30',close:'23:00'} }),
    amenities: ['konditerem', 'csoportos órák', 'öltöző', 'szauna', 'büfé'],
    rating: 4.8, phone: '+36 20 262 8141'
  },
  {
    name: 'Fit World Fitness', type: 'fitness_center',
    address: 'Dózsa u. 12, 6720 Szeged',
    coordinates: { type: 'Point', coordinates: [20.153647, 46.2558435] },
    openingHours: convertHours({ monday: {open:'05:30',close:'23:00'}, tuesday: {open:'05:30',close:'23:00'}, wednesday: {open:'05:30',close:'23:00'}, thursday: {open:'05:30',close:'23:00'}, friday: {open:'05:30',close:'23:00'}, saturday: {open:'07:00',close:'21:00'}, sunday: {open:'07:00',close:'21:00'} }),
    amenities: ['konditerem', 'személyi edzés', 'öltöző'],
    rating: 4.7, phone: '+36 70 414 9900'
  },
  {
    name: 'Szegi Fitness', type: 'fitness_center',
    address: 'József Attila sgrt. 115, 6723 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1593215, 46.2713022] },
    openingHours: convertHours({ monday: {open:'06:00',close:'22:00'}, tuesday: {open:'06:00',close:'22:00'}, wednesday: {open:'06:00',close:'22:00'}, thursday: {open:'06:00',close:'22:00'}, friday: {open:'06:00',close:'22:00'}, saturday: {open:'07:00',close:'22:00'}, sunday: {open:'07:00',close:'22:00'} }),
    amenities: ['konditerem', 'öltöző', 'zuhanyzó'],
    rating: 4.6, phone: '+36 20 578 3440'
  },
  {
    name: 'Strong Body Újszeged', type: 'fitness_center',
    address: 'Derkovits fasor 13/A, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1673355, 46.2434349] },
    openingHours: convertHours({ monday: {open:'06:45',close:'20:00'}, tuesday: {open:'08:00',close:'20:00'}, wednesday: {open:'06:45',close:'20:00'}, thursday: {open:'08:00',close:'20:00'}, friday: {open:'06:45',close:'20:00'}, saturday: {open:'10:00',close:'12:00'}, sunday: null }),
    amenities: ['funkcionális edzés', 'személyi edzés', 'öltöző'],
    rating: 4.9, phone: '+36 20 971 1616'
  },
  {
    name: 'Gym Class', type: 'fitness_center',
    address: 'Kossuth Lajos sgrt. 119, 6724 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1289831, 46.2663943] },
    openingHours: convertHours({ monday: {open:'05:30',close:'23:00'}, tuesday: {open:'05:30',close:'23:00'}, wednesday: {open:'05:30',close:'23:00'}, thursday: {open:'05:30',close:'23:00'}, friday: {open:'05:30',close:'23:00'}, saturday: {open:'07:00',close:'22:00'}, sunday: {open:'07:00',close:'22:00'} }),
    amenities: ['konditerem', 'csoportos órák', 'öltöző'],
    rating: 4.8, phone: '+36 70 335 9090'
  },
  {
    name: 'Underground Gym', type: 'fitness_center',
    address: 'Nemes Takács u. 16, 6725 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1372896, 46.249181] },
    openingHours: convertHours({ monday: {open:'06:00',close:'21:00'}, tuesday: {open:'06:00',close:'21:00'}, wednesday: {open:'06:00',close:'21:00'}, thursday: {open:'06:00',close:'21:00'}, friday: {open:'06:00',close:'21:00'}, saturday: {open:'08:00',close:'20:00'}, sunday: {open:'08:00',close:'20:00'} }),
    amenities: ['konditerem', 'öltöző', 'zuhanyzó'],
    rating: 4.7, phone: '+36 70 557 0295'
  },
  {
    name: 'Izometria Fitness', type: 'fitness_center',
    address: 'Tisza Lajos krt. 41, 6722 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1477065, 46.2558303] },
    openingHours: convertHours({ monday: {open:'06:00',close:'22:00'}, tuesday: {open:'06:00',close:'22:00'}, wednesday: {open:'06:00',close:'22:00'}, thursday: {open:'06:00',close:'22:00'}, friday: {open:'06:00',close:'22:00'}, saturday: {open:'08:00',close:'20:00'}, sunday: {open:'08:00',close:'20:00'} }),
    amenities: ['konditerem', 'öltöző', 'szauna'],
    rating: 4.6, phone: '+36 62 665 822'
  },
  {
    name: 'Reformod Pilates – Szeged', type: 'pilates_studio',
    address: 'Marostői u. 4, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1734229, 46.2466875] },
    openingHours: convertHours('Bejelentkezés alapján'),
    amenities: ['reformer pilates gépek', 'személyi edzés'], rating: 4.9
  },
  {
    name: 'Cédrus Fitness', type: 'fitness_center',
    address: 'Bakay Nándor u. 24, 6724 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1305864, 46.2572445] },
    openingHours: convertHours({ monday: {open:'06:00',close:'22:00'}, tuesday: {open:'06:00',close:'22:00'}, wednesday: {open:'06:00',close:'22:00'}, thursday: {open:'06:00',close:'22:00'}, friday: {open:'06:00',close:'22:00'}, saturday: {open:'08:00',close:'20:00'}, sunday: {open:'08:00',close:'20:00'} }),
    amenities: ['konditerem', 'wellness', 'öltöző'],
    rating: 4.7, phone: '+36 70 000 2122'
  },
  {
    name: 'Városi Sportcsarnok', type: 'sports_hall',
    address: 'Temesvári krt. 33, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1627093, 46.244849] },
    openingHours: convertHours({ monday: {open:'05:30',close:'22:00'}, tuesday: {open:'05:30',close:'22:00'}, wednesday: {open:'05:30',close:'22:00'}, thursday: {open:'05:30',close:'22:00'}, friday: {open:'05:30',close:'22:00'}, saturday: {open:'06:00',close:'22:00'}, sunday: {open:'06:00',close:'22:00'} }),
    amenities: ['sportpálya', 'öltöző', 'konditerem', 'büfé'], rating: 4.5
  },
  {
    name: 'Blessed Gym', type: 'fitness_center',
    address: 'Szőregi út 80, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1727099, 46.236165] },
    openingHours: convertHours({ monday: {open:'07:00',close:'20:00'}, tuesday: {open:'07:00',close:'20:00'}, wednesday: {open:'07:00',close:'20:00'}, thursday: {open:'07:00',close:'20:00'}, friday: {open:'07:00',close:'20:00'}, saturday: {open:'07:00',close:'20:00'}, sunday: {open:'08:00',close:'16:00'} }),
    amenities: ['konditerem', 'öltöző'],
    rating: null, phone: '+36 70 398 2783'
  },
  {
    name: 'Maros Fitt Park', type: 'fitness_center',
    address: 'Rahói u. 6, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1876172, 46.2355132] },
    openingHours: convertHours({ monday: {open:'06:00',close:'22:00'}, tuesday: {open:'06:00',close:'22:00'}, wednesday: {open:'06:00',close:'22:00'}, thursday: {open:'06:00',close:'22:00'}, friday: {open:'06:00',close:'22:00'}, saturday: {open:'06:00',close:'22:00'}, sunday: {open:'06:00',close:'22:00'} }),
    amenities: ['konditerem', 'öltöző'], rating: 3.9
  },
  {
    name: 'Only You Fitness', type: 'fitness_center',
    address: 'Fülemüle u. 34, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.186683, 46.2359332] },
    openingHours: convertHours({ monday: {open:'08:00',close:'21:00'}, tuesday: {open:'08:00',close:'21:00'}, wednesday: {open:'08:00',close:'21:00'}, thursday: {open:'08:00',close:'21:00'}, friday: {open:'08:00',close:'21:00'}, saturday: null, sunday: null }),
    amenities: ['személyi edzés', 'konditerem'],
    rating: 5.0, phone: '+36 70 297 0571'
  },
  {
    name: 'Újszegedi Víztorony KondiPark', type: 'outdoor',
    address: 'Töltés u. 16, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1736845, 46.2452945] },
    openingHours: convertHours('outdoor'),
    amenities: ['szabadtéri edzőgépek', 'saját testsúlyos eszközök', 'zöldterület'], rating: 4.9
  },
  {
    name: 'Napfényfitness', type: 'fitness_center',
    address: 'Szent-Györgyi Albert u. 10-14, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1585673, 46.2507064] },
    openingHours: convertHours({ monday: {open:'08:00',close:'19:00'}, tuesday: {open:'08:00',close:'19:00'}, wednesday: {open:'08:00',close:'19:00'}, thursday: {open:'08:00',close:'19:00'}, friday: {open:'08:00',close:'19:00'}, saturday: {open:'10:00',close:'18:00'}, sunday: {open:'10:00',close:'18:00'} }),
    amenities: ['konditerem', 'fürdő közelsége', 'öltöző'],
    rating: 4.4, phone: '+36 30 463 9156'
  },
  {
    name: 'Móricz Tornacsarnok', type: 'sports_hall',
    address: 'Déryné u. 7, 6726 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1684936, 46.2505739] },
    openingHours: convertHours({ monday: {open:'07:00',close:'22:00'}, tuesday: {open:'07:00',close:'22:00'}, wednesday: {open:'07:00',close:'22:00'}, thursday: {open:'07:00',close:'22:00'}, friday: {open:'07:00',close:'22:00'}, saturday: null, sunday: null }),
    amenities: ['sportpálya', 'öltöző', 'zuhanyzó'],
    rating: 4.8, phone: '+36 62 556 440'
  },
  {
    name: 'Street Workout Park', type: 'outdoor',
    address: 'Retek u. 6, 6723 Szeged',
    coordinates: { type: 'Point', coordinates: [20.164501, 46.266023] },
    openingHours: convertHours('outdoor'),
    amenities: ['húzódzkodók', 'tolódzkodók', 'szabadtéri fitness', 'ingyenes'], rating: 4.3
  },
  {
    name: 'Elite Fitness – TRX & Crossfit Szeged', type: 'fitness_center',
    address: 'Pulz u. 33, 6724 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1332284, 46.2621327] },
    openingHours: convertHours({ monday: {open:'07:30',close:'20:00'}, tuesday: {open:'07:30',close:'20:00'}, wednesday: {open:'07:30',close:'19:00'}, thursday: {open:'07:30',close:'19:00'}, friday: {open:'07:30',close:'19:00'}, saturday: {open:'09:45',close:'11:15'}, sunday: null }),
    amenities: ['crossfit', 'trx', 'kettlebell', 'funkcionális edzés', 'öltöző'],
    rating: 5.0, phone: '+36 30 376 4216'
  },
  {
    name: 'beFiT Szeged', type: 'fitness_center',
    address: 'Petőfi Sándor sgrt. 70, 6725 Szeged',
    coordinates: { type: 'Point', coordinates: [20.1342544, 46.2446296] },
    openingHours: convertHours({ monday: {open:'07:00',close:'20:00'}, tuesday: {open:'07:00',close:'20:00'}, wednesday: {open:'07:00',close:'20:00'}, thursday: {open:'07:00',close:'20:00'}, friday: {open:'07:00',close:'20:00'}, saturday: {open:'08:00',close:'13:00'}, sunday: null }),
    amenities: ['csoportos órák', 'alakformálás', 'öltöző'],
    rating: 5.0, phone: '+36 30 294 9160'
  },
];

// ============================================================
// 5. RECIPES (16 English + 10 Hungarian = 26 total)
// ============================================================
const EN_RECIPES = [
  {
    name: 'Protein Power Smoothie', description: 'Quick and easy high-protein breakfast smoothie to fuel your day',
    imageUrl: 'https://images.unsplash.com/photo-1526424382096-74a93e105682?w=600&h=400&fit=crop',
    prepTime: 5, cookTime: 0, servings: 1, difficulty: 'easy',
    nutrition: { calories: 300, protein: 25, carbs: 35, fat: 8, fiber: 6 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ['dairy'],
    ingredients: [ {name:'Banana',amount:1,unit:'piece'}, {name:'Protein powder',amount:30,unit:'g'}, {name:'Almond milk',amount:250,unit:'ml'}, {name:'Rolled oats',amount:30,unit:'g'}, {name:'Honey',amount:1,unit:'tbsp'} ],
    instructions: ['Add almond milk to blender','Add banana, protein powder, and oats','Add honey for sweetness','Blend until smooth','Serve immediately'],
    tags: ['breakfast','high-protein','quick']
  },
  {
    name: 'Overnight Oats', description: 'Prepare the night before for a quick, healthy breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
    prepTime: 5, cookTime: 0, servings: 1, difficulty: 'easy',
    nutrition: { calories: 350, protein: 12, carbs: 55, fat: 10, fiber: 8 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ['dairy'],
    ingredients: [ {name:'Rolled oats',amount:50,unit:'g'}, {name:'Greek yogurt',amount:100,unit:'g'}, {name:'Milk',amount:100,unit:'ml'}, {name:'Mixed berries',amount:100,unit:'g'}, {name:'Honey',amount:1,unit:'tbsp'}, {name:'Chia seeds',amount:1,unit:'tbsp'} ],
    instructions: ['Combine oats, yogurt, and milk in a jar','Add chia seeds and honey','Stir well to combine','Top with berries','Cover and refrigerate overnight','Enjoy cold in the morning'],
    tags: ['breakfast','meal-prep','quick']
  },
  {
    name: 'Avocado Toast with Eggs', description: 'Classic healthy breakfast with protein and healthy fats',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop',
    prepTime: 5, cookTime: 5, servings: 1, difficulty: 'easy',
    nutrition: { calories: 420, protein: 18, carbs: 35, fat: 24, fiber: 10 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: true, glutenFree: true, dairyFree: true },
    allergens: ['eggs','gluten'],
    ingredients: [ {name:'Whole grain bread',amount:2,unit:'slices'}, {name:'Avocado',amount:1,unit:'piece'}, {name:'Eggs',amount:2,unit:'pieces'}, {name:'Cherry tomatoes',amount:50,unit:'g'}, {name:'Olive oil',amount:1,unit:'tsp'} ],
    instructions: ['Toast bread until golden','Mash avocado with salt and pepper','Cook eggs to preference','Spread avocado on toast','Top with eggs and tomatoes','Drizzle with olive oil'],
    tags: ['breakfast','quick','high-protein']
  },
  {
    name: 'Banana Protein Pancakes', description: 'Fluffy high-protein pancakes made with bananas',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop',
    prepTime: 10, cookTime: 15, servings: 2, difficulty: 'easy',
    nutrition: { calories: 380, protein: 22, carbs: 48, fat: 12, fiber: 5 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: false, dairyFree: false },
    allergens: ['eggs','dairy','gluten'],
    ingredients: [ {name:'Bananas',amount:2,unit:'pieces'}, {name:'Eggs',amount:3,unit:'pieces'}, {name:'Protein powder',amount:40,unit:'g'}, {name:'Oat flour',amount:50,unit:'g'}, {name:'Baking powder',amount:1,unit:'tsp'}, {name:'Maple syrup',amount:2,unit:'tbsp'} ],
    instructions: ['Mash bananas in bowl','Beat in eggs and protein powder','Add oat flour and baking powder','Heat pan with cooking spray','Cook pancakes until bubbles form','Flip and cook until golden','Serve with maple syrup'],
    tags: ['breakfast','high-protein']
  },
  {
    name: 'Green Breakfast Smoothie Bowl', description: 'Nutrient-packed smoothie bowl with superfoods',
    imageUrl: 'https://images.unsplash.com/photo-1590137876181-4d3df9430489?w=600&h=400&fit=crop',
    prepTime: 10, cookTime: 0, servings: 1, difficulty: 'easy',
    nutrition: { calories: 320, protein: 15, carbs: 45, fat: 12, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Spinach',amount:50,unit:'g'}, {name:'Frozen banana',amount:1,unit:'piece'}, {name:'Protein powder',amount:25,unit:'g'}, {name:'Almond milk',amount:200,unit:'ml'}, {name:'Granola',amount:30,unit:'g'}, {name:'Fresh berries',amount:50,unit:'g'}, {name:'Chia seeds',amount:1,unit:'tbsp'} ],
    instructions: ['Blend spinach, banana, protein powder, and milk until smooth','Pour into bowl','Top with granola, berries, and chia seeds','Enjoy with spoon'],
    tags: ['breakfast','high-protein']
  },
  {
    name: 'Grilled Chicken Salad', description: 'Healthy, protein-packed salad perfect for lunch or dinner',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    prepTime: 15, cookTime: 15, servings: 2, difficulty: 'easy',
    nutrition: { calories: 400, protein: 45, carbs: 20, fat: 15, fiber: 8 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: true, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Chicken breast',amount:300,unit:'g'}, {name:'Mixed greens',amount:200,unit:'g'}, {name:'Cherry tomatoes',amount:100,unit:'g'}, {name:'Cucumber',amount:1,unit:'piece'}, {name:'Olive oil',amount:2,unit:'tbsp'}, {name:'Lemon juice',amount:1,unit:'tbsp'} ],
    instructions: ['Season chicken with salt, pepper, and herbs','Grill chicken for 6-7 minutes per side','Let chicken rest 5 minutes then slice','Wash and chop vegetables','Combine greens, tomatoes, cucumber in bowl','Top with sliced chicken','Drizzle with olive oil and lemon'],
    tags: ['lunch','dinner','high-protein']
  },
  {
    name: 'Quinoa Power Bowl', description: 'Complete protein bowl with quinoa and vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop',
    prepTime: 15, cookTime: 25, servings: 2, difficulty: 'medium',
    nutrition: { calories: 450, protein: 18, carbs: 65, fat: 15, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Quinoa',amount:150,unit:'g'}, {name:'Roasted chickpeas',amount:150,unit:'g'}, {name:'Sweet potato',amount:200,unit:'g'}, {name:'Kale',amount:100,unit:'g'}, {name:'Tahini',amount:2,unit:'tbsp'}, {name:'Lemon juice',amount:1,unit:'tbsp'} ],
    instructions: ['Cook quinoa according to package','Roast diced sweet potato at 200C for 25 min','Saute kale with garlic','Combine all in bowl','Make dressing with tahini and lemon','Drizzle and serve'],
    tags: ['lunch','high-protein']
  },
  {
    name: 'Turkey Wrap with Hummus', description: 'Quick and easy protein-packed wrap',
    imageUrl: 'https://images.unsplash.com/photo-1623428187425-5add2e4c9a1d?w=600&h=400&fit=crop',
    prepTime: 10, cookTime: 0, servings: 1, difficulty: 'easy',
    nutrition: { calories: 380, protein: 28, carbs: 45, fat: 12, fiber: 8 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: false, glutenFree: false, dairyFree: true },
    allergens: ['gluten'],
    ingredients: [ {name:'Whole wheat tortilla',amount:1,unit:'piece'}, {name:'Turkey breast slices',amount:100,unit:'g'}, {name:'Hummus',amount:50,unit:'g'}, {name:'Lettuce',amount:50,unit:'g'}, {name:'Tomato',amount:1,unit:'piece'}, {name:'Cucumber',amount:50,unit:'g'} ],
    instructions: ['Spread hummus on tortilla','Layer turkey, lettuce, tomato, cucumber','Roll tightly','Cut in half and serve'],
    tags: ['lunch','quick','high-protein']
  },
  {
    name: 'Asian Tofu Stir-Fry', description: 'Colorful vegetable stir-fry with crispy tofu',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=600&h=400&fit=crop',
    prepTime: 15, cookTime: 15, servings: 2, difficulty: 'medium',
    nutrition: { calories: 360, protein: 20, carbs: 42, fat: 14, fiber: 8 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: false, dairyFree: true },
    allergens: ['soy'],
    ingredients: [ {name:'Firm tofu',amount:250,unit:'g'}, {name:'Mixed vegetables',amount:300,unit:'g'}, {name:'Soy sauce',amount:3,unit:'tbsp'}, {name:'Garlic',amount:3,unit:'pieces'}, {name:'Ginger',amount:1,unit:'tbsp'}, {name:'Brown rice',amount:150,unit:'g'} ],
    instructions: ['Press and cube tofu','Pan-fry tofu until golden','Set aside tofu','Stir-fry vegetables with garlic and ginger','Add soy sauce and tofu back in','Serve over brown rice'],
    tags: ['lunch','dinner']
  },
  {
    name: 'Mediterranean Chickpea Salad', description: 'Fresh and filling salad with Mediterranean flavors',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    prepTime: 15, cookTime: 0, servings: 2, difficulty: 'easy',
    nutrition: { calories: 340, protein: 14, carbs: 48, fat: 12, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Chickpeas',amount:400,unit:'g'}, {name:'Cucumber',amount:1,unit:'piece'}, {name:'Tomatoes',amount:200,unit:'g'}, {name:'Red onion',amount:1,unit:'piece'}, {name:'Feta cheese',amount:50,unit:'g'}, {name:'Olive oil',amount:2,unit:'tbsp'}, {name:'Lemon juice',amount:2,unit:'tbsp'} ],
    instructions: ['Drain and rinse chickpeas','Dice cucumber, tomatoes, onion','Combine all vegetables and chickpeas','Crumble feta on top','Mix olive oil and lemon juice','Toss and serve'],
    tags: ['lunch']
  },
  {
    name: 'Vegan Buddha Bowl', description: 'Nutritious and colorful plant-based meal packed with vitamins',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop',
    prepTime: 20, cookTime: 25, servings: 2, difficulty: 'medium',
    nutrition: { calories: 500, protein: 15, carbs: 70, fat: 18, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Quinoa',amount:150,unit:'g'}, {name:'Chickpeas',amount:200,unit:'g'}, {name:'Sweet potato',amount:1,unit:'piece'}, {name:'Broccoli',amount:200,unit:'g'}, {name:'Avocado',amount:1,unit:'piece'}, {name:'Tahini',amount:2,unit:'tbsp'} ],
    instructions: ['Cook quinoa according to package instructions','Roast chickpeas and diced sweet potato at 200C for 25 minutes','Steam broccoli until tender','Divide quinoa between two bowls','Top with roasted chickpeas, sweet potato, and broccoli','Add sliced avocado','Drizzle with tahini dressing'],
    tags: ['lunch','dinner']
  },
  {
    name: 'Baked Salmon with Asparagus', description: 'Omega-3 rich dinner with roasted vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
    prepTime: 10, cookTime: 20, servings: 2, difficulty: 'easy',
    nutrition: { calories: 420, protein: 38, carbs: 15, fat: 24, fiber: 6 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: true, paleo: true, glutenFree: true, dairyFree: true },
    allergens: ['fish'],
    ingredients: [ {name:'Salmon fillets',amount:300,unit:'g'}, {name:'Asparagus',amount:250,unit:'g'}, {name:'Olive oil',amount:2,unit:'tbsp'}, {name:'Lemon',amount:1,unit:'piece'}, {name:'Garlic',amount:2,unit:'pieces'} ],
    instructions: ['Preheat oven to 200C','Place salmon and asparagus on baking sheet','Drizzle with olive oil','Add minced garlic and lemon slices','Bake for 15-20 minutes','Serve immediately'],
    tags: ['dinner','high-protein']
  },
  {
    name: 'Chicken Fajita Bowl', description: 'Mexican-inspired bowl with grilled chicken and peppers',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
    prepTime: 15, cookTime: 20, servings: 2, difficulty: 'medium',
    nutrition: { calories: 480, protein: 42, carbs: 52, fat: 14, fiber: 10 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ['dairy'],
    ingredients: [ {name:'Chicken breast',amount:300,unit:'g'}, {name:'Bell peppers',amount:200,unit:'g'}, {name:'Onion',amount:1,unit:'piece'}, {name:'Brown rice',amount:150,unit:'g'}, {name:'Black beans',amount:100,unit:'g'}, {name:'Salsa',amount:50,unit:'g'}, {name:'Cheese',amount:30,unit:'g'} ],
    instructions: ['Cook rice according to package','Slice chicken, peppers, and onion','Season with fajita spices','Saute chicken until cooked','Add vegetables and cook until tender','Serve over rice with beans','Top with salsa and cheese'],
    tags: ['dinner','high-protein']
  },
  {
    name: 'Lentil Curry', description: 'Hearty plant-based curry with aromatic spices',
    imageUrl: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=600&h=400&fit=crop',
    prepTime: 10, cookTime: 30, servings: 4, difficulty: 'easy',
    nutrition: { calories: 380, protein: 18, carbs: 62, fat: 8, fiber: 16 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Red lentils',amount:250,unit:'g'}, {name:'Coconut milk',amount:400,unit:'ml'}, {name:'Tomatoes',amount:400,unit:'g'}, {name:'Onion',amount:1,unit:'piece'}, {name:'Curry powder',amount:2,unit:'tbsp'}, {name:'Spinach',amount:100,unit:'g'} ],
    instructions: ['Saute onion until soft','Add curry powder and cook for 1 minute','Add lentils, tomatoes, and coconut milk','Simmer for 25 minutes','Stir in spinach until wilted','Serve with rice or naan'],
    tags: ['dinner']
  },
  {
    name: 'Beef Stir-Fry with Broccoli', description: 'Quick and easy high-protein dinner',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
    prepTime: 15, cookTime: 15, servings: 2, difficulty: 'medium',
    nutrition: { calories: 420, protein: 38, carbs: 35, fat: 16, fiber: 6 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: true, glutenFree: false, dairyFree: true },
    allergens: ['soy'],
    ingredients: [ {name:'Beef sirloin',amount:300,unit:'g'}, {name:'Broccoli',amount:300,unit:'g'}, {name:'Soy sauce',amount:3,unit:'tbsp'}, {name:'Garlic',amount:3,unit:'pieces'}, {name:'Ginger',amount:1,unit:'tbsp'}, {name:'Rice',amount:150,unit:'g'} ],
    instructions: ['Slice beef thinly','Marinate in soy sauce for 10 minutes','Stir-fry beef on high heat','Remove beef, add broccoli','Add garlic and ginger','Return beef to pan','Serve over rice'],
    tags: ['dinner','high-protein']
  },
  {
    name: 'Keto Cauliflower Pizza', description: 'Low-carb pizza alternative with cauliflower crust',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
    prepTime: 20, cookTime: 30, servings: 4, difficulty: 'medium',
    nutrition: { calories: 350, protein: 20, carbs: 12, fat: 25, fiber: 5 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: true, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ['dairy','eggs'],
    ingredients: [ {name:'Cauliflower',amount:1,unit:'piece'}, {name:'Mozzarella cheese',amount:200,unit:'g'}, {name:'Parmesan cheese',amount:50,unit:'g'}, {name:'Eggs',amount:2,unit:'pieces'}, {name:'Tomato sauce',amount:100,unit:'ml'}, {name:'Toppings of choice',amount:100,unit:'g'} ],
    instructions: ['Rice cauliflower in food processor','Microwave riced cauliflower for 8 minutes','Squeeze out excess moisture','Mix cauliflower, 100g mozzarella, parmesan, eggs, salt, pepper','Form into pizza crust on baking sheet','Bake at 200C for 20 minutes until golden','Add sauce, remaining cheese, and toppings','Bake for another 10 minutes'],
    tags: ['dinner','low-carb']
  },
];

const HU_RECIPES = [
  {
    name: 'Magas Feherjetartalmu Csirkerizs',
    description: 'Feherjedus csirkemell barna rizzsel es brokkolival – idealis edzas utanra',
    prepTime: 15, cookTime: 25, servings: 2, difficulty: 'easy',
    nutrition: { calories: 520, protein: 48, carbs: 52, fat: 10, fiber: 3 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Csirkemell',amount:300,unit:'g'}, {name:'Barna rizs',amount:150,unit:'g'}, {name:'Brokkoli',amount:200,unit:'g'}, {name:'Olivaolaj',amount:20,unit:'ml'}, {name:'Fokhagyma',amount:2,unit:'pieces'} ],
    instructions: ['Fozd meg a rizst.','Susd meg a csirket olivaolajon fokhagymával.','Fozd a brokkolit al dentere.','Keverd ossze es talald.'],
    tags: ['lunch','high-protein','meal-prep']
  },
  {
    name: 'Avokados Quinoa Salata',
    description: 'Friss vegans quinoa salata avokadobal es lime les ontettel',
    prepTime: 10, cookTime: 15, servings: 2, difficulty: 'easy',
    nutrition: { calories: 380, protein: 14, carbs: 38, fat: 22, fiber: 10 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Quinoa',amount:120,unit:'g'}, {name:'Avokado',amount:1,unit:'piece'}, {name:'Cseresznye paradicsom',amount:150,unit:'g'}, {name:'Uborka',amount:100,unit:'g'}, {name:'Lime le',amount:30,unit:'ml'} ],
    instructions: ['Fozd meg a quinoat.','Kockazd fel az avokadot.','Keverd ossze lime lével.'],
    tags: ['lunch','snack']
  },
  {
    name: 'Zabpehely Afonya Reggelivel',
    description: 'Gyors, egeszseges reggeli zabpehely alapon afonyaval es mandulával',
    prepTime: 5, cookTime: 10, servings: 1, difficulty: 'easy',
    nutrition: { calories: 340, protein: 12, carbs: 58, fat: 8, fiber: 7 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: false, dairyFree: false },
    allergens: ['dairy'],
    ingredients: [ {name:'Zabpehely',amount:80,unit:'g'}, {name:'Tej',amount:200,unit:'ml'}, {name:'Afonya',amount:80,unit:'g'}, {name:'Mez',amount:15,unit:'ml'}, {name:'Mandula',amount:20,unit:'g'} ],
    instructions: ['Fozd a zabot a tejben.','Adj hozza afonyat, mezet es manduklat.'],
    tags: ['breakfast','quick']
  },
  {
    name: 'Lazac Edesburgonyaval',
    description: 'Omega-3 gazdag lazac edesburgonyaval es spenóttal – dietas vacsora',
    prepTime: 10, cookTime: 30, servings: 2, difficulty: 'easy',
    nutrition: { calories: 490, protein: 38, carbs: 40, fat: 18, fiber: 5 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: true, glutenFree: true, dairyFree: true },
    allergens: ['fish'],
    ingredients: [ {name:'Lazac fiele',amount:280,unit:'g'}, {name:'Edesburgonya',amount:250,unit:'g'}, {name:'Spenot',amount:100,unit:'g'}, {name:'Citrom',amount:1,unit:'piece'}, {name:'Olivaolaj',amount:20,unit:'ml'} ],
    instructions: ['Susd az edesburgonyat 200C-on 25 percig.','Susd a lazacot 4-4 percig.','Talald spenóttal es citrommal.'],
    tags: ['dinner','high-protein']
  },
  {
    name: 'Keto Tojasos Reggeli',
    description: 'Keto-barát tojásos reggeli bacon-nel és sajttal – alacsony szénhidráttartalom',
    prepTime: 5, cookTime: 10, servings: 1, difficulty: 'easy',
    nutrition: { calories: 420, protein: 28, carbs: 4, fat: 34, fiber: 1 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: true, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ['eggs','dairy'],
    ingredients: [ {name:'Tojas',amount:3,unit:'pieces'}, {name:'Bacon',amount:50,unit:'g'}, {name:'Sajt cheddar',amount:30,unit:'g'}, {name:'Vaj',amount:10,unit:'g'} ],
    instructions: ['Susd ki a baconot.','Verd fel a tojasokat, susd rantottakent.','Rakd ossze sajttal.'],
    tags: ['breakfast','low-carb']
  },
  {
    name: 'Feherjes Proteinszelet hazi',
    description: 'Hazilag keszitett feherjeszeelet zabpehellyel, mogyorovajaval es csokoladeval',
    prepTime: 20, cookTime: 0, servings: 8, difficulty: 'easy',
    nutrition: { calories: 180, protein: 15, carbs: 18, fat: 6, fiber: 3 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: false, dairyFree: false },
    allergens: ['dairy','nuts'],
    ingredients: [ {name:'Zabpehely',amount:200,unit:'g'}, {name:'Feherjeepor vanilla',amount:100,unit:'g'}, {name:'Mogyorovaj',amount:80,unit:'g'}, {name:'Mez',amount:60,unit:'ml'}, {name:'Etcsokolade chips',amount:50,unit:'g'} ],
    instructions: ['Keverj ossze mindent.','Nyomj egy tepsibe.','Hutsd 2 oran at.','Szeld szeletekre.'],
    tags: ['snack','high-protein']
  },
  {
    name: 'Gorog Joghurt Parfait',
    description: 'Gyorsan elkeszitheto gorog joghurtos parfait granolaval es eperrel',
    prepTime: 5, cookTime: 0, servings: 1, difficulty: 'easy',
    nutrition: { calories: 280, protein: 22, carbs: 32, fat: 5, fiber: 4 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ['dairy'],
    ingredients: [ {name:'Gorog joghurt',amount:200,unit:'g'}, {name:'Granola',amount:40,unit:'g'}, {name:'Eper',amount:80,unit:'g'}, {name:'Chia mag',amount:10,unit:'g'} ],
    instructions: ['Reetegezd egymásra: joghurt, granola, eper, chia mag.'],
    tags: ['breakfast','quick']
  },
  {
    name: 'Csicseriborsoo Curry',
    description: 'Pikans vegán curry csicseriborsóval, paradicsomal és kokusztejes mártással',
    prepTime: 10, cookTime: 25, servings: 3, difficulty: 'easy',
    nutrition: { calories: 350, protein: 16, carbs: 52, fat: 9, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [ {name:'Csicseriborsoo konzerv',amount:400,unit:'g'}, {name:'Kokusztej',amount:200,unit:'ml'}, {name:'Paradicsom konzerv',amount:300,unit:'g'}, {name:'Hagyma',amount:1,unit:'piece'}, {name:'Curry por',amount:15,unit:'g'} ],
    instructions: ['Dinszteld a hagymaat es gyomberet.','Add hozza a curryt, paradicsomot.','Add hozza a csicseriborsot es kokusztejet.','Fozd 20 percig.'],
    tags: ['lunch','dinner']
  },
  {
    name: 'Pulykas Zoldseg Wrap',
    description: 'Gyorsan elkeszitheto pulykamellos teljes kioorleesu wrap friss zoldsegekkel',
    prepTime: 10, cookTime: 5, servings: 2, difficulty: 'easy',
    nutrition: { calories: 390, protein: 35, carbs: 38, fat: 10, fiber: 5 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: false, glutenFree: false, dairyFree: true },
    allergens: ['gluten'],
    ingredients: [ {name:'Pulykamell szelet',amount:200,unit:'g'}, {name:'Teljes kioorleesu tortilla',amount:2,unit:'pieces'}, {name:'Jegsalata',amount:60,unit:'g'}, {name:'Paradicsom',amount:1,unit:'piece'}, {name:'Mustar',amount:20,unit:'g'} ],
    instructions: ['Susd meg a pulykaat.','Tedd a tortillara a hozzavalokkal.','Tekerd fel.'],
    tags: ['lunch','quick','high-protein']
  },
  {
    name: 'Banan-Feherje Smoothie',
    description: 'Taplalo banan-feherje smoothie mandulateejjel – idealis edzes utan',
    prepTime: 5, cookTime: 0, servings: 1, difficulty: 'easy',
    nutrition: { calories: 310, protein: 30, carbs: 38, fat: 5, fiber: 3 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ['dairy'],
    ingredients: [ {name:'Banan',amount:1,unit:'piece'}, {name:'Feherjeepor csokolade',amount:30,unit:'g'}, {name:'Mandulateej',amount:250,unit:'ml'}, {name:'Foldimogyo vaj',amount:20,unit:'g'} ],
    instructions: ['Tedd mindent a turmixba.','Mixeld simara.'],
    tags: ['breakfast','high-protein','quick']
  },
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function seedDatabase() {
  try {
    console.log('Clearing all collections...');
    await Promise.all([
      WorkoutLog.deleteMany({}),
      WeightLog.deleteMany({}),
      FitnessGoal.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
      Recipe.deleteMany({}),
      Location.deleteMany({}),
    ]);
    console.log('  Cleared.\n');

    // ---- Workouts (34) ----
    console.log('Seeding workouts...');
    const insertedWorkouts = await Workout.insertMany([...EN_WORKOUTS, ...HU_WORKOUTS]);
    console.log(`  ${insertedWorkouts.length} workouts added`);

    // ---- Recipes (26) ----
    console.log('Seeding recipes...');
    await Recipe.insertMany([...EN_RECIPES, ...HU_RECIPES]);
    console.log(`  ${EN_RECIPES.length + HU_RECIPES.length} recipes added`);

    // ---- Locations (11) ----
    console.log('Seeding locations...');
    const insertedLocations = await Location.insertMany(LOCATIONS);
    console.log(`  ${insertedLocations.length} locations added`);

    // ---- Demo users — bcrypt via User.create ----
    console.log('Creating demo users (bcrypt)...');
    const demoUsers = [];
    for (const u of DEMO_USERS) {
      demoUsers.push(await User.create(u));
    }
    console.log(`  ${demoUsers.length} demo users created`);

    // ---- Hungarian users — insertMany bypasses pre-save hook ----
    console.log('Inserting Hungarian demo users (pre-hashed)...');
    const huUsers = await User.insertMany(HU_USERS);
    console.log(`  ${huUsers.length} Hungarian users inserted`);

    const [, demo1, demo2] = demoUsers;

    // ---- Weight logs: generated (demo) + historical (Hungarian) ----
    console.log('Seeding weight logs...');
    const demo1Weights = generateWeightLogs(demo1._id, 82, demo1.height, 0.06);
    const demo2Weights = generateWeightLogs(demo2._id, 72, demo2.height, 0.04);
    const huWeightLogs = [
      { userId: huUsers[0]._id, weight: 90.2, bmi: 27.2, date: daysAgo(60), measurementTime: 'morning', notes: 'Edzes megkezdese elott' },
      { userId: huUsers[0]._id, weight: 89.0, bmi: 26.9, date: daysAgo(45), measurementTime: 'morning', notes: 'Jo irany!' },
      { userId: huUsers[0]._id, weight: 88.1, bmi: 26.6, date: daysAgo(20), measurementTime: 'morning', notes: 'Folyamatosan megy' },
      { userId: huUsers[1]._id, weight: 63.5, bmi: 23.3, date: daysAgo(30), measurementTime: 'morning' },
      { userId: huUsers[1]._id, weight: 62.8, bmi: 23.1, date: daysAgo(15), measurementTime: 'morning', notes: 'Jo erzeees!' },
      { userId: huUsers[2]._id, weight: 74.5, bmi: 23.5, date: daysAgo(50), measurementTime: 'morning' },
      { userId: huUsers[2]._id, weight: 75.2, bmi: 23.7, date: daysAgo(25), measurementTime: 'morning', notes: 'Izomtomeg no' },
      { userId: huUsers[3]._id, weight: 68.0, bmi: 23.5, date: daysAgo(40), measurementTime: 'morning' },
      { userId: huUsers[3]._id, weight: 67.2, bmi: 23.3, date: daysAgo(10), measurementTime: 'morning' },
      { userId: huUsers[4]._id, weight: 97.0, bmi: 28.4, date: daysAgo(55), measurementTime: 'evening', notes: 'Kezdees' },
      { userId: huUsers[4]._id, weight: 95.8, bmi: 28.0, date: daysAgo(30), measurementTime: 'morning' },
      { userId: huUsers[5]._id, weight: 56.0, bmi: 21.9, date: daysAgo(20), measurementTime: 'morning' },
      { userId: huUsers[6]._id, weight: 83.5, bmi: 27.2, date: daysAgo(45), measurementTime: 'morning', notes: 'Kezdes elott' },
      { userId: huUsers[6]._id, weight: 82.0, bmi: 26.8, date: daysAgo(20), measurementTime: 'morning' },
      { userId: huUsers[7]._id, weight: 71.0, bmi: 25.2, date: daysAgo(35), measurementTime: 'morning' },
    ];
    await WeightLog.insertMany([...demo1Weights, ...demo2Weights, ...huWeightLogs]);
    const totalWeight = demo1Weights.length + demo2Weights.length + huWeightLogs.length;
    console.log(`  ${totalWeight} weight log entries added`);

    // ---- Workout logs: generated (demo) + historical (Hungarian) ----
    console.log('Seeding workout logs...');
    const workoutRefs = insertedWorkouts.map(w => ({ id: w._id, duration: w.duration, calories: w.caloriesBurned }));
    const demo1Logs = generateWorkoutLogs(demo1._id, workoutRefs);
    const demo2Logs = generateWorkoutLogs(demo2._id, workoutRefs.slice(0, 5));
    const loc = insertedLocations;
    const hu = huUsers;
    const wk = insertedWorkouts;
    // HU workouts start at index 22 (after 22 English workouts)
    const huWorkoutLogs = [
      { userId: hu[0]._id, workoutId: wk[22]._id, locationId: loc[3]._id, date: daysAgo(14), duration: 48, caloriesBurned: 295, perceivedEffort: 6, notes: 'Jol sikerult!' },
      { userId: hu[0]._id, workoutId: wk[23]._id, locationId: loc[0]._id, date: daysAgo(10), duration: 42, caloriesBurned: 435, perceivedEffort: 7, notes: 'Tisza-parton futottam' },
      { userId: hu[0]._id, workoutId: wk[27]._id, locationId: loc[9]._id, date: daysAgo(5),  duration: 65, caloriesBurned: 390, perceivedEffort: 8 },
      { userId: hu[1]._id, workoutId: wk[25]._id, locationId: loc[3]._id, date: daysAgo(12), duration: 32, caloriesBurned: 125, perceivedEffort: 4, notes: 'Reggeli joga csoporttal' },
      { userId: hu[1]._id, workoutId: wk[23]._id, locationId: loc[4]._id, date: daysAgo(7),  duration: 38, caloriesBurned: 410, perceivedEffort: 6 },
      { userId: hu[2]._id, workoutId: wk[27]._id, locationId: loc[9]._id, date: daysAgo(20), duration: 62, caloriesBurned: 385, perceivedEffort: 9 },
      { userId: hu[2]._id, workoutId: wk[24]._id, locationId: loc[9]._id, date: daysAgo(8),  duration: 33, caloriesBurned: 510, perceivedEffort: 10, notes: 'Kemeny HIIT!' },
      { userId: hu[3]._id, workoutId: wk[29]._id, locationId: loc[3]._id, date: daysAgo(9),  duration: 37, caloriesBurned: 230, perceivedEffort: 5 },
      { userId: hu[4]._id, workoutId: wk[22]._id, locationId: loc[9]._id, date: daysAgo(6),  duration: 50, caloriesBurned: 300, perceivedEffort: 5, notes: 'Elso edzes!' },
      { userId: hu[5]._id, workoutId: wk[25]._id, locationId: loc[2]._id, date: daysAgo(3),  duration: 30, caloriesBurned: 120, perceivedEffort: 3 },
      { userId: hu[6]._id, workoutId: wk[23]._id, locationId: loc[0]._id, date: daysAgo(11), duration: 45, caloriesBurned: 460, perceivedEffort: 7, notes: 'Tisza-parti futas' },
      { userId: hu[7]._id, workoutId: wk[30]._id, locationId: loc[0]._id, date: daysAgo(4),  duration: 95, caloriesBurned: 620, perceivedEffort: 5, notes: 'Kellemes kerekparozas' },
      { userId: hu[8]._id, workoutId: wk[28]._id, locationId: loc[4]._id, date: daysAgo(7),  duration: 55, caloriesBurned: 495, perceivedEffort: 7 },
      { userId: hu[9]._id, workoutId: wk[25]._id, locationId: loc[3]._id, date: daysAgo(2),  duration: 31, caloriesBurned: 130, perceivedEffort: 4, notes: 'Remek joga szekcio' },
      { userId: hu[0]._id, workoutId: wk[26]._id, locationId: loc[1]._id, date: daysAgo(18), duration: 58, caloriesBurned: 545, perceivedEffort: 7, notes: 'Anna-furdoeben uszas' },
    ];
    await WorkoutLog.insertMany([...demo1Logs, ...demo2Logs, ...huWorkoutLogs]);
    const totalLogs = demo1Logs.length + demo2Logs.length + huWorkoutLogs.length;
    console.log(`  ${totalLogs} workout log entries added`);

    // ---- Fitness Goals (10 — Hungarian users) ----
    console.log('Seeding fitness goals...');
    const fitnessGoals = [
      {
        userId: hu[0]._id, type: 'weight_loss',
        startValue: 90.2, targetValue: 80, currentValue: 88.1,
        startDate: daysAgo(60), targetDate: daysFromNow(60), status: 'active',
        milestones: [
          { value: 88, date: daysAgo(20),     achieved: true,  label: 'Elso 2 kg le' },
          { value: 85, date: daysFromNow(20), achieved: false, label: '5 kg le' },
          { value: 80, date: daysFromNow(60), achieved: false, label: 'Celsuly!' },
        ],
        progressHistory: [
          { value: 90.2, date: daysAgo(60), note: 'Kezdes' },
          { value: 89.0, date: daysAgo(45), note: 'Haladok' },
          { value: 88.1, date: daysAgo(20), note: 'Jo tempo' },
        ],
        notes: 'Napi kaloria deficit 500 kcal'
      },
      {
        userId: hu[1]._id, type: 'general_fitness',
        startValue: 0, targetValue: 24, currentValue: 10,
        startDate: daysAgo(30), targetDate: daysFromNow(60), status: 'active',
        milestones: [
          { value: 8,  date: daysAgo(10),     achieved: true,  label: '8 edzes' },
          { value: 16, date: daysFromNow(20), achieved: false, label: '16 edzes' },
        ],
        progressHistory: [
          { value: 0,  date: daysAgo(30), note: 'Kezdes' },
          { value: 5,  date: daysAgo(15), note: 'Haladok' },
          { value: 10, date: daysAgo(5),  note: 'Jo utem' },
        ],
        notes: 'Cel: heti 3 edzes 8 heten at'
      },
      {
        userId: hu[2]._id, type: 'muscle_gain',
        startValue: 74.5, targetValue: 80, currentValue: 75.2,
        startDate: daysAgo(50), targetDate: daysFromNow(70), status: 'active',
        milestones: [
          { value: 76, date: daysFromNow(10), achieved: false, label: '76 kg' },
          { value: 78, date: daysFromNow(40), achieved: false, label: '78 kg' },
        ],
        progressHistory: [
          { value: 74.5, date: daysAgo(50), note: 'Start' },
          { value: 75.0, date: daysAgo(30), note: '+0.5 kg izom' },
          { value: 75.2, date: daysAgo(10), note: 'Haladunk' },
        ],
        notes: 'Kaloria tobblet + erooedzes'
      },
      {
        userId: hu[3]._id, type: 'flexibility',
        startValue: 1, targetValue: 5, currentValue: 3,
        startDate: daysAgo(40), targetDate: daysFromNow(30), status: 'active',
        milestones: [
          { value: 3, date: daysAgo(5),      achieved: true,  label: 'Kozepes szint' },
          { value: 5, date: daysFromNow(30), achieved: false, label: 'Halado szint' },
        ],
        progressHistory: [
          { value: 1, date: daysAgo(40), note: 'Nagyon merev' },
          { value: 2, date: daysAgo(20), note: 'Kicsit javult' },
          { value: 3, date: daysAgo(5),  note: 'Sokat fejloodtem' },
        ]
      },
      {
        userId: hu[4]._id, type: 'weight_loss',
        startValue: 97.0, targetValue: 85, currentValue: 95.8,
        startDate: daysAgo(55), targetDate: daysFromNow(120), status: 'active',
        milestones: [
          { value: 93, date: daysFromNow(30),  achieved: false, label: '4 kg le' },
          { value: 90, date: daysFromNow(75),  achieved: false, label: '7 kg le' },
          { value: 85, date: daysFromNow(120), achieved: false, label: 'Celsuly' },
        ],
        progressHistory: [
          { value: 97.0, date: daysAgo(55), note: 'Elso meres' },
          { value: 95.8, date: daysAgo(30), note: 'Lassan halad' },
        ],
        notes: 'Orvos altal javasolt fogyokura'
      },
      {
        userId: hu[5]._id, type: 'endurance',
        startValue: 1, targetValue: 5, currentValue: 2,
        startDate: daysAgo(20), targetDate: daysFromNow(40), status: 'active',
        milestones: [
          { value: 3, date: daysFromNow(15), achieved: false, label: '5 km futas megallos nelkul' },
          { value: 5, date: daysFromNow(40), achieved: false, label: '10 km futas' },
        ],
        progressHistory: [
          { value: 1, date: daysAgo(20), note: 'Alig tudok 2 km-t futni' },
          { value: 2, date: daysAgo(7),  note: '3 km mar megy' },
        ]
      },
      {
        userId: hu[6]._id, type: 'weight_loss',
        startValue: 83.5, targetValue: 75, currentValue: 82.0,
        startDate: daysAgo(45), targetDate: daysFromNow(75), status: 'active',
        milestones: [
          { value: 80, date: daysFromNow(20), achieved: false, label: '80 kg alatt' },
        ],
        progressHistory: [
          { value: 83.5, date: daysAgo(45), note: 'Indulas' },
          { value: 82.0, date: daysAgo(20), note: '1.5 kg le' },
        ]
      },
      {
        userId: hu[7]._id, type: 'general_fitness',
        startValue: 0, targetValue: 30, currentValue: 8,
        startDate: daysAgo(35), targetDate: daysFromNow(55), status: 'active',
        milestones: [
          { value: 10, date: daysFromNow(5), achieved: false, label: '10 edzes' },
        ],
        progressHistory: [
          { value: 0, date: daysAgo(35), note: 'Start' },
          { value: 8, date: daysAgo(5),  note: 'Haladas' },
        ]
      },
      {
        userId: hu[8]._id, type: 'endurance',
        startValue: 3, targetValue: 10, currentValue: 6,
        startDate: daysAgo(60), targetDate: daysFromNow(30), status: 'active',
        milestones: [
          { value: 5,  date: daysAgo(20),     achieved: true,  label: 'Felmaraton edzes' },
          { value: 10, date: daysFromNow(30), achieved: false, label: 'Maraton felkeszules' },
        ],
        progressHistory: [
          { value: 3, date: daysAgo(60), note: 'Alap szint' },
          { value: 5, date: daysAgo(20), note: 'Javulas' },
          { value: 6, date: daysAgo(5),  note: 'Tovabb fejloodom' },
        ],
        notes: 'Szegedi Futofest felkeszules'
      },
      {
        userId: hu[9]._id, type: 'flexibility',
        startValue: 4, targetValue: 10, currentValue: 7,
        startDate: daysAgo(90), targetDate: daysAgo(1), status: 'completed',
        milestones: [
          { value: 6,  date: daysAgo(60), achieved: true,  label: 'Kozep szint' },
          { value: 8,  date: daysAgo(30), achieved: true,  label: 'Halado' },
          { value: 10, date: daysAgo(1),  achieved: false, label: 'Mester szint' },
        ],
        progressHistory: [
          { value: 4, date: daysAgo(90), note: 'Kezdes' },
          { value: 6, date: daysAgo(60), note: 'Lathato javulas' },
          { value: 7, date: daysAgo(30), note: 'Joga sokat segit' },
        ],
        notes: 'Zarult cel – nagyon jol sikerult!'
      },
    ];
    await FitnessGoal.insertMany(fitnessGoals);
    console.log(`  ${fitnessGoals.length} fitness goals added`);

    console.log('\nDatabase seeded successfully!');
    console.log(`  Workouts      : ${EN_WORKOUTS.length + HU_WORKOUTS.length}`);
    console.log(`  Recipes       : ${EN_RECIPES.length + HU_RECIPES.length}`);
    console.log(`  Locations     : ${LOCATIONS.length}`);
    console.log(`  Users         : ${DEMO_USERS.length + HU_USERS.length}  (3 demo + 10 Hungarian)`);
    console.log(`  Weight logs   : ${totalWeight}`);
    console.log(`  Workout logs  : ${totalLogs}`);
    console.log(`  Fitness goals : ${fitnessGoals.length}`);
    console.log('\nDemo accounts (password: password123):');
    console.log('  admin@fittrack.com  — Admin');
    console.log('  demo1@fittrack.com  — Alex Johnson (intermediate)');
    console.log('  demo2@fittrack.com  — Sam Rivera (beginner)');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

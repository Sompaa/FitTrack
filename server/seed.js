const mongoose = require('mongoose');
const Workout = require('./src/models/Workout');
const Recipe = require('./src/models/Recipe');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack')
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Expanded Workout Database (20+ workouts)
const sampleWorkouts = [
  // BEGINNER WORKOUTS
  {
    name: "Beginner Indoor Full Body Workout",
    description: "Perfect for those with higher BMI, focuses on low-impact exercises that are gentle on joints",
    difficulty: "beginner",
    duration: 25,
    type: "mixed",
    equipment: ["none"],
    exercises: [
      { name: "Chair Squats", sets: 3, reps: 10, description: "Stand in front of a chair, lower yourself as if sitting, then stand up" },
      { name: "Wall Push-ups", sets: 3, reps: 8, description: "Stand arm's length from wall, lean in and push back" },
      { name: "Seated Leg Raises", sets: 3, reps: 12, description: "Sit in chair, raise one leg at a time" },
      { name: "Arm Circles", duration: 60, description: "Stand and rotate arms in circles" },
      { name: "Gentle Stretching", duration: 300, description: "Full body stretching routine" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    indoorOutdoor: "indoor",
    caloriesBurned: 150,
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop"
  },
  {
    name: "Morning Gentle Yoga",
    description: "Wake up your body with gentle stretches and breathing exercises",
    difficulty: "beginner",
    duration: 20,
    type: "flexibility",
    equipment: ["mat"],
    exercises: [
      { name: "Cat-Cow Stretch", sets: 10, description: "Alternate arching and rounding spine on hands and knees" },
      { name: "Child's Pose", duration: 60, description: "Resting pose, knees bent, arms forward" },
      { name: "Gentle Spinal Twist", sets: 5, description: "Lying on back, bring knees to one side" },
      { name: "Seated Forward Fold", duration: 60, description: "Sit and reach for toes" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    indoorOutdoor: "both",
    caloriesBurned: 100,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop"
  },
  {
    name: "Walking for Beginners",
    description: "Low-impact cardio perfect for starting your fitness journey",
    difficulty: "beginner",
    duration: 30,
    type: "cardio",
    equipment: ["none"],
    exercises: [
      { name: "Warm-up Walk", duration: 300, description: "Walk at comfortable pace" },
      { name: "Brisk Walking", duration: 1200, description: "Increase pace slightly" },
      { name: "Cool-down", duration: 300, description: "Slow walking and stretches" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    indoorOutdoor: "outdoor",
    caloriesBurned: 180,
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop"
  },
  {
    name: "Chair Exercises for Seniors",
    description: "Safe and effective exercises done while seated",
    difficulty: "beginner",
    duration: 20,
    type: "strength",
    equipment: ["none"],
    exercises: [
      { name: "Seated Marching", sets: 3, reps: 20, description: "Lift knees alternately while seated" },
      { name: "Arm Raises", sets: 3, reps: 15, description: "Raise arms overhead while seated" },
      { name: "Ankle Circles", sets: 2, reps: 10, description: "Rotate ankles in circles" },
      { name: "Shoulder Rolls", sets: 3, reps: 10, description: "Roll shoulders forward and back" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    indoorOutdoor: "indoor",
    caloriesBurned: 90,
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop"
  },
  {
    name: "Swimming for Fitness",
    description: "Full-body low-impact workout in the pool",
    difficulty: "beginner",
    duration: 30,
    type: "cardio",
    equipment: ["none"],
    exercises: [
      { name: "Water Walking", duration: 300, description: "Walk in chest-deep water" },
      { name: "Easy Swimming", duration: 1200, description: "Swim at comfortable pace" },
      { name: "Pool Stretches", duration: 300, description: "Gentle stretches in water" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 100, jointFriendly: true },
    indoorOutdoor: "indoor",
    caloriesBurned: 250,
    imageUrl: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop"
  },

  // INTERMEDIATE WORKOUTS
  {
    name: "Intermediate Running Program",
    description: "Interval running program for weight loss and cardiovascular health",
    difficulty: "intermediate",
    duration: 40,
    type: "cardio",
    equipment: ["none"],
    exercises: [
      { name: "Warm-up Walk", duration: 300, description: "Walk at comfortable pace" },
      { name: "Run/Walk Intervals", sets: 10, description: "1 min run, 2 min walk" },
      { name: "Cool-down Walk", duration: 300, description: "Slow walking" },
      { name: "Stretching", duration: 300, description: "Leg and hip stretches" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 29.9, jointFriendly: false },
    indoorOutdoor: "outdoor",
    caloriesBurned: 350,
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop"
  },
  {
    name: "Strength Training with Dumbbells",
    description: "Build muscle and strength with basic dumbbell exercises",
    difficulty: "intermediate",
    duration: 45,
    type: "strength",
    equipment: ["dumbbells"],
    exercises: [
      { name: "Bicep Curls", sets: 3, reps: 12, description: "Curl dumbbells to shoulders" },
      { name: "Shoulder Press", sets: 3, reps: 10, description: "Press dumbbells overhead" },
      { name: "Bent-over Rows", sets: 3, reps: 12, description: "Row dumbbells to chest" },
      { name: "Goblet Squats", sets: 3, reps: 15, description: "Squat holding dumbbell at chest" },
      { name: "Lunges", sets: 3, reps: 10, description: "Step forward and lower body" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: false },
    indoorOutdoor: "indoor",
    caloriesBurned: 280,
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop"
  },
  {
    name: "Cycling Workout",
    description: "Outdoor cycling for endurance and leg strength",
    difficulty: "intermediate",
    duration: 50,
    type: "cardio",
    equipment: ["none"],
    exercises: [
      { name: "Easy Ride", duration: 600, description: "Warm up at easy pace" },
      { name: "Hill Intervals", sets: 6, duration: 120, description: "Moderate hills" },
      { name: "Flat Recovery", duration: 600, description: "Easy flat riding" },
      { name: "Cool Down", duration: 600, description: "Easy pace to finish" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true },
    indoorOutdoor: "outdoor",
    caloriesBurned: 450,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop"
  },
  {
    name: "Bodyweight Circuit Training",
    description: "No equipment needed full-body workout",
    difficulty: "intermediate",
    duration: 35,
    type: "mixed",
    equipment: ["none"],
    exercises: [
      { name: "Push-ups", sets: 3, reps: 15, description: "Standard push-ups" },
      { name: "Squats", sets: 3, reps: 20, description: "Bodyweight squats" },
      { name: "Plank", sets: 3, duration: 45, description: "Hold plank position" },
      { name: "Jumping Jacks", sets: 3, reps: 30, description: "Classic jumping jacks" },
      { name: "Mountain Climbers", sets: 3, duration: 30, description: "Fast pace" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 30, jointFriendly: false },
    indoorOutdoor: "both",
    caloriesBurned: 320,
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop"
  },
  {
    name: "Pilates Core Workout",
    description: "Strengthen your core with controlled movements",
    difficulty: "intermediate",
    duration: 30,
    type: "strength",
    equipment: ["mat"],
    exercises: [
      { name: "The Hundred", sets: 1, reps: 100, description: "Pulse arms while holding legs elevated" },
      { name: "Roll Up", sets: 10, description: "Slow controlled sit-up" },
      { name: "Single Leg Circles", sets: 10, description: "Draw circles with leg" },
      { name: "Criss Cross", sets: 20, description: "Bicycle abs movement" },
      { name: "Plank to Pike", sets: 12, description: "Plank position to downward dog" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true },
    indoorOutdoor: "indoor",
    caloriesBurned: 200,
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop"
  },
  {
    name: "Vinyasa Flow Yoga",
    description: "Dynamic yoga practice linking breath with movement",
    difficulty: "intermediate",
    duration: 45,
    type: "flexibility",
    equipment: ["mat"],
    exercises: [
      { name: "Sun Salutations", sets: 5, description: "Complete flow sequence" },
      { name: "Warrior Sequence", sets: 3, description: "Warrior I, II, and III" },
      { name: "Balance Poses", sets: 3, duration: 30, description: "Tree pose and eagle pose" },
      { name: "Hip Openers", duration: 300, description: "Pigeon pose and lizard pose" },
      { name: "Savasana", duration: 300, description: "Final relaxation" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true },
    indoorOutdoor: "both",
    caloriesBurned: 240,
    imageUrl: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop"
  },
  {
    name: "Resistance Band Full Body",
    description: "Use resistance bands for a portable strength workout",
    difficulty: "intermediate",
    duration: 40,
    type: "strength",
    equipment: ["resistance-band"],
    exercises: [
      { name: "Band Squats", sets: 3, reps: 15, description: "Stand on band, hold handles at shoulders" },
      { name: "Band Chest Press", sets: 3, reps: 12, description: "Press band forward from chest" },
      { name: "Band Rows", sets: 3, reps: 15, description: "Pull band to chest" },
      { name: "Band Shoulder Raises", sets: 3, reps: 12, description: "Lateral raises with band" },
      { name: "Band Leg Curls", sets: 3, reps: 15, description: "Curl leg against band" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 35, jointFriendly: true },
    indoorOutdoor: "both",
    caloriesBurned: 250,
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop"
  },
  {
    name: "Kickboxing Cardio",
    description: "High-energy cardio with punches and kicks",
    difficulty: "intermediate",
    duration: 35,
    type: "cardio",
    equipment: ["none"],
    exercises: [
      { name: "Jab-Cross Combo", sets: 5, reps: 20, description: "Punching combinations" },
      { name: "Front Kicks", sets: 3, reps: 15, description: "Kick forward with each leg" },
      { name: "Roundhouse Kicks", sets: 3, reps: 12, description: "Circular kicks" },
      { name: "Speed Bag", sets: 3, duration: 60, description: "Fast punching motion" },
      { name: "Cool Down Shadow Boxing", duration: 300, description: "Easy pace combinations" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 30, jointFriendly: false },
    indoorOutdoor: "indoor",
    caloriesBurned: 380,
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop"
  },
  {
    name: "Step Aerobics",
    description: "Classic aerobic workout using a step platform",
    difficulty: "intermediate",
    duration: 40,
    type: "cardio",
    equipment: ["bench"],
    exercises: [
      { name: "Basic Step", sets: 5, reps: 20, description: "Step up and down" },
      { name: "V-Step", sets: 4, reps: 15, description: "Step in V pattern" },
      { name: "Knee Lifts", sets: 4, reps: 20, description: "Step up with knee raise" },
      { name: "Grapevine", sets: 3, reps: 15, description: "Side stepping pattern" },
      { name: "Cool Down Stretches", duration: 300, description: "Lower body stretches" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 32, jointFriendly: false },
    indoorOutdoor: "indoor",
    caloriesBurned: 340,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
  },
  {
    name: "TRX Suspension Training",
    description: "Bodyweight resistance training using suspension straps",
    difficulty: "intermediate",
    duration: 35,
    type: "strength",
    equipment: ["pull-up-bar"],
    exercises: [
      { name: "TRX Rows", sets: 3, reps: 12, description: "Pull body up to straps" },
      { name: "TRX Chest Press", sets: 3, reps: 12, description: "Push away from anchor point" },
      { name: "TRX Squats", sets: 3, reps: 15, description: "Squat holding straps" },
      { name: "TRX Pike", sets: 3, reps: 10, description: "Plank to pike with feet in straps" },
      { name: "TRX Bicep Curls", sets: 3, reps: 12, description: "Curl body up" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 30, jointFriendly: false },
    indoorOutdoor: "both",
    caloriesBurned: 300,
    imageUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop"
  },

  // ADVANCED WORKOUTS
  {
    name: "Advanced HIIT Workout",
    description: "High-intensity interval training for advanced fitness enthusiasts",
    difficulty: "advanced",
    duration: 30,
    type: "mixed",
    equipment: ["none"],
    exercises: [
      { name: "Burpees", sets: 5, reps: 10, description: "Full body exercise combining squat, plank, and jump" },
      { name: "Mountain Climbers", sets: 5, duration: 30, description: "Plank position, alternate bringing knees to chest" },
      { name: "Jump Squats", sets: 5, reps: 15, description: "Squat down, then jump explosively" },
      { name: "High Knees", sets: 5, duration: 30, description: "Run in place bringing knees high" },
      { name: "Plank Hold", duration: 60, description: "Hold plank position" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false },
    indoorOutdoor: "both",
    caloriesBurned: 450,
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop"
  },
  {
    name: "CrossFit WOD",
    description: "Workout of the Day - intense functional fitness",
    difficulty: "advanced",
    duration: 25,
    type: "mixed",
    equipment: ["dumbbells", "pull-up-bar"],
    exercises: [
      { name: "Thrusters", sets: 5, reps: 15, description: "Squat to overhead press" },
      { name: "Pull-ups", sets: 5, reps: 10, description: "Strict pull-ups" },
      { name: "Box Jumps", sets: 5, reps: 15, description: "Jump onto elevated surface" },
      { name: "Kettlebell Swings", sets: 5, reps: 20, description: "Hip hinge swing" },
      { name: "Burpee Pull-ups", sets: 3, reps: 10, description: "Burpee into pull-up" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 27, jointFriendly: false },
    indoorOutdoor: "indoor",
    caloriesBurned: 500,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop"
  },
  {
    name: "Marathon Training Long Run",
    description: "Endurance run for marathon preparation",
    difficulty: "advanced",
    duration: 90,
    type: "cardio",
    equipment: ["none"],
    exercises: [
      { name: "Easy Pace Warm-up", duration: 600, description: "Light jog to warm up" },
      { name: "Steady State Run", duration: 4200, description: "Consistent comfortable pace" },
      { name: "Negative Split Finish", duration: 900, description: "Increase pace gradually" },
      { name: "Walking Cool Down", duration: 600, description: "Walk and stretch" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false },
    indoorOutdoor: "outdoor",
    caloriesBurned: 900,
    imageUrl: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&h=400&fit=crop"
  },
  {
    name: "Olympic Lifting Session",
    description: "Power and strength with Olympic lifts",
    difficulty: "advanced",
    duration: 60,
    type: "strength",
    equipment: ["barbell"],
    exercises: [
      { name: "Clean and Jerk", sets: 5, reps: 3, description: "Full Olympic lift" },
      { name: "Snatch", sets: 5, reps: 3, description: "Single movement overhead lift" },
      { name: "Front Squats", sets: 4, reps: 6, description: "Squat with bar at shoulders" },
      { name: "Overhead Squats", sets: 3, reps: 8, description: "Squat with bar overhead" },
      { name: "Romanian Deadlifts", sets: 3, reps: 10, description: "Hip hinge movement" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 27, jointFriendly: false },
    indoorOutdoor: "indoor",
    caloriesBurned: 400,
    imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop"
  },
  {
    name: "Plyometric Power Training",
    description: "Explosive movements for power development",
    difficulty: "advanced",
    duration: 40,
    type: "mixed",
    equipment: ["none"],
    exercises: [
      { name: "Box Jumps", sets: 4, reps: 10, description: "Jump onto box" },
      { name: "Broad Jumps", sets: 4, reps: 8, description: "Jump forward for distance" },
      { name: "Depth Jumps", sets: 3, reps: 6, description: "Step off box and jump immediately" },
      { name: "Clap Push-ups", sets: 3, reps: 10, description: "Explosive push-up with clap" },
      { name: "Tuck Jumps", sets: 4, reps: 12, description: "Jump bringing knees to chest" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false },
    indoorOutdoor: "both",
    caloriesBurned: 420,
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop"
  },
  {
    name: "Ashtanga Yoga Primary Series",
    description: "Traditional challenging yoga sequence",
    difficulty: "advanced",
    duration: 90,
    type: "flexibility",
    equipment: ["mat"],
    exercises: [
      { name: "Sun Salutations A & B", sets: 10, description: "Traditional sequence" },
      { name: "Standing Poses", duration: 1200, description: "Full standing sequence" },
      { name: "Seated Poses", duration: 1800, description: "Forward folds and twists" },
      { name: "Finishing Sequence", duration: 900, description: "Shoulder stand and headstand" },
      { name: "Savasana", duration: 600, description: "Final deep relaxation" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 28, jointFriendly: true },
    indoorOutdoor: "both",
    caloriesBurned: 350,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
  },
  {
    name: "Triathlon Brick Workout",
    description: "Bike to run transition training",
    difficulty: "advanced",
    duration: 75,
    type: "cardio",
    equipment: ["none"],
    exercises: [
      { name: "Cycling", duration: 2700, description: "45 min moderate to hard pace" },
      { name: "Transition", duration: 300, description: "Quick change to running gear" },
      { name: "Running", duration: 1200, description: "20 min tempo run" },
      { name: "Cool Down Jog", duration: 300, description: "Easy pace recovery" }
    ],
    suitableFor: { minBMI: 0, maxBMI: 25, jointFriendly: false },
    indoorOutdoor: "outdoor",
    caloriesBurned: 850,
    imageUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=400&fit=crop"
  }
];

// Expanded Recipe Database (20+ recipes)
const sampleRecipes = [
  // BREAKFAST
  {
    name: "Protein Power Smoothie",
    description: "Quick and easy high-protein breakfast smoothie to fuel your day",
    imageUrl: "https://images.unsplash.com/photo-1526424382096-74a93e105682?w=600&h=400&fit=crop",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    nutrition: { calories: 300, protein: 25, carbs: 35, fat: 8, fiber: 6 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ["dairy"],
    ingredients: [
      { name: "Banana", amount: 1, unit: "piece" },
      { name: "Protein powder", amount: 30, unit: "g" },
      { name: "Almond milk", amount: 250, unit: "ml" },
      { name: "Rolled oats", amount: 30, unit: "g" },
      { name: "Honey", amount: 1, unit: "tbsp" }
    ],
    instructions: [
      "Add almond milk to blender",
      "Add banana, protein powder, and oats",
      "Add honey for sweetness",
      "Blend until smooth",
      "Serve immediately"
    ],
    tags: ["breakfast", "high-protein", "quick"]
  },
  {
    name: "Overnight Oats",
    description: "Prepare the night before for a quick, healthy breakfast",
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    nutrition: { calories: 350, protein: 12, carbs: 55, fat: 10, fiber: 8 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ["dairy"],
    ingredients: [
      { name: "Rolled oats", amount: 50, unit: "g" },
      { name: "Greek yogurt", amount: 100, unit: "g" },
      { name: "Milk", amount: 100, unit: "ml" },
      { name: "Mixed berries", amount: 100, unit: "g" },
      { name: "Honey", amount: 1, unit: "tbsp" },
      { name: "Chia seeds", amount: 1, unit: "tbsp" }
    ],
    instructions: [
      "Combine oats, yogurt, and milk in a jar",
      "Add chia seeds and honey",
      "Stir well to combine",
      "Top with berries",
      "Cover and refrigerate overnight",
      "Enjoy cold in the morning"
    ],
    tags: ["breakfast", "meal-prep", "quick"]
  },
  {
    name: "Avocado Toast with Eggs",
    description: "Classic healthy breakfast with protein and healthy fats",
    imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: "easy",
    nutrition: { calories: 420, protein: 18, carbs: 35, fat: 24, fiber: 10 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: true, glutenFree: true, dairyFree: true },
    allergens: ["eggs", "gluten"],
    ingredients: [
      { name: "Whole grain bread", amount: 2, unit: "slices" },
      { name: "Avocado", amount: 1, unit: "piece" },
      { name: "Eggs", amount: 2, unit: "pieces" },
      { name: "Cherry tomatoes", amount: 50, unit: "g" },
      { name: "Olive oil", amount: 1, unit: "tsp" }
    ],
    instructions: [
      "Toast bread until golden",
      "Mash avocado with salt and pepper",
      "Cook eggs to preference",
      "Spread avocado on toast",
      "Top with eggs and tomatoes",
      "Drizzle with olive oil"
    ],
    tags: ["breakfast", "quick", "high-protein"]
  },
  {
    name: "Banana Protein Pancakes",
    description: "Fluffy high-protein pancakes made with bananas",
    imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
    nutrition: { calories: 380, protein: 22, carbs: 48, fat: 12, fiber: 5 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: false, dairyFree: false },
    allergens: ["eggs", "dairy", "gluten"],
    ingredients: [
      { name: "Bananas", amount: 2, unit: "pieces" },
      { name: "Eggs", amount: 3, unit: "pieces" },
      { name: "Protein powder", amount: 40, unit: "g" },
      { name: "Oat flour", amount: 50, unit: "g" },
      { name: "Baking powder", amount: 1, unit: "tsp" },
      { name: "Maple syrup", amount: 2, unit: "tbsp" }
    ],
    instructions: [
      "Mash bananas in bowl",
      "Beat in eggs and protein powder",
      "Add oat flour and baking powder",
      "Heat pan with cooking spray",
      "Cook pancakes until bubbles form",
      "Flip and cook until golden",
      "Serve with maple syrup"
    ],
    tags: ["breakfast", "high-protein"]
  },
  {
    name: "Green Breakfast Smoothie Bowl",
    description: "Nutrient-packed smoothie bowl with superfoods",
    imageUrl: "https://images.unsplash.com/photo-1590137876181-4d3df9430489?w=600&h=400&fit=crop",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    nutrition: { calories: 320, protein: 15, carbs: 45, fat: 12, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [
      { name: "Spinach", amount: 50, unit: "g" },
      { name: "Frozen banana", amount: 1, unit: "piece" },
      { name: "Protein powder", amount: 25, unit: "g" },
      { name: "Almond milk", amount: 200, unit: "ml" },
      { name: "Granola", amount: 30, unit: "g" },
      { name: "Fresh berries", amount: 50, unit: "g" },
      { name: "Chia seeds", amount: 1, unit: "tbsp" }
    ],
    instructions: [
      "Blend spinach, banana, protein powder, and milk until smooth",
      "Pour into bowl",
      "Top with granola, berries, and chia seeds",
      "Enjoy with spoon"
    ],
    tags: ["breakfast", "high-protein"]
  },

  // LUNCH
  {
    name: "Grilled Chicken Salad",
    description: "Healthy, protein-packed salad perfect for lunch or dinner",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
    nutrition: { calories: 400, protein: 45, carbs: 20, fat: 15, fiber: 8 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: true, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [
      { name: "Chicken breast", amount: 300, unit: "g" },
      { name: "Mixed greens", amount: 200, unit: "g" },
      { name: "Cherry tomatoes", amount: 100, unit: "g" },
      { name: "Cucumber", amount: 1, unit: "piece" },
      { name: "Olive oil", amount: 2, unit: "tbsp" },
      { name: "Lemon juice", amount: 1, unit: "tbsp" }
    ],
    instructions: [
      "Season chicken with salt, pepper, and herbs",
      "Grill chicken for 6-7 minutes per side until cooked through",
      "Let chicken rest for 5 minutes, then slice",
      "Wash and chop vegetables",
      "Combine greens, tomatoes, and cucumber in bowl",
      "Top with sliced chicken",
      "Drizzle with olive oil and lemon juice"
    ],
    tags: ["lunch", "dinner", "high-protein"]
  },
  {
    name: "Quinoa Power Bowl",
    description: "Complete protein bowl with quinoa and vegetables",
    imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    difficulty: "medium",
    nutrition: { calories: 450, protein: 18, carbs: 65, fat: 15, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [
      { name: "Quinoa", amount: 150, unit: "g" },
      { name: "Roasted chickpeas", amount: 150, unit: "g" },
      { name: "Sweet potato", amount: 200, unit: "g" },
      { name: "Kale", amount: 100, unit: "g" },
      { name: "Tahini", amount: 2, unit: "tbsp" },
      { name: "Lemon juice", amount: 1, unit: "tbsp" }
    ],
    instructions: [
      "Cook quinoa according to package",
      "Roast diced sweet potato at 200°C for 25 min",
      "Sauté kale with garlic",
      "Combine all in bowl",
      "Make dressing with tahini and lemon",
      "Drizzle and serve"
    ],
    tags: ["lunch", "high-protein"]
  },
  {
    name: "Turkey Wrap with Hummus",
    description: "Quick and easy protein-packed wrap",
    imageUrl: "https://images.unsplash.com/photo-1623428187425-5add2e4c9a1d?w=600&h=400&fit=crop",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    nutrition: { calories: 380, protein: 28, carbs: 45, fat: 12, fiber: 8 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: false, glutenFree: false, dairyFree: true },
    allergens: ["gluten"],
    ingredients: [
      { name: "Whole wheat tortilla", amount: 1, unit: "piece" },
      { name: "Turkey breast slices", amount: 100, unit: "g" },
      { name: "Hummus", amount: 50, unit: "g" },
      { name: "Lettuce", amount: 50, unit: "g" },
      { name: "Tomato", amount: 1, unit: "piece" },
      { name: "Cucumber", amount: 50, unit: "g" }
    ],
    instructions: [
      "Spread hummus on tortilla",
      "Layer turkey, lettuce, tomato, cucumber",
      "Roll tightly",
      "Cut in half and serve"
    ],
    tags: ["lunch", "quick", "high-protein"]
  },
  {
    name: "Asian Tofu Stir-Fry",
    description: "Colorful vegetable stir-fry with crispy tofu",
    imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "medium",
    nutrition: { calories: 360, protein: 20, carbs: 42, fat: 14, fiber: 8 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: false, dairyFree: true },
    allergens: ["soy"],
    ingredients: [
      { name: "Firm tofu", amount: 250, unit: "g" },
      { name: "Mixed vegetables", amount: 300, unit: "g" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Garlic", amount: 3, unit: "pieces" },
      { name: "Ginger", amount: 1, unit: "tbsp" },
      { name: "Brown rice", amount: 150, unit: "g" }
    ],
    instructions: [
      "Press and cube tofu",
      "Pan-fry tofu until golden",
      "Set aside tofu",
      "Stir-fry vegetables with garlic and ginger",
      "Add soy sauce and tofu back in",
      "Serve over brown rice"
    ],
    tags: ["lunch", "dinner"]
  },
  {
    name: "Mediterranean Chickpea Salad",
    description: "Fresh and filling salad with Mediterranean flavors",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: "easy",
    nutrition: { calories: 340, protein: 14, carbs: 48, fat: 12, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [
      { name: "Chickpeas", amount: 400, unit: "g" },
      { name: "Cucumber", amount: 1, unit: "piece" },
      { name: "Tomatoes", amount: 200, unit: "g" },
      { name: "Red onion", amount: 1, unit: "piece" },
      { name: "Feta cheese", amount: 50, unit: "g" },
      { name: "Olive oil", amount: 2, unit: "tbsp" },
      { name: "Lemon juice", amount: 2, unit: "tbsp" }
    ],
    instructions: [
      "Drain and rinse chickpeas",
      "Dice cucumber, tomatoes, onion",
      "Combine all vegetables and chickpeas",
      "Crumble feta on top",
      "Mix olive oil and lemon juice",
      "Toss and serve"
    ],
    tags: ["lunch"]
  },

  // DINNER
  {
    name: "Vegan Buddha Bowl",
    description: "Nutritious and colorful plant-based meal packed with vitamins",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    difficulty: "medium",
    nutrition: { calories: 500, protein: 15, carbs: 70, fat: 18, fiber: 12 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [
      { name: "Quinoa", amount: 150, unit: "g" },
      { name: "Chickpeas", amount: 200, unit: "g" },
      { name: "Sweet potato", amount: 1, unit: "piece" },
      { name: "Broccoli", amount: 200, unit: "g" },
      { name: "Avocado", amount: 1, unit: "piece" },
      { name: "Tahini", amount: 2, unit: "tbsp" }
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Roast chickpeas and diced sweet potato at 200°C for 25 minutes",
      "Steam broccoli until tender",
      "Divide quinoa between two bowls",
      "Top with roasted chickpeas, sweet potato, and broccoli",
      "Add sliced avocado",
      "Drizzle with tahini dressing"
    ],
    tags: ["lunch", "dinner"]
  },
  {
    name: "Baked Salmon with Asparagus",
    description: "Omega-3 rich dinner with roasted vegetables",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop",
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: "easy",
    nutrition: { calories: 420, protein: 38, carbs: 15, fat: 24, fiber: 6 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: true, paleo: true, glutenFree: true, dairyFree: true },
    allergens: ["fish"],
    ingredients: [
      { name: "Salmon fillets", amount: 300, unit: "g" },
      { name: "Asparagus", amount: 250, unit: "g" },
      { name: "Olive oil", amount: 2, unit: "tbsp" },
      { name: "Lemon", amount: 1, unit: "piece" },
      { name: "Garlic", amount: 2, unit: "pieces" }
    ],
    instructions: [
      "Preheat oven to 200°C",
      "Place salmon and asparagus on baking sheet",
      "Drizzle with olive oil",
      "Add minced garlic and lemon slices",
      "Bake for 15-20 minutes",
      "Serve immediately"
    ],
    tags: ["dinner", "high-protein"]
  },
  {
    name: "Chicken Fajita Bowl",
    description: "Mexican-inspired bowl with grilled chicken and peppers",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "medium",
    nutrition: { calories: 480, protein: 42, carbs: 52, fat: 14, fiber: 10 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ["dairy"],
    ingredients: [
      { name: "Chicken breast", amount: 300, unit: "g" },
      { name: "Bell peppers", amount: 200, unit: "g" },
      { name: "Onion", amount: 1, unit: "piece" },
      { name: "Brown rice", amount: 150, unit: "g" },
      { name: "Black beans", amount: 100, unit: "g" },
      { name: "Salsa", amount: 50, unit: "g" },
      { name: "Cheese", amount: 30, unit: "g" }
    ],
    instructions: [
      "Cook rice according to package",
      "Slice chicken, peppers, and onion",
      "Season with fajita spices",
      "Sauté chicken until cooked",
      "Add vegetables and cook until tender",
      "Serve over rice with beans",
      "Top with salsa and cheese"
    ],
    tags: ["dinner", "high-protein"]
  },
  {
    name: "Lentil Curry",
    description: "Hearty plant-based curry with aromatic spices",
    imageUrl: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=600&h=400&fit=crop",
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
    nutrition: { calories: 380, protein: 18, carbs: 62, fat: 8, fiber: 16 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [
      { name: "Red lentils", amount: 250, unit: "g" },
      { name: "Coconut milk", amount: 400, unit: "ml" },
      { name: "Tomatoes", amount: 400, unit: "g" },
      { name: "Onion", amount: 1, unit: "piece" },
      { name: "Curry powder", amount: 2, unit: "tbsp" },
      { name: "Spinach", amount: 100, unit: "g" }
    ],
    instructions: [
      "Sauté onion until soft",
      "Add curry powder and cook for 1 minute",
      "Add lentils, tomatoes, and coconut milk",
      "Simmer for 25 minutes",
      "Stir in spinach until wilted",
      "Serve with rice or naan"
    ],
    tags: ["dinner"]
  },
  {
    name: "Beef Stir-Fry with Broccoli",
    description: "Quick and easy high-protein dinner",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "medium",
    nutrition: { calories: 420, protein: 38, carbs: 35, fat: 16, fiber: 6 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: true, glutenFree: false, dairyFree: true },
    allergens: ["soy"],
    ingredients: [
      { name: "Beef sirloin", amount: 300, unit: "g" },
      { name: "Broccoli", amount: 300, unit: "g" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Garlic", amount: 3, unit: "pieces" },
      { name: "Ginger", amount: 1, unit: "tbsp" },
      { name: "Rice", amount: 150, unit: "g" }
    ],
    instructions: [
      "Slice beef thinly",
      "Marinate in soy sauce for 10 minutes",
      "Stir-fry beef on high heat",
      "Remove beef, add broccoli",
      "Add garlic and ginger",
      "Return beef to pan",
      "Serve over rice"
    ],
    tags: ["dinner", "high-protein"]
  },

  // SPECIAL DIETS
  {
    name: "Keto Cauliflower Pizza",
    description: "Low-carb pizza alternative with cauliflower crust",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "medium",
    nutrition: { calories: 350, protein: 20, carbs: 12, fat: 25, fiber: 5 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: true, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ["dairy", "eggs"],
    ingredients: [
      { name: "Cauliflower", amount: 1, unit: "piece" },
      { name: "Mozzarella cheese", amount: 200, unit: "g" },
      { name: "Parmesan cheese", amount: 50, unit: "g" },
      { name: "Eggs", amount: 2, unit: "pieces" },
      { name: "Tomato sauce", amount: 100, unit: "ml" },
      { name: "Toppings of choice", amount: 100, unit: "g" }
    ],
    instructions: [
      "Rice cauliflower in food processor",
      "Microwave riced cauliflower for 8 minutes",
      "Squeeze out excess moisture using cheesecloth",
      "Mix cauliflower, 100g mozzarella, parmesan, eggs, salt, and pepper",
      "Form into pizza crust shape on baking sheet",
      "Bake at 200°C for 20 minutes until golden",
      "Add sauce, remaining cheese, and toppings",
      "Bake for another 10 minutes"
    ],
    tags: ["dinner", "low-carb"]
  },
  {
    name: "Paleo Meatballs with Zucchini Noodles",
    description: "Grain-free meatballs with vegetable noodles",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    difficulty: "medium",
    nutrition: { calories: 390, protein: 35, carbs: 18, fat: 22, fiber: 5 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: false, paleo: true, glutenFree: true, dairyFree: true },
    allergens: ["eggs"],
    ingredients: [
      { name: "Ground beef", amount: 500, unit: "g" },
      { name: "Egg", amount: 1, unit: "piece" },
      { name: "Almond flour", amount: 50, unit: "g" },
      { name: "Zucchini", amount: 3, unit: "pieces" },
      { name: "Tomato sauce", amount: 300, unit: "ml" },
      { name: "Herbs", amount: 2, unit: "tbsp" }
    ],
    instructions: [
      "Mix beef, egg, almond flour, and herbs",
      "Form into meatballs",
      "Bake at 200°C for 20 minutes",
      "Spiralize zucchini into noodles",
      "Sauté zucchini noodles for 3 minutes",
      "Heat tomato sauce",
      "Serve meatballs over zoodles with sauce"
    ],
    tags: ["dinner", "low-carb", "high-protein"]
  },
  {
    name: "Vegan Protein Burger",
    description: "Plant-based burger packed with protein",
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    nutrition: { calories: 380, protein: 22, carbs: 48, fat: 12, fiber: 14 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: false, dairyFree: true },
    allergens: ["gluten", "soy"],
    ingredients: [
      { name: "Black beans", amount: 400, unit: "g" },
      { name: "Quinoa", amount: 100, unit: "g" },
      { name: "Oats", amount: 50, unit: "g" },
      { name: "Burger buns", amount: 4, unit: "pieces" },
      { name: "Lettuce", amount: 100, unit: "g" },
      { name: "Tomato", amount: 2, unit: "pieces" }
    ],
    instructions: [
      "Mash black beans in bowl",
      "Mix in cooked quinoa and oats",
      "Season with spices",
      "Form into 4 patties",
      "Pan-fry or grill for 5 minutes per side",
      "Assemble burgers with buns and toppings"
    ],
    tags: ["dinner"]
  },
  {
    name: "Shrimp and Avocado Salad",
    description: "Light and refreshing high-protein salad",
    imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 5,
    servings: 2,
    difficulty: "easy",
    nutrition: { calories: 340, protein: 32, carbs: 18, fat: 18, fiber: 8 },
    dietaryInfo: { vegan: false, vegetarian: false, keto: true, paleo: true, glutenFree: true, dairyFree: true },
    allergens: ["shellfish"],
    ingredients: [
      { name: "Shrimp", amount: 300, unit: "g" },
      { name: "Avocado", amount: 1, unit: "piece" },
      { name: "Mixed greens", amount: 150, unit: "g" },
      { name: "Cherry tomatoes", amount: 100, unit: "g" },
      { name: "Lime juice", amount: 2, unit: "tbsp" },
      { name: "Olive oil", amount: 1, unit: "tbsp" }
    ],
    instructions: [
      "Cook shrimp in pan for 2-3 minutes per side",
      "Dice avocado",
      "Combine greens, tomatoes, and avocado",
      "Top with cooked shrimp",
      "Make dressing with lime and oil",
      "Drizzle and serve"
    ],
    tags: ["lunch", "dinner", "high-protein"]
  },
  {
    name: "Egg White Veggie Omelette",
    description: "Low-fat, high-protein breakfast option",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop",
    prepTime: 10,
    cookTime: 10,
    servings: 1,
    difficulty: "easy",
    nutrition: { calories: 220, protein: 24, carbs: 12, fat: 8, fiber: 4 },
    dietaryInfo: { vegan: false, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: false },
    allergens: ["eggs", "dairy"],
    ingredients: [
      { name: "Egg whites", amount: 4, unit: "pieces" },
      { name: "Spinach", amount: 50, unit: "g" },
      { name: "Mushrooms", amount: 50, unit: "g" },
      { name: "Bell pepper", amount: 50, unit: "g" },
      { name: "Cheese", amount: 30, unit: "g" }
    ],
    instructions: [
      "Whisk egg whites",
      "Sauté vegetables until tender",
      "Pour egg whites over vegetables",
      "Cook until edges set",
      "Add cheese on half",
      "Fold and serve"
    ],
    tags: ["breakfast", "high-protein", "low-carb"]
  },
  {
    name: "Sweet Potato and Black Bean Tacos",
    description: "Vegetarian tacos with fiber and nutrients",
    imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    difficulty: "easy",
    nutrition: { calories: 420, protein: 16, carbs: 72, fat: 10, fiber: 16 },
    dietaryInfo: { vegan: true, vegetarian: true, keto: false, paleo: false, glutenFree: true, dairyFree: true },
    allergens: [],
    ingredients: [
      { name: "Sweet potatoes", amount: 2, unit: "pieces" },
      { name: "Black beans", amount: 400, unit: "g" },
      { name: "Corn tortillas", amount: 6, unit: "pieces" },
      { name: "Avocado", amount: 1, unit: "piece" },
      { name: "Lime", amount: 1, unit: "piece" },
      { name: "Cilantro", amount: 20, unit: "g" }
    ],
    instructions: [
      "Roast diced sweet potatoes at 200°C for 25 min",
      "Heat black beans",
      "Warm tortillas",
      "Fill tortillas with sweet potato and beans",
      "Top with avocado, lime, and cilantro"
    ],
    tags: ["dinner"]
  }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('Clearing existing data...');
    await Workout.deleteMany({});
    await Recipe.deleteMany({});

    console.log('Seeding workouts...');
    await Workout.insertMany(sampleWorkouts);
    console.log(`✓ ${sampleWorkouts.length} workouts added`);

    console.log('Seeding recipes...');
    await Recipe.insertMany(sampleRecipes);
    console.log(`✓ ${sampleRecipes.length} recipes added`);

    console.log('\n✓ Database seeded successfully!');
    console.log(`Total workouts: ${sampleWorkouts.length}`);
    console.log(`Total recipes: ${sampleRecipes.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();

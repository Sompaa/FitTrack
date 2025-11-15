const mongoose = require('mongoose');
const Workout = require('./src/models/Workout');
const Recipe = require('./src/models/Recipe');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample Workouts
const sampleWorkouts = [
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
    suitableFor: {
      minBMI: 0,
      maxBMI: 100,
      jointFriendly: true
    },
    indoorOutdoor: "indoor",
    caloriesBurned: 150,
    imageUrl: "/images/default-workout.jpg"
  },
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
    suitableFor: {
      minBMI: 0,
      maxBMI: 29.9,
      jointFriendly: false
    },
    indoorOutdoor: "outdoor",
    caloriesBurned: 350,
    imageUrl: "/images/default-workout.jpg"
  },
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
    suitableFor: {
      minBMI: 0,
      maxBMI: 25,
      jointFriendly: false
    },
    indoorOutdoor: "both",
    caloriesBurned: 450,
    imageUrl: "/images/default-workout.jpg"
  },
  {
    name: "Yoga Flow for Flexibility",
    description: "Gentle yoga sequence suitable for all fitness levels",
    difficulty: "beginner",
    duration: 30,
    type: "flexibility",
    equipment: ["mat"],
    exercises: [
      { name: "Mountain Pose", duration: 60, description: "Stand tall with feet together" },
      { name: "Downward Dog", duration: 60, description: "Inverted V-shape pose" },
      { name: "Warrior I", sets: 2, duration: 30, description: "Lunge position with arms raised" },
      { name: "Child's Pose", duration: 90, description: "Resting pose, knees bent, arms forward" },
      { name: "Cat-Cow Stretch", sets: 10, description: "Alternate arching and rounding spine" }
    ],
    suitableFor: {
      minBMI: 0,
      maxBMI: 100,
      jointFriendly: true
    },
    indoorOutdoor: "both",
    caloriesBurned: 120,
    imageUrl: "/images/default-workout.jpg"
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
    suitableFor: {
      minBMI: 0,
      maxBMI: 35,
      jointFriendly: false
    },
    indoorOutdoor: "indoor",
    caloriesBurned: 280,
    imageUrl: "/images/default-workout.jpg"
  }
];

// Sample Recipes
const sampleRecipes = [
  {
    name: "Protein Power Smoothie",
    description: "Quick and easy high-protein breakfast smoothie to fuel your day",
    imageUrl: "/images/default-recipe.jpg",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    nutrition: {
      calories: 300,
      protein: 25,
      carbs: 35,
      fat: 8,
      fiber: 6
    },
    dietaryInfo: {
      vegan: false,
      vegetarian: true,
      keto: false,
      paleo: false,
      glutenFree: true,
      dairyFree: false
    },
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
    name: "Grilled Chicken Salad",
    description: "Healthy, protein-packed salad perfect for lunch or dinner",
    imageUrl: "/images/default-recipe.jpg",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
    nutrition: {
      calories: 400,
      protein: 45,
      carbs: 20,
      fat: 15,
      fiber: 8
    },
    dietaryInfo: {
      vegan: false,
      vegetarian: false,
      keto: false,
      paleo: true,
      glutenFree: true,
      dairyFree: true
    },
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
    name: "Vegan Buddha Bowl",
    description: "Nutritious and colorful plant-based meal packed with vitamins",
    imageUrl: "/images/default-recipe.jpg",
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    difficulty: "medium",
    nutrition: {
      calories: 500,
      protein: 15,
      carbs: 70,
      fat: 18,
      fiber: 12
    },
    dietaryInfo: {
      vegan: true,
      vegetarian: true,
      keto: false,
      paleo: false,
      glutenFree: true,
      dairyFree: true
    },
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
    name: "Keto Cauliflower Pizza",
    description: "Low-carb pizza alternative with cauliflower crust",
    imageUrl: "/images/default-recipe.jpg",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "medium",
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 12,
      fat: 25,
      fiber: 5
    },
    dietaryInfo: {
      vegan: false,
      vegetarian: true,
      keto: true,
      paleo: false,
      glutenFree: true,
      dairyFree: false
    },
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
    name: "Overnight Oats",
    description: "Prepare the night before for a quick, healthy breakfast",
    imageUrl: "/images/default-recipe.jpg",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    nutrition: {
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 10,
      fiber: 8
    },
    dietaryInfo: {
      vegan: false,
      vegetarian: true,
      keto: false,
      paleo: false,
      glutenFree: true,
      dairyFree: false
    },
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
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();

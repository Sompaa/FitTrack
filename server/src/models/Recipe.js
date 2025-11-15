const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'cup', 'cups', 'tbsp', 'tsp', 'piece', 'pieces', 'slice', 'slices']
  }
});

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide recipe name'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: '/images/default-recipe.jpg'
  },
  prepTime: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  cookTime: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
    index: true
  },
  nutrition: {
    calories: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    protein: {
      type: Number, // grams
      default: 0
    },
    carbs: {
      type: Number, // grams
      default: 0
    },
    fat: {
      type: Number, // grams
      default: 0
    },
    fiber: {
      type: Number, // grams
      default: 0
    }
  },
  dietaryInfo: {
    vegan: {
      type: Boolean,
      default: false,
      index: true
    },
    vegetarian: {
      type: Boolean,
      default: false,
      index: true
    },
    keto: {
      type: Boolean,
      default: false,
      index: true
    },
    paleo: {
      type: Boolean,
      default: false,
      index: true
    },
    glutenFree: {
      type: Boolean,
      default: false,
      index: true
    },
    dairyFree: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'eggs', 'soy', 'gluten', 'shellfish', 'fish']
  }],
  ingredients: [ingredientSchema],
  instructions: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'high-protein', 'low-carb', 'quick', 'meal-prep']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to search recipes with filters
recipeSchema.statics.searchRecipes = async function(filters) {
  const query = {};

  // Text search
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  // Calorie range
  if (filters.minCalories || filters.maxCalories) {
    query['nutrition.calories'] = {};
    if (filters.minCalories) query['nutrition.calories'].$gte = filters.minCalories;
    if (filters.maxCalories) query['nutrition.calories'].$lte = filters.maxCalories;
  }

  // Dietary preferences
  if (filters.vegan) query['dietaryInfo.vegan'] = true;
  if (filters.vegetarian) query['dietaryInfo.vegetarian'] = true;
  if (filters.keto) query['dietaryInfo.keto'] = true;
  if (filters.paleo) query['dietaryInfo.paleo'] = true;
  if (filters.glutenFree) query['dietaryInfo.glutenFree'] = true;
  if (filters.dairyFree) query['dietaryInfo.dairyFree'] = true;

  // Exclude allergens
  if (filters.excludeAllergens && filters.excludeAllergens.length > 0) {
    query.allergens = { $nin: filters.excludeAllergens };
  }

  // Meal type
  if (filters.mealType) {
    query.tags = filters.mealType;
  }

  // Difficulty
  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  let queryBuilder = this.find(query);

  // Sorting
  if (filters.sortBy) {
    const sortOptions = {
      'calories-asc': { 'nutrition.calories': 1 },
      'calories-desc': { 'nutrition.calories': -1 },
      'prepTime': { prepTime: 1 },
      'difficulty': { difficulty: 1 }
    };
    queryBuilder = queryBuilder.sort(sortOptions[filters.sortBy] || { createdAt: -1 });
  }

  return queryBuilder.limit(filters.limit || 50);
};

// Text index for search
recipeSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);

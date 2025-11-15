const Recipe = require('../models/Recipe');

// @desc    Get all recipes with filters
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      minCalories: parseInt(req.query.minCalories),
      maxCalories: parseInt(req.query.maxCalories),
      vegan: req.query.vegan === 'true',
      vegetarian: req.query.vegetarian === 'true',
      keto: req.query.keto === 'true',
      paleo: req.query.paleo === 'true',
      glutenFree: req.query.glutenFree === 'true',
      dairyFree: req.query.dairyFree === 'true',
      excludeAllergens: req.query.excludeAllergens ? req.query.excludeAllergens.split(',') : [],
      mealType: req.query.mealType,
      difficulty: req.query.difficulty,
      sortBy: req.query.sortBy,
      limit: parseInt(req.query.limit) || 50
    };

    const recipes = await Recipe.searchRecipes(filters);

    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message
    });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe',
      error: error.message
    });
  }
};

const Workout = require('../models/Workout');
const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');

// @desc    Get all workouts with filters
// @route   GET /api/workouts
// @access  Public
exports.getWorkouts = async (req, res) => {
  try {
    const { difficulty, type, equipment, indoorOutdoor, limit } = req.query;

    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;
    if (equipment) filter.equipment = equipment;
    if (indoorOutdoor) filter.indoorOutdoor = { $in: [indoorOutdoor, 'both'] };

    const workouts = await Workout.find(filter).limit(parseInt(limit) || 50);

    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workouts',
      error: error.message
    });
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Public
exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout',
      error: error.message
    });
  }
};

// @desc    Get personalized workout recommendations
// @route   GET /api/workouts/recommended
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bmi = user.calculateBMI();
    const bmiCategory = user.getBMICategory();

    const filters = {
      difficulty: user.fitnessLevel,
      bmi: bmi,
      limit: 5
    };

    // BMI-based filtering
    if (bmiCategory === 'obese') {
      // Recommend low-impact, joint-friendly exercises
      filters.jointFriendly = true;
      filters.type = 'flexibility'; // Can also include 'strength'
    } else if (bmiCategory === 'overweight') {
      // Mix of cardio and strength, moderate impact
      // No specific restriction, but prefer joint-friendly
    }

    const workouts = await Workout.findSuitable(filters);

    res.json({
      success: true,
      count: workouts.length,
      data: workouts,
      userInfo: {
        bmi,
        bmiCategory,
        fitnessLevel: user.fitnessLevel
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

// @desc    Log completed workout
// @route   POST /api/workouts/log
// @access  Private
exports.logWorkout = async (req, res) => {
  try {
    const { workoutId, duration, caloriesBurned, difficulty, notes } = req.body;

    if (!workoutId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide workoutId and duration'
      });
    }

    // Verify workout exists
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    const workoutLog = await WorkoutLog.create({
      userId: req.user._id,
      workoutId,
      duration,
      caloriesBurned: caloriesBurned || workout.caloriesBurned,
      difficulty,
      notes
    });

    await workoutLog.populate('workoutId');

    res.status(201).json({
      success: true,
      data: workoutLog
    });
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging workout',
      error: error.message
    });
  }
};

// @desc    Get user's workout history
// @route   GET /api/workouts/my-logs
// @access  Private
exports.getMyLogs = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const logs = await WorkoutLog.getHistory(req.user._id, days);

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Get my logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout logs',
      error: error.message
    });
  }
};

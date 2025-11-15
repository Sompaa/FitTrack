const User = require('../models/User');
const WeightLog = require('../models/WeightLog');
const WorkoutLog = require('../models/WorkoutLog');

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'height', 'currentWeight', 'goalWeight', 'dateOfBirth', 'gender', 'fitnessLevel', 'preferences'];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        currentWeight: user.currentWeight,
        goalWeight: user.goalWeight,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        fitnessLevel: user.fitnessLevel,
        preferences: user.preferences,
        bmi: user.calculateBMI(),
        bmiCategory: user.getBMICategory()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/me/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;

    // Get weight stats
    const weightHistory = await WeightLog.getHistory(userId, days);
    const latestWeight = await WeightLog.getLatest(userId);

    // Get workout stats
    const workoutStats = await WorkoutLog.getStats(userId, days);

    // Calculate weight change
    let weightChange = 0;
    if (weightHistory.length >= 2) {
      const oldest = weightHistory[0].weight;
      const newest = weightHistory[weightHistory.length - 1].weight;
      weightChange = newest - oldest;
    }

    res.json({
      success: true,
      stats: {
        currentWeight: latestWeight ? latestWeight.weight : req.user.currentWeight,
        currentBMI: req.user.calculateBMI(),
        bmiCategory: req.user.getBMICategory(),
        goalWeight: req.user.goalWeight,
        weightChange: Math.round(weightChange * 10) / 10,
        weightToGoal: req.user.goalWeight ? Math.round((req.user.currentWeight - req.user.goalWeight) * 10) / 10 : 0,
        workouts: {
          totalWorkouts: workoutStats.totalWorkouts,
          totalDuration: workoutStats.totalDuration,
          totalCalories: workoutStats.totalCalories,
          avgDuration: Math.round(workoutStats.avgDuration)
        },
        period: days
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/me
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    // Delete user's weight logs
    await WeightLog.deleteMany({ userId: req.user._id });

    // Delete user's workout logs
    await WorkoutLog.deleteMany({ userId: req.user._id });

    // Delete user
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
};

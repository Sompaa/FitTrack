const User = require('../models/User');
const WeightLog = require('../models/WeightLog');
const WorkoutLog = require('../models/WorkoutLog');

// @desc    List all registered users
// @route   GET /api/admin/users
// @access  Admin only
exports.getAllUsers = async (req, res) => {
  try {
    // Exclude password field; sort newest first
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('[admin] getAllUsers failed:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// @desc    Get weight log history for any user
// @route   GET /api/admin/users/:id/weight
// @access  Admin only
exports.getUserWeight = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    // Reuse the static method already defined on WeightLog
    const logs = await WeightLog.getHistory(req.params.id, Number(days));

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error(`[admin] getUserWeight failed for user ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Error fetching weight logs' });
  }
};

// @desc    Get workout log history for any user
// @route   GET /api/admin/users/:id/workouts
// @access  Admin only
exports.getUserWorkouts = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    // Reuse the static method already defined on WorkoutLog
    const logs = await WorkoutLog.getHistory(req.params.id, Number(days));

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error(`[admin] getUserWorkouts failed for user ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Error fetching workout logs' });
  }
};

// @desc    Get aggregated stats for any user
// @route   GET /api/admin/users/:id/stats
// @access  Admin only
exports.getUserStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.params.id;

    // Run weight and workout queries in parallel for speed
    const [weightStats, workoutStats, latestWeight] = await Promise.all([
      WeightLog.getHistory(userId, Number(days)),
      WorkoutLog.getStats(userId, Number(days)),
      WeightLog.getLatest(userId)
    ]);

    res.json({
      success: true,
      data: {
        weightLogs: weightStats,
        latestWeight: latestWeight ? latestWeight.weight : null,
        latestBmi: latestWeight ? latestWeight.bmi : null,
        workouts: workoutStats
      }
    });
  } catch (error) {
    console.error(`[admin] getUserStats failed for user ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Error fetching user stats' });
  }
};

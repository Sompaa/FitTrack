const WeightLog = require('../models/WeightLog');
const User = require('../models/User');

// @desc    Get all weight entries for user
// @route   GET /api/weight
// @access  Private
exports.getWeightLogs = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const weightLogs = await WeightLog.getHistory(req.user._id, days);

    res.json({
      success: true,
      count: weightLogs.length,
      data: weightLogs
    });
  } catch (error) {
    console.error('Get weight logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weight logs',
      error: error.message
    });
  }
};

// @desc    Log new weight entry
// @route   POST /api/weight
// @access  Private
exports.logWeight = async (req, res) => {
  try {
    const { weight, date, notes } = req.body;

    if (!weight) {
      return res.status(400).json({
        success: false,
        message: 'Please provide weight'
      });
    }

    // Calculate BMI
    const user = await User.findById(req.user._id);
    let bmi = null;
    if (user.height) {
      const heightInMeters = user.height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
      bmi = Math.round(bmi * 10) / 10;
    }

    // Create weight log
    const weightLog = await WeightLog.create({
      userId: req.user._id,
      weight,
      bmi,
      date: date || Date.now(),
      notes
    });

    // Update user's current weight
    user.currentWeight = weight;
    await user.save();

    res.status(201).json({
      success: true,
      data: weightLog
    });
  } catch (error) {
    console.error('Log weight error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging weight',
      error: error.message
    });
  }
};

// @desc    Update weight entry
// @route   PUT /api/weight/:id
// @access  Private
exports.updateWeightLog = async (req, res) => {
  try {
    let weightLog = await WeightLog.findById(req.params.id);

    if (!weightLog) {
      return res.status(404).json({
        success: false,
        message: 'Weight log not found'
      });
    }

    // Make sure user owns the weight log
    if (weightLog.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this weight log'
      });
    }

    // Update
    const { weight, date, notes } = req.body;

    if (weight) {
      weightLog.weight = weight;
      // Recalculate BMI
      const user = await User.findById(req.user._id);
      if (user.height) {
        const heightInMeters = user.height / 100;
        weightLog.bmi = weight / (heightInMeters * heightInMeters);
        weightLog.bmi = Math.round(weightLog.bmi * 10) / 10;
      }
    }
    if (date) weightLog.date = date;
    if (notes !== undefined) weightLog.notes = notes;

    await weightLog.save();

    res.json({
      success: true,
      data: weightLog
    });
  } catch (error) {
    console.error('Update weight log error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating weight log',
      error: error.message
    });
  }
};

// @desc    Delete weight entry
// @route   DELETE /api/weight/:id
// @access  Private
exports.deleteWeightLog = async (req, res) => {
  try {
    const weightLog = await WeightLog.findById(req.params.id);

    if (!weightLog) {
      return res.status(404).json({
        success: false,
        message: 'Weight log not found'
      });
    }

    // Make sure user owns the weight log
    if (weightLog.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this weight log'
      });
    }

    await weightLog.deleteOne();

    res.json({
      success: true,
      message: 'Weight log deleted'
    });
  } catch (error) {
    console.error('Delete weight log error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting weight log',
      error: error.message
    });
  }
};

// @desc    Get weight data for charts
// @route   GET /api/weight/chart
// @access  Private
exports.getChartData = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const weightLogs = await WeightLog.getHistory(req.user._id, days);

    const chartData = {
      labels: weightLogs.map(log => new Date(log.date).toLocaleDateString()),
      weights: weightLogs.map(log => log.weight),
      bmis: weightLogs.map(log => log.bmi || 0)
    };

    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chart data',
      error: error.message
    });
  }
};

// @desc    Calculate BMI
// @route   POST /api/bmi/calculate
// @access  Public
exports.calculateBMI = async (req, res) => {
  try {
    const { height, weight } = req.body;

    if (!height || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both height and weight'
      });
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = Math.round(bmi * 10) / 10;

    let category, color, recommendation;

    if (roundedBMI < 18.5) {
      category = 'Underweight';
      color = '#3498db';
      recommendation = 'Consider consulting with a nutritionist for healthy weight gain strategies.';
    } else if (roundedBMI < 25) {
      category = 'Normal weight';
      color = '#2ecc71';
      recommendation = 'Great! Maintain your healthy lifestyle with regular exercise and balanced diet.';
    } else if (roundedBMI < 30) {
      category = 'Overweight';
      color = '#f39c12';
      recommendation = 'Consider a balanced diet and regular exercise to reach a healthier weight.';
    } else {
      category = 'Obese';
      color = '#e74c3c';
      recommendation = 'We recommend consulting a healthcare provider for personalized advice.';
    }

    res.json({
      success: true,
      data: {
        bmi: roundedBMI,
        category,
        color,
        recommendation
      }
    });
  } catch (error) {
    console.error('Calculate BMI error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating BMI',
      error: error.message
    });
  }
};

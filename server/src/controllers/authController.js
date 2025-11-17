const User = require('../models/User');
const WeightLog = require('../models/WeightLog');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, username, email, password, height, currentWeight, dateOfBirth, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? 'User already exists with this email'
          : 'Username is already taken'
      });
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,
      height,
      currentWeight,
      dateOfBirth,
      gender
    });

    // If height and weight are provided, create an initial weight log entry
    if (height && currentWeight) {
      const bmi = currentWeight / Math.pow(height / 100, 2);
      await WeightLog.create({
        userId: user._id,
        weight: currentWeight,
        bmi: Math.round(bmi * 10) / 10,
        date: new Date(),
        notes: 'Initial weight recorded during registration'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        currentWeight: user.currentWeight,
        fitnessLevel: user.fitnessLevel
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    // Validation
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username/email and password'
      });
    }

    // Check for user by email or username (include password for comparison)
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        currentWeight: user.currentWeight,
        fitnessLevel: user.fitnessLevel,
        bmi: user.calculateBMI(),
        bmiCategory: user.getBMICategory()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = req.user;

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
        avatar: user.avatar,
        preferences: user.preferences,
        bmi: user.calculateBMI(),
        bmiCategory: user.getBMICategory()
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
exports.verifyToken = async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    userId: req.user._id
  });
};

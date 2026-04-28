const User = require('../models/User');
const WeightLog = require('../models/WeightLog');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // express-validator ran before this controller — check its results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, username, email, password, height, currentWeight, dateOfBirth, gender } = req.body;

    // Prevent duplicate accounts
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

    // User.create() triggers the bcrypt pre-save hook that hashes the password
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

    // Create an initial weight log entry so the dashboard chart has at least one point
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
        fitnessLevel: user.fitnessLevel,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('[register] Failed to create user for email:', req.body.email, error);
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
    // Accept either email or username as the login identifier
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username/email and password'
      });
    }

    // We must explicitly select '+password' because the schema hides it by default
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

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

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
        isAdmin: user.isAdmin,
        bmi: user.calculateBMI(),
        bmiCategory: user.getBMICategory()
      }
    });
  } catch (error) {
    console.error('[login] Login failed for identifier:', req.body.email || req.body.username, error);
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
    // req.user is populated by the protect middleware from the JWT token
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
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        preferences: user.preferences,
        bmi: user.calculateBMI(),
        bmiCategory: user.getBMICategory()
      }
    });
  } catch (error) {
    console.error('[getMe] Failed to fetch user data for userId:', req.user?._id, error);
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

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password in queries by default
  },
  height: {
    type: Number, // in centimeters
    min: [50, 'Height must be at least 50 cm'],
    max: [300, 'Height must be less than 300 cm']
  },
  currentWeight: {
    type: Number, // in kilograms
    min: [20, 'Weight must be at least 20 kg'],
    max: [500, 'Weight must be less than 500 kg']
  },
  goalWeight: {
    type: Number, // in kilograms
    min: [20, 'Goal weight must be at least 20 kg'],
    max: [500, 'Goal weight must be less than 500 kg']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },
  preferences: {
    dietaryRestrictions: [{
      type: String,
      enum: ['vegan', 'vegetarian', 'keto', 'paleo', 'gluten-free', 'dairy-free']
    }],
    allergens: [{
      type: String,
      enum: ['nuts', 'dairy', 'eggs', 'soy', 'gluten', 'shellfish', 'fish']
    }],
    preferredUnits: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to calculate current BMI
userSchema.methods.calculateBMI = function() {
  if (!this.height || !this.currentWeight) {
    return null;
  }
  const heightInMeters = this.height / 100;
  const bmi = this.currentWeight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

// Method to get BMI category
userSchema.methods.getBMICategory = function() {
  const bmi = this.calculateBMI();
  if (!bmi) return null;

  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: Number,
  reps: Number,
  duration: Number, // in seconds, for time-based exercises
  description: String,
  videoUrl: String
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide workout name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide workout description']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
    index: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 5,
    max: 300
  },
  type: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'mixed'],
    required: true,
    index: true
  },
  equipment: [{
    type: String,
    enum: ['none', 'dumbbells', 'resistance-band', 'kettlebell', 'barbell', 'mat', 'pull-up-bar', 'bench']
  }],
  exercises: [exerciseSchema],
  suitableFor: {
    minBMI: {
      type: Number,
      default: 0
    },
    maxBMI: {
      type: Number,
      default: 100
    },
    jointFriendly: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  indoorOutdoor: {
    type: String,
    enum: ['indoor', 'outdoor', 'both'],
    default: 'both',
    index: true
  },
  caloriesBurned: {
    type: Number, // estimated calories per session
    default: 0
  },
  imageUrl: {
    type: String,
    default: '/images/default-workout.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to find suitable workouts
workoutSchema.statics.findSuitable = async function(filters) {
  const query = {};

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.bmi) {
    query['suitableFor.minBMI'] = { $lte: filters.bmi };
    query['suitableFor.maxBMI'] = { $gte: filters.bmi };
  }

  if (filters.jointFriendly) {
    query['suitableFor.jointFriendly'] = true;
  }

  if (filters.indoorOutdoor) {
    query.indoorOutdoor = { $in: [filters.indoorOutdoor, 'both'] };
  }

  return this.find(query).limit(filters.limit || 10);
};

module.exports = mongoose.model('Workout', workoutSchema);

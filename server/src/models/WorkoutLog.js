const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  duration: {
    type: Number, // actual duration in minutes
    required: true
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: Number, // User's rating of difficulty (1-5)
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    maxlength: 500
  },
  completed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index
workoutLogSchema.index({ userId: 1, date: -1 });

// Static method to get workout history
workoutLogSchema.statics.getHistory = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.find({
    userId,
    date: { $gte: startDate }
  })
    .populate('workoutId')
    .sort({ date: -1 });
};

// Static method to get workout statistics
workoutLogSchema.statics.getStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Convert userId to ObjectId if it's a string, otherwise use as-is
  const userObjectId = typeof userId === 'string'
    ? mongoose.Types.ObjectId.createFromHexString(userId)
    : userId;

  const stats = await this.aggregate([
    {
      $match: {
        userId: userObjectId,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        totalCalories: { $sum: '$caloriesBurned' },
        avgDuration: { $avg: '$duration' }
      }
    }
  ]);

  return stats[0] || {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    avgDuration: 0
  };
};

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);

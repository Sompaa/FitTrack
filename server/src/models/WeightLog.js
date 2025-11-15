const mongoose = require('mongoose');

const weightLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  weight: {
    type: Number,
    required: [true, 'Please provide weight'],
    min: [20, 'Weight must be at least 20 kg'],
    max: [500, 'Weight must be less than 500 kg']
  },
  bmi: {
    type: Number,
    min: 10,
    max: 100
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
weightLogSchema.index({ userId: 1, date: -1 });

// Static method to get weight history
weightLogSchema.statics.getHistory = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.find({
    userId,
    date: { $gte: startDate }
  }).sort({ date: 1 });
};

// Static method to get latest weight
weightLogSchema.statics.getLatest = async function(userId) {
  return this.findOne({ userId }).sort({ date: -1 });
};

module.exports = mongoose.model('WeightLog', weightLogSchema);

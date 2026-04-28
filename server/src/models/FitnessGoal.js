const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  value:    { type: Number },
  date:     { type: Date },
  achieved: { type: Boolean, default: false },
  label:    { type: String }
}, { _id: false });

const progressEntrySchema = new mongoose.Schema({
  value: { type: Number },
  date:  { type: Date },
  note:  { type: String }
}, { _id: false });

const fitnessGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'],
    required: true
  },
  startValue:   { type: Number },
  targetValue:  { type: Number },
  currentValue: { type: Number },
  startDate:    { type: Date, required: true },
  targetDate:   { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'paused'],
    default: 'active',
    index: true
  },
  milestones:      [milestoneSchema],
  progressHistory: [progressEntrySchema],
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('FitnessGoal', fitnessGoalSchema);

const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  getWorkout,
  getRecommendations,
  logWorkout,
  getMyLogs
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getWorkouts);
router.get('/:id', getWorkout);

// Protected routes
router.get('/recommended/me', protect, getRecommendations);
router.post('/log', protect, logWorkout);
router.get('/my-logs/all', protect, getMyLogs);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getWeightLogs,
  logWeight,
  updateWeightLog,
  deleteWeightLog,
  getChartData,
  calculateBMI
} = require('../controllers/weightController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/bmi/calculate', calculateBMI);

// Protected routes
router.get('/', protect, getWeightLogs);
router.post('/', protect, logWeight);
router.put('/:id', protect, updateWeightLog);
router.delete('/:id', protect, deleteWeightLog);
router.get('/chart', protect, getChartData);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');
const {
  getAllUsers,
  getUserWeight,
  getUserWorkouts,
  getUserStats
} = require('../controllers/adminController');

// All admin routes require login (protect) AND admin flag (requireAdmin).
// protect runs first and attaches req.user; requireAdmin checks isAdmin.
router.use(protect, requireAdmin);

router.get('/users', getAllUsers);
router.get('/users/:id/weight', getUserWeight);
router.get('/users/:id/workouts', getUserWorkouts);
router.get('/users/:id/stats', getUserStats);

module.exports = router;

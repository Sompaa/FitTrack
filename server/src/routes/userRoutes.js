const express = require('express');
const router = express.Router();
const { updateProfile, getStats, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.put('/me', updateProfile);
router.get('/me/stats', getStats);
router.delete('/me', deleteAccount);

module.exports = router;

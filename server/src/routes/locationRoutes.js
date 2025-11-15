const express = require('express');
const router = express.Router();
const {
  getNearbyLocations,
  getLocationDetails,
  getPhotoUrl
} = require('../controllers/locationController');

// Public routes
router.get('/nearby', getNearbyLocations);
router.get('/:placeId', getLocationDetails);
router.get('/photo/:reference', getPhotoUrl);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getForecast,
  getWeatherRecommendation
} = require('../controllers/weatherController');

// Public routes
router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/recommendation', getWeatherRecommendation);

module.exports = router;

const axios = require('axios');
const Workout = require('../models/Workout');

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Public
exports.getCurrentWeather = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'OpenWeather API key not configured'
      });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon: lng,
        appid: apiKey,
        units: 'metric'
      }
    });

    const weather = {
      temp: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      condition: response.data.weather[0].main.toLowerCase(),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      city: response.data.name
    };

    res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weather data',
      error: error.message
    });
  }
};

// @desc    Get 5-day forecast
// @route   GET /api/weather/forecast
// @access  Public
exports.getForecast = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'OpenWeather API key not configured'
      });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon: lng,
        appid: apiKey,
        units: 'metric'
      }
    });

    // Group by day (take one forecast per day around noon)
    const dailyForecasts = [];
    const processedDates = new Set();

    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toDateString();
      const hour = date.getHours();

      // Take forecast around noon (12:00)
      if (!processedDates.has(dateStr) && hour >= 11 && hour <= 13) {
        processedDates.add(dateStr);
        dailyForecasts.push({
          date: dateStr,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main.toLowerCase(),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        });
      }
    });

    res.json({
      success: true,
      count: dailyForecasts.length,
      data: dailyForecasts
    });
  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forecast data',
      error: error.message
    });
  }
};

// @desc    Get weather-based workout recommendation
// @route   GET /api/weather/recommendation
// @access  Public
exports.getWeatherRecommendation = async (req, res) => {
  try {
    const { lat, lng, bmi, fitnessLevel } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'OpenWeather API key not configured'
      });
    }

    // Get current weather
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon: lng,
        appid: apiKey,
        units: 'metric'
      }
    });

    const temp = Math.round(weatherResponse.data.main.temp);
    const condition = weatherResponse.data.weather[0].main.toLowerCase();

    let suitable = true;
    let message = '';
    let workoutTypes = [];
    let indoorOutdoor = 'both';

    // Weather-based logic
    if (condition === 'rain' || condition === 'thunderstorm' || condition === 'snow') {
      suitable = false;
      message = 'Bad weather detected! We recommend indoor activities.';
      workoutTypes = ['Indoor Cycling', 'Home Workout', 'Yoga', 'Strength Training'];
      indoorOutdoor = 'indoor';
    } else if (temp > 30) {
      message = "It's very hot outside. Stay hydrated and prefer indoor or early morning/evening outdoor activities.";
      workoutTypes = ['Swimming', 'Indoor Gym', 'Early Morning Walk'];
      indoorOutdoor = 'indoor';
    } else if (temp < 5) {
      message = "It's quite cold. Dress warmly or consider indoor activities.";
      workoutTypes = ['Indoor Gym', 'Home Workout', 'Indoor Swimming'];
      indoorOutdoor = 'indoor';
    } else if (temp >= 15 && temp <= 25 && condition === 'clear') {
      message = 'Perfect weather for outdoor activities!';
      workoutTypes = ['Running', 'Cycling', 'Park Workout', 'Hiking'];
      indoorOutdoor = 'outdoor';
    } else {
      message = 'Good weather for various activities!';
      workoutTypes = ['Walking', 'Jogging', 'Outdoor Sports'];
      indoorOutdoor = 'both';
    }

    // Get suitable workouts from database
    const filters = {
      indoorOutdoor: indoorOutdoor,
      limit: 5
    };

    if (bmi) {
      filters.bmi = parseFloat(bmi);
    }

    if (fitnessLevel) {
      filters.difficulty = fitnessLevel;
    }

    const workouts = await Workout.findSuitable(filters);

    res.json({
      success: true,
      weather: {
        temp,
        condition,
        description: weatherResponse.data.weather[0].description
      },
      recommendation: {
        suitable,
        message,
        workoutTypes,
        suggestedWorkouts: workouts
      }
    });
  } catch (error) {
    console.error('Get weather recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating weather recommendation',
      error: error.message
    });
  }
};

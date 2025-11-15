const axios = require('axios');

// @desc    Get nearby fitness locations
// @route   GET /api/locations/nearby
// @access  Public
exports.getNearbyLocations = async (req, res) => {
  try {
    const { lat, lng, radius, type } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Google Maps API key not configured'
      });
    }

    // Map type to Google Places types
    const placeTypes = {
      'gym': 'gym',
      'park': 'park',
      'running_track': 'stadium',
      'swimming_pool': 'swimming_pool',
      'sports_field': 'stadium'
    };

    const searchType = placeTypes[type] || 'gym';
    const searchRadius = radius || 5000; // default 5km

    // Google Places API Nearby Search
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: searchRadius,
        type: searchType,
        key: apiKey
      }
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    const locations = response.data.results.map(place => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      rating: place.rating || 0,
      userRatingsTotal: place.user_ratings_total || 0,
      priceLevel: place.price_level || 0,
      types: place.types,
      photoReference: place.photos ? place.photos[0].photo_reference : null,
      isOpen: place.opening_hours ? place.opening_hours.open_now : null
    }));

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Get nearby locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby locations',
      error: error.message
    });
  }
};

// @desc    Get location details
// @route   GET /api/locations/:placeId
// @access  Public
exports.getLocationDetails = async (req, res) => {
  try {
    const { placeId } = req.params;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Google Maps API key not configured'
      });
    }

    // Google Places API Place Details
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,price_level,photos,reviews,geometry',
        key: apiKey
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    const place = response.data.result;

    const details = {
      placeId: placeId,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      priceLevel: place.price_level,
      openingHours: place.opening_hours ? place.opening_hours.weekday_text : [],
      isOpenNow: place.opening_hours ? place.opening_hours.open_now : null,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      photos: place.photos ? place.photos.slice(0, 5).map(photo => photo.photo_reference) : [],
      reviews: place.reviews ? place.reviews.slice(0, 5).map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time
      })) : []
    };

    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    console.error('Get location details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location details',
      error: error.message
    });
  }
};

// @desc    Get photo URL
// @route   GET /api/locations/photo/:reference
// @access  Public
exports.getPhotoUrl = (req, res) => {
  const { reference } = req.params;
  const { maxwidth } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth || 400}&photo_reference=${reference}&key=${apiKey}`;

  res.json({
    success: true,
    url: photoUrl
  });
};

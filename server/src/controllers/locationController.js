const axios = require('axios');
const Location = require('../models/Location');

// Maps our internal type names to OpenStreetMap tags used in Overpass queries
const osmTagMap = {
  gym:            [['leisure', 'fitness_centre'], ['amenity', 'gym'], ['sport', 'fitness']],
  park:           [['leisure', 'park'], ['leisure', 'recreation_ground']],
  running_track:  [['leisure', 'track']],
  swimming_pool:  [['leisure', 'swimming_pool'], ['amenity', 'swimming_pool']],
};

// Build an Overpass QL query that finds nodes AND ways within `radius` metres
function buildOverpassQuery(lat, lng, radius, osmTags) {
  const filters = osmTags.map(([k, v]) =>
    `node["${k}"="${v}"](around:${radius},${lat},${lng});` +
    `way["${k}"="${v}"](around:${radius},${lat},${lng});`
  ).join('\n  ');

  return `[out:json][timeout:15];\n(\n  ${filters}\n);\nout center;`;
}

// @desc    Get nearby fitness locations
// @route   GET /api/locations/nearby
// @access  Public
//
// Strategy:
//   1. Query MongoDB first (free, instant, uses any data already in Atlas)
//   2. Fall back to Overpass API (OpenStreetMap) — no API key needed, always works
exports.getNearbyLocations = async (req, res) => {
  try {
    const { lat, lng, radius, type } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Please provide latitude and longitude' });
    }

    const searchRadius = Number(radius) || 5000;

    const typeMap = { gym: 'gym', park: 'park', running_track: 'running_track', swimming_pool: 'swimming_pool', stadium: 'gym' };
    const searchType = typeMap[type] || 'gym';

    // ---- Step 1: MongoDB $near query ----
    // GeoJSON coordinates are [longitude, latitude] — note the reversed order vs. lat/lng
    const mongoQuery = {
      coordinates: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: searchRadius
        }
      }
    };
    if (type) mongoQuery.type = searchType;

    const mongoResults = await Location.find(mongoQuery).limit(20);

    if (mongoResults.length > 0) {
      const locations = mongoResults.map(place => ({
        placeId: place._id.toString(),
        name: place.name,
        address: place.address || '',
        location: { lat: place.coordinates.coordinates[1], lng: place.coordinates.coordinates[0] },
        rating: place.rating || 0,
        types: [place.type],
        amenities: place.amenities || [],
        openingHours: place.openingHours ? Object.fromEntries(place.openingHours) : {},
        source: 'local'
      }));

      return res.json({ success: true, count: locations.length, data: locations, source: 'mongodb' });
    }

    // ---- Step 2: Overpass API (OpenStreetMap) fallback ----
    // Free, no API key required. Returns OSM nodes/ways with matching tags.
    const osmTags = osmTagMap[searchType] || osmTagMap.gym;
    const query = buildOverpassQuery(parseFloat(lat), parseFloat(lng), searchRadius, osmTags);

    const overpassResponse = await axios.post(
      'https://overpass-api.de/api/interpreter',
      query,
      { headers: { 'Content-Type': 'text/plain' }, timeout: 20000 }
    );

    const elements = overpassResponse.data.elements || [];

    const locations = elements
      .filter(el => {
        // nodes have lat/lng directly; ways have a centroid in el.center
        return (el.lat && el.lon) || (el.center && el.center.lat);
      })
      .map(el => {
        const elLat = el.lat || el.center.lat;
        const elLng = el.lon || el.center.lon;
        const tags = el.tags || {};

        return {
          placeId: `osm-${el.type}-${el.id}`,
          name: tags.name || tags['name:en'] || tags['name:hu'] || capitalizeType(searchType),
          address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']]
            .filter(Boolean).join(' ') || '',
          location: { lat: elLat, lng: elLng },
          rating: 0,
          types: [searchType],
          amenities: [],
          source: 'osm'
        };
      })
      // Drop unnamed duplicates at the exact same coordinate
      .filter((loc, idx, arr) =>
        arr.findIndex(l => l.location.lat === loc.location.lat && l.location.lng === loc.location.lng) === idx
      );

    return res.json({ success: true, count: locations.length, data: locations, source: 'osm' });

  } catch (error) {
    console.error('[locations] getNearbyLocations failed — lat:', req.query.lat, 'lng:', req.query.lng, error.message);
    res.status(500).json({ success: false, message: 'Error fetching nearby locations', error: error.message });
  }
};

function capitalizeType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// @desc    Get location details
// @route   GET /api/locations/:placeId
// @access  Public
exports.getLocationDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    // MongoDB ObjectId check
    if (/^[a-f\d]{24}$/i.test(placeId)) {
      const place = await Location.findById(placeId);
      if (place) {
        return res.json({
          success: true,
          data: {
            placeId: place._id.toString(),
            name: place.name,
            address: place.address,
            location: { lat: place.coordinates.coordinates[1], lng: place.coordinates.coordinates[0] },
            rating: place.rating,
            openingHours: place.openingHours ? Object.fromEntries(place.openingHours) : {},
            amenities: place.amenities,
            source: 'local'
          }
        });
      }
    }

    // OSM IDs (osm-node-12345) don't have a detail endpoint — return 404
    if (placeId.startsWith('osm-')) {
      return res.status(404).json({ success: false, message: 'OSM places have no detail endpoint' });
    }

    // Fall back to Google Places Details API for legacy place IDs
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'No detail source available for this place ID' });
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry',
        key: apiKey
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    const place = response.data.result;
    res.json({
      success: true,
      data: {
        placeId,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number,
        website: place.website,
        rating: place.rating,
        openingHours: place.opening_hours ? place.opening_hours.weekday_text : [],
        isOpenNow: place.opening_hours ? place.opening_hours.open_now : null,
        location: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
        source: 'google'
      }
    });
  } catch (error) {
    console.error('[locations] getLocationDetails failed for placeId:', req.params.placeId, error.message);
    res.status(500).json({ success: false, message: 'Error fetching location details', error: error.message });
  }
};

// @desc    Get photo URL (Google Photos only — not needed for OSM results)
// @route   GET /api/locations/photo/:reference
// @access  Public
exports.getPhotoUrl = (req, res) => {
  const { reference } = req.params;
  const { maxwidth } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth || 400}&photo_reference=${reference}&key=${apiKey}`;
  res.json({ success: true, url: photoUrl });
};

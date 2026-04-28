const mongoose = require('mongoose');

// Location model — per the EK.jsx ER diagram
// Stores gyms, parks, running tracks, swimming pools with GPS coordinates.
// Uses GeoJSON Point format so MongoDB can run $near (proximity) queries.
const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a location name'],
    trim: true
  },

  // Type of sport venue
  type: {
    type: String,
    enum: ['gym', 'park', 'running_track', 'swimming_pool', 'trail', 'sports_hall', 'outdoor'],
    required: [true, 'Please provide a location type'],
    index: true
  },

  // GeoJSON Point — MongoDB requires this exact structure for geospatial queries.
  // coordinates: [longitude, latitude]  ← note: lng comes FIRST in GeoJSON
  coordinates: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  // Opening hours per weekday, e.g. { monday: "06:00-22:00", tuesday: "06:00-22:00" }
  openingHours: {
    type: Map,
    of: String
  },

  // Facilities available at this location
  amenities: [{
    type: String
  }],

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  address: {
    type: String,
    trim: true
  },

  // Which user added this location (optional — null for system-seeded entries)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// 2dsphere index enables MongoDB's $near and $geoNear geospatial queries.
// Without this index, proximity searches will fail with an error.
locationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);

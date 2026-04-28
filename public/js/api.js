// ================================================================
// api.js — Centralized API Client
// ================================================================
// All HTTP requests to the backend go through this object.
// This means:
//   - The JWT token is always attached in ONE place (no repetition)
//   - A 401 "session expired" response is handled in ONE place
//   - All endpoints are documented in one file
//
// Usage example:
//   const data = await API.getWorkouts({ difficulty: 'beginner' });
// ================================================================

const API = {

  // ----------------------------------------------------------------
  // request() — the core fetch wrapper used by every method below
  // ----------------------------------------------------------------
  // endpoint: path after /api, e.g. '/auth/login'
  // options:  standard fetch options (method, body, headers, ...)
  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    // Start with JSON content type, then merge any caller-provided headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // If the user is logged in, attach their token to every request.
    // The backend protect middleware reads this header to identify the user.
    const token = Auth.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...options, headers };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // 401 means the token expired or was rejected — log the user out automatically
      if (response.status === 401) {
        Auth.removeToken();
        window.location.hash = '#login';
        Auth.updateUI();
        throw new Error('Session expired. Please login again.');
      }

      // Any other non-2xx status is an application error
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      // Log which request failed to make debugging easier
      console.error(`[API] ${options.method || 'GET'} ${endpoint} failed:`, error.message);
      throw error;
    }
  },

  // ----------------------------------------------------------------
  // AUTHENTICATION
  // ----------------------------------------------------------------

  async register(userData) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  },

  async login(credentials) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  },

  async getMe() {
    return this.request('/auth/me');
  },

  // ----------------------------------------------------------------
  // USER PROFILE & STATS
  // ----------------------------------------------------------------

  async updateProfile(updates) {
    return this.request('/users/me', { method: 'PUT', body: JSON.stringify(updates) });
  },

  async getStats(days = 30) {
    return this.request(`/users/me/stats?days=${days}`);
  },

  // ----------------------------------------------------------------
  // WEIGHT LOGGING
  // ----------------------------------------------------------------

  async getWeightLogs(days = 30) {
    return this.request(`/weight?days=${days}`);
  },

  async logWeight(data) {
    return this.request('/weight', { method: 'POST', body: JSON.stringify(data) });
  },

  async getWeightChartData(days = 30) {
    return this.request(`/weight/chart?days=${days}`);
  },

  async calculateBMI(height, weight) {
    return this.request('/weight/bmi/calculate', { method: 'POST', body: JSON.stringify({ height, weight }) });
  },

  // ----------------------------------------------------------------
  // WORKOUTS
  // ----------------------------------------------------------------

  async getWorkouts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/workouts?${params}`);
  },

  async getWorkout(id) {
    return this.request(`/workouts/${id}`);
  },

  async getRecommendedWorkouts() {
    return this.request('/workouts/recommended/me');
  },

  async logWorkout(data) {
    return this.request('/workouts/log', { method: 'POST', body: JSON.stringify(data) });
  },

  async getWorkoutLogs(days = 7) {
    return this.request(`/workouts/my-logs/all?days=${days}`);
  },

  // ----------------------------------------------------------------
  // RECIPES
  // ----------------------------------------------------------------

  async getRecipes(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/recipes?${params}`);
  },

  async getRecipe(id) {
    return this.request(`/recipes/${id}`);
  },

  // ----------------------------------------------------------------
  // LOCATIONS (nearby gyms, parks, etc.)
  // ----------------------------------------------------------------

  async getNearbyLocations(lat, lng, radius, type) {
    return this.request(`/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`);
  },

  async getLocationDetails(placeId) {
    return this.request(`/locations/${placeId}`);
  },

  // ----------------------------------------------------------------
  // WEATHER
  // ----------------------------------------------------------------

  async getCurrentWeather(lat, lng) {
    return this.request(`/weather/current?lat=${lat}&lng=${lng}`);
  },

  async getForecast(lat, lng) {
    return this.request(`/weather/forecast?lat=${lat}&lng=${lng}`);
  },

  async getWeatherRecommendation(lat, lng, bmi, fitnessLevel) {
    return this.request(`/weather/recommendation?lat=${lat}&lng=${lng}&bmi=${bmi}&fitnessLevel=${fitnessLevel}`);
  },

  // ----------------------------------------------------------------
  // ADMIN (requires isAdmin: true — returns 403 otherwise)
  // ----------------------------------------------------------------

  async getAdminUsers() {
    return this.request('/admin/users');
  },

  async getAdminUserWeight(id, days = 30) {
    return this.request(`/admin/users/${id}/weight?days=${days}`);
  },

  async getAdminUserWorkouts(id, days = 30) {
    return this.request(`/admin/users/${id}/workouts?days=${days}`);
  },

  async getAdminUserStats(id, days = 30) {
    return this.request(`/admin/users/${id}/stats?days=${days}`);
  }
};

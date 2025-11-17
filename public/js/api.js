// API Client
const API = {
  // Helper to make API requests
  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    const token = Auth.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle unauthorized (expired or invalid token)
      if (response.status === 401) {
        Auth.removeToken();
        window.location.hash = '#login';
        Auth.updateUI();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Authentication
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async getMe() {
    return this.request('/auth/me');
  },

  // User
  async updateProfile(updates) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async getStats(days = 30) {
    return this.request(`/users/me/stats?days=${days}`);
  },

  // Weight
  async getWeightLogs(days = 30) {
    return this.request(`/weight?days=${days}`);
  },

  async logWeight(data) {
    return this.request('/weight', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getWeightChartData(days = 30) {
    return this.request(`/weight/chart?days=${days}`);
  },

  async calculateBMI(height, weight) {
    return this.request('/weight/bmi/calculate', {
      method: 'POST',
      body: JSON.stringify({ height, weight })
    });
  },

  // Workouts
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
    return this.request('/workouts/log', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getWorkoutLogs(days = 7) {
    return this.request(`/workouts/my-logs/all?days=${days}`);
  },

  // Recipes
  async getRecipes(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/recipes?${params}`);
  },

  async getRecipe(id) {
    return this.request(`/recipes/${id}`);
  },

  // Locations
  async getNearbyLocations(lat, lng, radius, type) {
    return this.request(`/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`);
  },

  async getLocationDetails(placeId) {
    return this.request(`/locations/${placeId}`);
  },

  // Weather
  async getCurrentWeather(lat, lng) {
    return this.request(`/weather/current?lat=${lat}&lng=${lng}`);
  },

  async getForecast(lat, lng) {
    return this.request(`/weather/forecast?lat=${lat}&lng=${lng}`);
  },

  async getWeatherRecommendation(lat, lng, bmi, fitnessLevel) {
    return this.request(`/weather/recommendation?lat=${lat}&lng=${lng}&bmi=${bmi}&fitnessLevel=${fitnessLevel}`);
  }
};

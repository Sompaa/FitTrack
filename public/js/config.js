// Configuration
const CONFIG = {
  API_BASE_URL: window.location.origin + '/api',
  GOOGLE_MAPS_API_KEY: 'AIzaSyDX-UpzDMmRfV-_1QO8ebqAtz1crtn8iPo',
  DEFAULT_MAP_CENTER: { lat: 46.2530, lng: 20.1414 }, // Szeged, Hungary (default)
  DEFAULT_MAP_ZOOM: 13,
  STORAGE_KEY: 'fittrack_token',
  USER_KEY: 'fittrack_user',

  // Popular cities for selection
  CITIES: {
    'Szeged': { lat: 46.2530, lng: 20.1414 },
    'Budapest': { lat: 47.4979, lng: 19.0402 },
    'Debrecen': { lat: 47.5316, lng: 21.6273 },
    'Pécs': { lat: 46.0727, lng: 18.2328 },
    'Győr': { lat: 47.6875, lng: 17.6504 },
    'Miskolc': { lat: 48.1035, lng: 20.7784 },
    'Székesfehérvár': { lat: 47.1900, lng: 18.4108 },
    'Kecskemét': { lat: 46.9065, lng: 19.6908 },
    'Nyíregyháza': { lat: 47.9556, lng: 21.7272 },
    'Szombathely': { lat: 47.2306, lng: 16.6218 }
  }
};

// Helper functions
const Utils = {
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  },

  showLoading(container) {
    container.innerHTML = `
      <div class="spinner-container">
        <div class="spinner-border spinner-border-custom" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  },

  getBMIColor(bmi) {
    if (bmi < 18.5) return '#3498db';
    if (bmi < 25) return '#2ecc71';
    if (bmi < 30) return '#f39c12';
    return '#e74c3c';
  },

  getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }
};

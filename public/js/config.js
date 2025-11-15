// Configuration
const CONFIG = {
  API_BASE_URL: window.location.origin + '/api',
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual key
  DEFAULT_MAP_CENTER: { lat: 47.5316, lng: 21.6273 }, // Debrecen, Hungary (default)
  DEFAULT_MAP_ZOOM: 13,
  STORAGE_KEY: 'fittrack_token',
  USER_KEY: 'fittrack_user'
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

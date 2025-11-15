// Authentication Module
const Auth = {
  // Get token from localStorage
  getToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEY);
  },

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem(CONFIG.STORAGE_KEY, token);
  },

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Get current user
  getUser() {
    const userStr = localStorage.getItem(CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set current user
  setUser(user) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  },

  // Update UI based on auth status
  updateUI() {
    const isAuth = this.isAuthenticated();
    const user = this.getUser();

    // Toggle navigation items
    document.getElementById('nav-login').style.display = isAuth ? 'none' : 'block';
    document.getElementById('nav-profile').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-logout').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-dashboard').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-bmi').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-workouts').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-recipes').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-locations').style.display = isAuth ? 'block' : 'none';

    // Update user name
    if (isAuth && user) {
      document.getElementById('user-name').textContent = user.name;
    }
  }
};

// Logout function
function logout() {
  Auth.removeToken();
  Utils.showAlert('Logged out successfully', 'success');
  window.location.hash = '#home';
  Auth.updateUI();
}

// Initialize auth UI on load
document.addEventListener('DOMContentLoaded', () => {
  Auth.updateUI();
});

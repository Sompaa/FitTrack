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

  // ================================================================
  // Update UI based on auth status
  // BRANCH-KOMPATIBILIS VERZIÓ - Biztonságos ellenőrzésekkel
  // ================================================================
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

    // ================================================================
    // BIZTONSÁGOS KEDVENCEK KEZELÉS
    // Csak akkor fut le ha:
    // 1. FavoritesManager be van töltve
    // 2. A nav-favorites HTML elem létezik
    // ================================================================
    if (typeof FavoritesManager !== 'undefined') {
      const favNavElement = document.getElementById('nav-favorites');
      if (favNavElement) {
        favNavElement.style.display = isAuth ? 'block' : 'none';

        if (isAuth) {
          const favCount = FavoritesManager.getCount();
          const badge = document.getElementById('favorites-badge');
          if (badge) {
            badge.textContent = favCount;
            badge.style.display = favCount > 0 ? 'inline-block' : 'none';
          }
        }
      }
    }
    // Ha FavoritesManager nincs betöltve, csendes kilépés - nincs hiba!

    // Update user name
    if (isAuth && user) {
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) {
        userNameElement.textContent = user.name;
      }
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

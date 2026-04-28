// ================================================================
// auth.js — Authentication State Management
// ================================================================
// This module manages the logged-in user's state in the browser.
// It stores the JWT token and user object in localStorage so they
// survive page refreshes.
//
// Other files use it like:
//   Auth.isAuthenticated()  → true / false
//   Auth.getToken()         → "eyJhbGci..."
//   Auth.getUser()          → { id, name, email, isAdmin, ... }
// ================================================================

const Auth = {
  // Read the JWT token from localStorage
  getToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEY);
  },

  // Save the JWT token to localStorage after login/register
  setToken(token) {
    localStorage.setItem(CONFIG.STORAGE_KEY, token);
  },

  // Clear token and user data (used on logout or 401 response)
  removeToken() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  },

  // Returns true if a token exists (does NOT check if it's still valid)
  isAuthenticated() {
    return !!this.getToken();
  },

  // Read the cached user object stored at login
  getUser() {
    const userStr = localStorage.getItem(CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Save the user object to localStorage after login/register
  setUser(user) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  },

  // ================================================================
  // updateUI — show/hide navbar items based on login state
  // ================================================================
  // Called on every page load and after login/logout.
  // Uses safe null checks so missing nav items don't crash the page.
  updateUI() {
    const isAuth = this.isAuthenticated();
    const user = this.getUser();

    // Items visible only when logged OUT
    document.getElementById('nav-login').style.display = isAuth ? 'none' : 'block';

    // Items visible only when logged IN
    document.getElementById('nav-profile').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-logout').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-dashboard').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-bmi').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-workouts').style.display = isAuth ? 'block' : 'none';
    document.getElementById('nav-recipes').style.display = isAuth ? 'block' : 'none';
    // Sport Places map page — visible when logged in
    const navSportPlaces = document.getElementById('nav-sport-places');
    if (navSportPlaces) {
      navSportPlaces.style.display = isAuth ? 'block' : 'none';
    }

    // Admin panel — only visible to users with isAdmin: true
    const navAdmin = document.getElementById('nav-admin');
    if (navAdmin) {
      navAdmin.style.display = (isAuth && user && user.isAdmin) ? 'block' : 'none';
    }

    // ================================================================
    // FAVORITES — safe check in case favorites.js is not loaded yet
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

    // Update the username shown in the navbar
    if (isAuth && user) {
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) {
        userNameElement.textContent = user.name;
      }
    }
  }
};

// Called when the user clicks Logout in the navbar
function logout() {
  Auth.removeToken();
  Utils.showAlert('Logged out successfully', 'success');
  window.location.hash = '#home';
  Auth.updateUI();
}

// Run updateUI as soon as the page HTML is ready
document.addEventListener('DOMContentLoaded', () => {
  Auth.updateUI();
});

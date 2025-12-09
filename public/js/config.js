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

// ================================================================
// TÉMA KEZELŐ RENDSZER - Theme Manager System
// ================================================================

const ThemeManager = {
  // Beállítások
  STORAGE_KEY: 'fittrack_theme',
  THEME_DARK: 'dark',
  THEME_LIGHT: 'light',

  /**
   * Téma rendszer inicializálása
   * Lefut amikor az oldal betölt
   */
  init() {
    console.log('🎨 ThemeManager: Inicializálás...');

    // Mentett téma betöltése
    this.loadSavedTheme();

    // Kapcsoló gomb eseménykezelő hozzáadása
    this.attachEventListeners();

    // Rendszer téma figyelése (opcionális)
    this.watchSystemTheme();

    console.log('✅ ThemeManager: Kész!');
  },

  /**
   * Mentett téma betöltése localStorage-ből
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    console.log(`📂 Mentett téma: ${savedTheme || 'nincs'}`);

    if (savedTheme === this.THEME_DARK) {
      this.enableDarkMode(false); // false = nincs animáció betöltéskor
    } else {
      this.enableLightMode(false);
    }
  },

  /**
   * Eseménykezelők hozzáadása
   */
  attachEventListeners() {
    const toggleButton = document.getElementById('theme-toggle');

    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggleTheme();
      });
      console.log('🎯 Kapcsoló gomb eseménykezelő hozzáadva');
    } else {
      console.warn('⚠️ Kapcsoló gomb nem található!');
    }
  },

  /**
   * Téma váltás
   */
  toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    if (isDarkMode) {
      this.enableLightMode(true);
    } else {
      this.enableDarkMode(true);
    }
  },

  /**
   * Sötét mód bekapcsolása
   * @param {boolean} animate - Animáció használata
   */
  enableDarkMode(animate = true) {
    if (animate) {
      this.addTransition();
    }

    document.body.classList.add('dark-mode');
    this.updateIcon(true);
    this.saveTheme(this.THEME_DARK);

    console.log('🌙 Sötét mód aktiválva');
  },

  /**
   * Világos mód bekapcsolása
   * @param {boolean} animate - Animáció használata
   */
  enableLightMode(animate = true) {
    if (animate) {
      this.addTransition();
    }

    document.body.classList.remove('dark-mode');
    this.updateIcon(false);
    this.saveTheme(this.THEME_LIGHT);

    console.log('☀️ Világos mód aktiválva');
  },

  /**
   * Smooth átmenet hozzáadása
   */
  addTransition() {
    document.body.style.transition =
      'background-color 0.3s ease, color 0.3s ease';

    // Átmenet eltávolítása 300ms után
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  },

  /**
   * Ikon frissítése
   * @param {boolean} isDark - Sötét mód aktív-e
   */
  updateIcon(isDark) {
    const icon = document.getElementById('theme-icon');

    if (icon) {
      // Sötét módban nap ikon, világos módban hold ikon
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';

      // Kis animáció
      icon.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
      }, 300);
    }
  },

  /**
   * Téma mentése localStorage-be
   * @param {string} theme - Téma neve
   */
  saveTheme(theme) {
    localStorage.setItem(this.STORAGE_KEY, theme);
    console.log(`💾 Téma mentve: ${theme}`);
  },

  /**
   * Jelenlegi téma lekérdezése
   * @returns {string} Téma neve
   */
  getCurrentTheme() {
    return document.body.classList.contains('dark-mode')
      ? this.THEME_DARK
      : this.THEME_LIGHT;
  },

  /**
   * Rendszer téma figyelése (opcionális)
   * Automatikusan vált ha a felhasználó megváltoztatja a rendszer beállítást
   */
  watchSystemTheme() {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

      darkModeQuery.addEventListener('change', (e) => {
        // Csak akkor váltunk, ha nincs mentett preferencia
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        if (!savedTheme) {
          if (e.matches) {
            this.enableDarkMode(true);
          } else {
            this.enableLightMode(true);
          }
        }
      });
    }
  },

  /**
   * Téma törlése (reset)
   */
  resetTheme() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.enableLightMode(true);
    console.log('🔄 Téma visszaállítva alapértelmezettre');
  }
};

// ================================================================
// Automatikus inicializálás amikor az oldal betölt
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM betöltve (ThemeManager)');
  ThemeManager.init();
});

// ================================================================
// Globálisan elérhető a konzolból is (teszteléshez)
// ================================================================
window.ThemeManager = ThemeManager;

// ================================================================
// KEDVENCEK KEZELŐ RENDSZER - Favorites Manager System
// Branch-kompatibilis verzió v2.0.0
// ================================================================

const FavoritesManager = {
  // Beállítások
  STORAGE_KEY: 'fittrack_favorites',
  MAX_FAVORITES: 100,

  /**
   * Összes kedvenc lekérése
   * @returns {Array} Kedvenc receptek tömbje
   */
  getFavorites() {
    try {
      const favoritesJSON = localStorage.getItem(this.STORAGE_KEY);
      return favoritesJSON ? JSON.parse(favoritesJSON) : [];
    } catch (error) {
      console.error('Hiba a kedvencek betöltésekor:', error);
      return [];
    }
  },

  /**
   * Kedvenc hozzáadása
   * @param {Object} recipe - Recept objektum
   * @returns {boolean} Sikeres volt-e
   */
  addFavorite(recipe) {
    try {
      let favorites = this.getFavorites();

      // Ellenőrizzük hogy már benne van-e
      if (this.isFavorite(recipe._id)) {
        console.warn('Ez a recept már a kedvencek között van');
        return false;
      }

      // Maximum limit ellenőrzés
      if (favorites.length >= this.MAX_FAVORITES) {
        if (typeof Utils !== 'undefined' && Utils.showAlert) {
          Utils.showAlert(
            `Maximum ${this.MAX_FAVORITES} receptet menthetsz el kedvencnek!`,
            'warning'
          );
        }
        return false;
      }

      // Csak a szükséges adatokat mentjük
      const favoriteData = {
        _id: recipe._id,
        name: recipe.name,
        imageUrl: recipe.imageUrl,
        calories: recipe.nutrition?.calories || 0,
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        servings: recipe.servings || 1,
        difficulty: recipe.difficulty || 'medium',
        dietaryInfo: recipe.dietaryInfo || {},
        addedAt: new Date().toISOString()
      };

      favorites.push(favoriteData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));

      console.log('✅ Recept hozzáadva a kedvencekhez:', recipe.name);
      return true;
    } catch (error) {
      console.error('Hiba a kedvenc hozzáadásakor:', error);
      return false;
    }
  },

  /**
   * Kedvenc eltávolítása
   * @param {string} recipeId - Recept azonosító
   * @returns {boolean} Sikeres volt-e
   */
  removeFavorite(recipeId) {
    try {
      let favorites = this.getFavorites();
      const initialLength = favorites.length;

      favorites = favorites.filter(fav => fav._id !== recipeId);

      if (favorites.length === initialLength) {
        console.warn('Recept nem található a kedvencek között');
        return false;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));

      console.log('✅ Recept eltávolítva a kedvencekből');
      return true;
    } catch (error) {
      console.error('Hiba a kedvenc eltávolításakor:', error);
      return false;
    }
  },

  /**
   * Ellenőrzi hogy egy recept kedvenc-e
   * @param {string} recipeId - Recept azonosító
   * @returns {boolean} Kedvenc-e
   */
  isFavorite(recipeId) {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav._id === recipeId);
  },

  /**
   * Kedvencek számának lekérése
   * @returns {number} Kedvencek száma
   */
  getCount() {
    return this.getFavorites().length;
  },

  /**
   * Egy adott kedvenc részleteinek lekérése
   * @param {string} recipeId - Recept azonosító
   * @returns {Object|null} Kedvenc recept vagy null
   */
  getFavorite(recipeId) {
    const favorites = this.getFavorites();
    return favorites.find(fav => fav._id === recipeId) || null;
  },

  /**
   * Összes kedvenc törlése
   * @returns {boolean} Sikeres volt-e
   */
  clearAllFavorites() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Összes kedvenc törölve');
      return true;
    } catch (error) {
      console.error('Hiba az összes kedvenc törlésekor:', error);
      return false;
    }
  },

  /**
   * Kedvencek rendezése
   * @param {string} sortBy - Rendezési szempont ('name', 'date', 'calories')
   * @returns {Array} Rendezett kedvencek
   */
  getSortedFavorites(sortBy = 'date') {
    const favorites = this.getFavorites();

    switch (sortBy) {
      case 'name':
        return favorites.sort((a, b) => a.name.localeCompare(b.name));

      case 'calories':
        return favorites.sort((a, b) => a.calories - b.calories);

      case 'date':
      default:
        return favorites.sort((a, b) =>
          new Date(b.addedAt) - new Date(a.addedAt)
        );
    }
  },

  /**
   * Statisztikák lekérése
   * @returns {Object} Statisztikák objektum
   */
  getStatistics() {
    const favorites = this.getFavorites();

    if (favorites.length === 0) {
      return {
        count: 0,
        avgCalories: 0,
        avgPrepTime: 0,
        avgCookTime: 0,
        avgTotalTime: 0,
        mostRecent: null
      };
    }

    const totalCalories = favorites.reduce((sum, fav) => sum + (fav.calories || 0), 0);
    const totalPrepTime = favorites.reduce((sum, fav) => sum + (fav.prepTime || 0), 0);
    const totalCookTime = favorites.reduce((sum, fav) => sum + (fav.cookTime || 0), 0);

    return {
      count: favorites.length,
      avgCalories: Math.round(totalCalories / favorites.length),
      avgPrepTime: Math.round(totalPrepTime / favorites.length),
      avgCookTime: Math.round(totalCookTime / favorites.length),
      avgTotalTime: Math.round((totalPrepTime + totalCookTime) / favorites.length),
      mostRecent: favorites.sort((a, b) =>
        new Date(b.addedAt) - new Date(a.addedAt)
      )[0]
    };
  },

  /**
   * Kedvencek exportálása JSON-ként
   * @returns {string} JSON string
   */
  exportFavorites() {
    const favorites = this.getFavorites();
    return JSON.stringify(favorites, null, 2);
  },

  /**
   * Kedvencek importálása JSON-ből
   * @param {string} jsonString - JSON string
   * @returns {boolean} Sikeres volt-e
   */
  importFavorites(jsonString) {
    try {
      const favorites = JSON.parse(jsonString);

      if (!Array.isArray(favorites)) {
        throw new Error('Érvénytelen formátum');
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      console.log('✅ Kedvencek importálva');
      return true;
    } catch (error) {
      console.error('Hiba a kedvencek importálásakor:', error);
      return false;
    }
  }
};

// ================================================================
// Globálisan elérhető
// ================================================================
window.FavoritesManager = FavoritesManager;

console.log('⭐ FavoritesManager v2.0.0 betöltve (Branch-kompatibilis)');

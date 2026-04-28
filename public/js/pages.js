// ================================================================
// pages.js — Page Template Registry
// ================================================================
// Each Router.addRoute() call below defines one "page" of the app.
// The handler function receives the #app-content DOM element and
// renders HTML into it. Pages can call API.* methods to load data.
//
// TABLE OF CONTENTS (use Ctrl+G to jump to a line number in VS Code):
//   Line ~17   — BMI Calculator & Weight Tracker        (#bmi)
//   Line ~300  — Workouts Discovery & Logging           (#workouts)
//   Line ~650  — Locations Map                          (#locations)
//   Line ~720  — Recipes Browser                        (#recipes)
//   Line ~950  — Favorites                              (#favorites)
//   Line ~1100 — Weather Recommendations                (#weather)
//   Line ~1250 — User Profile                           (#profile)
//   Line ~1430 — Sport Places Map (NEW)                 (#sport-places)
//   Line ~1570 — Admin Dashboard (NEW)                  (#admin)
//
// TIP: In VS Code, install "Region Folding" or press Ctrl+Shift+P →
//      "Fold All" to collapse all #region blocks for an overview.
// ================================================================

// #region BMI Calculator (#bmi)
Router.addRoute('bmi', async (container) => {
  // Check if user is authenticated and has height
  let userHasHeight = false;
  let userHeight = null;

  if (Auth.isAuthenticated()) {
    try {
      const response = await API.getMe();
      userHasHeight = response.user && response.user.height;
      userHeight = response.user?.height;
    } catch (error) {
      console.log('Could not load user data:', error);
    }
  }

  container.innerHTML = `
    <div class="container my-5">
      <h2 class="mb-4"><i class="fas fa-calculator me-2"></i>${userHasHeight ? 'Weight Tracker' : 'BMI Calculator & Weight Tracker'}</h2>

      <div class="row">
        ${!userHasHeight ? `
        <!-- BMI Calculator -->
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">Calculate Your BMI</div>
            <div class="card-body">
              <form id="bmi-calc-form">
                <div class="mb-3">
                  <label class="form-label">Height (cm)</label>
                  <input type="number" class="form-control" id="calc-height" min="50" max="300" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Weight (kg)</label>
                  <input type="number" class="form-control" id="calc-weight" min="20" max="500" step="0.1" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Calculate BMI</button>
              </form>
              <div id="bmi-result" class="mt-3"></div>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Log Weight -->
        <div class="${userHasHeight ? 'col-md-8 mx-auto' : 'col-md-6'} mb-4">
          <div class="card">
            <div class="card-header">Log Your Weight</div>
            <div class="card-body">
              ${userHasHeight ? `
                <div class="alert alert-info mb-3">
                  <i class="fas fa-info-circle me-2"></i>Your height is set to <strong>${userHeight} cm</strong>. You can update it in your profile.
                </div>
              ` : ''}
              <form id="log-weight-form">
                <div class="mb-3">
                  <label class="form-label">Weight (kg)</label>
                  <input type="number" class="form-control" id="log-weight" min="20" max="500" step="0.1" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" id="log-date" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="mb-3">
                  <label class="form-label">Notes (optional)</label>
                  <textarea class="form-control" id="log-notes" rows="2"></textarea>
                </div>
                <button type="submit" class="btn btn-success w-100">
                  ${Auth.isAuthenticated() ? 'Log Weight' : 'Login to Log Weight'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // BMI Calculator (only if user doesn't have height)
  const bmiCalcForm = document.getElementById('bmi-calc-form');
  if (bmiCalcForm) {
    bmiCalcForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const height = parseFloat(document.getElementById('calc-height').value);
      const weight = parseFloat(document.getElementById('calc-weight').value);

      try {
        const response = await API.calculateBMI(height, weight);
        const result = response.data;

        document.getElementById('bmi-result').innerHTML = `
          <div class="alert bmi-${result.category.toLowerCase().replace(' ', '-')}" role="alert">
            <h4 class="alert-heading">BMI: ${result.bmi}</h4>
            <p class="mb-0"><strong>Category:</strong> ${result.category}</p>
            <hr>
            <p class="mb-0">${result.recommendation}</p>
          </div>
        `;
      } catch (error) {
        Utils.showAlert('Error calculating BMI: ' + error.message, 'danger');
      }
    });
  }

  // Log Weight Form
  document.getElementById('log-weight-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!Auth.isAuthenticated()) {
      Router.navigate('login');
      return;
    }

    const weight = parseFloat(document.getElementById('log-weight').value);
    const date = document.getElementById('log-date').value;
    const notes = document.getElementById('log-notes').value;

    try {
      await API.logWeight({ weight, date, notes });
      Utils.showAlert('Weight logged successfully!', 'success');
      document.getElementById('log-weight-form').reset();
      document.getElementById('log-date').value = new Date().toISOString().split('T')[0];
    } catch (error) {
      Utils.showAlert('Error logging weight: ' + error.message, 'danger');
    }
  });
});

// Workouts Page
Router.addRoute('workouts', async (container) => {
  Utils.showLoading(container);

  try {
    let workouts;

    if (Auth.isAuthenticated()) {
      const response = await API.getRecommendedWorkouts();
      workouts = response.data;

      container.innerHTML = `
        <div class="container my-5">
          <h2 class="mb-4"><i class="fas fa-dumbbell me-2"></i>Recommended Workouts</h2>
          <div class="alert alert-info">
            Based on your BMI (${response.userInfo.bmi}) and fitness level (${response.userInfo.fitnessLevel})
          </div>
          <div class="row" id="workouts-grid"></div>
        </div>
      `;
    } else {
      const response = await API.getWorkouts({ limit: 12 });
      workouts = response.data;

      container.innerHTML = `
        <div class="container my-5">
          <h2 class="mb-4"><i class="fas fa-dumbbell me-2"></i>Workout Plans</h2>
          <div class="row" id="workouts-grid"></div>
        </div>
      `;
    }

    const grid = document.getElementById('workouts-grid');

    if (workouts.length === 0) {
      grid.innerHTML = '<div class="col-12"><p>No workouts available yet.</p></div>';
    } else {
      workouts.forEach(workout => {
        grid.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card workout-card h-100">
              <img src="${workout.imageUrl}" class="card-img-top" alt="${workout.name}">
              <div class="card-body">
                <h5 class="card-title">${workout.name}</h5>
                <p class="card-text">${workout.description.substring(0, 100)}...</p>
                <div class="mb-2">
                  <span class="badge bg-primary">${workout.difficulty}</span>
                  <span class="badge bg-secondary">${workout.type}</span>
                  <span class="badge bg-info">${workout.duration} min</span>
                </div>
                <p class="text-muted small">
                  <i class="fas fa-fire me-1"></i>${workout.caloriesBurned} cal
                  <i class="fas fa-location-arrow ms-2 me-1"></i>${workout.indoorOutdoor}
                </p>
                <button class="btn btn-primary btn-sm" onclick="viewWorkout('${workout._id}')">View Details</button>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    Utils.showAlert('Error loading workouts: ' + error.message, 'danger');
  }
});

// View Workout Details
window.viewWorkout = async (id) => {
  try {
    const response = await API.getWorkout(id);
    const workout = response.data;

    const modalHTML = `
      <div class="modal fade" id="workoutModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${workout.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p>${workout.description}</p>
              <div class="mb-3">
                <span class="badge bg-primary">${workout.difficulty}</span>
                <span class="badge bg-secondary">${workout.type}</span>
                <span class="badge bg-info">${workout.duration} min</span>
                <span class="badge bg-success">${workout.caloriesBurned} cal</span>
              </div>
              <h6>Exercises:</h6>
              <ul class="list-group">
                ${workout.exercises.map(ex => `
                  <li class="list-group-item">
                    <strong>${ex.name}</strong><br>
                    ${ex.sets ? `${ex.sets} sets x ${ex.reps} reps` : `${ex.duration}s`}
                    ${ex.description ? `<br><small class="text-muted">${ex.description}</small>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              ${Auth.isAuthenticated() ? `<button type="button" class="btn btn-primary" onclick="logWorkoutModal('${workout._id}', '${workout.name}')">Log This Workout</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('workoutModal'));
    modal.show();
    document.getElementById('workoutModal').addEventListener('hidden.bs.modal', function () {
      this.remove();
    });
  } catch (error) {
    Utils.showAlert('Error loading workout details: ' + error.message, 'danger');
  }
};

// Log Workout Modal
window.logWorkoutModal = (workoutId, workoutName) => {
  const modalHTML = `
    <div class="modal fade" id="logWorkoutModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Log: ${workoutName}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form id="log-workout-form">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Duration (minutes)</label>
                <input type="number" class="form-control" id="workout-duration" min="1" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Difficulty (1-5)</label>
                <input type="number" class="form-control" id="workout-difficulty" min="1" max="5">
              </div>
              <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" id="workout-notes" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Log Workout</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('logWorkoutModal'));
  modal.show();

  document.getElementById('log-workout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const logData = {
      workoutId,
      duration: parseInt(document.getElementById('workout-duration').value),
      difficulty: parseInt(document.getElementById('workout-difficulty').value),
      notes: document.getElementById('workout-notes').value
    };

    try {
      await API.logWorkout(logData);
      Utils.showAlert('Workout logged successfully!', 'success');
      modal.hide();
    } catch (error) {
      Utils.showAlert('Error logging workout: ' + error.message, 'danger');
    }
  });

  document.getElementById('logWorkoutModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
};

// Recipes Page
Router.addRoute('recipes', async (container) => {
  Utils.showLoading(container);

  try {
    const response = await API.getRecipes({ limit: 12 });
    const recipes = response.data;

    container.innerHTML = `
      <div class="container my-5">
        <h2 class="mb-4"><i class="fas fa-utensils me-2"></i>Healthy Recipes</h2>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4 mb-2">
                <input type="search" class="form-control" placeholder="Search recipes..." id="recipe-search">
              </div>
              <div class="col-md-8">
                <div class="btn-group" role="group">
                  <input type="checkbox" class="btn-check" id="filter-vegan">
                  <label class="btn btn-outline-primary btn-sm" for="filter-vegan">Vegan</label>

                  <input type="checkbox" class="btn-check" id="filter-vegetarian">
                  <label class="btn btn-outline-primary btn-sm" for="filter-vegetarian">Vegetarian</label>

                  <input type="checkbox" class="btn-check" id="filter-keto">
                  <label class="btn btn-outline-primary btn-sm" for="filter-keto">Keto</label>

                  <input type="checkbox" class="btn-check" id="filter-gluten-free">
                  <label class="btn btn-outline-primary btn-sm" for="filter-gluten-free">Gluten-Free</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row" id="recipes-grid"></div>
      </div>
    `;

    const grid = document.getElementById('recipes-grid');

    // ================================================================
    // RECEPTEK RENDERELÉSE - BRANCH-KOMPATIBILIS VERZIÓ
    // ================================================================
    const renderRecipes = (recipesToShow) => {
      if (recipesToShow.length === 0) {
        grid.innerHTML = '<div class="col-12"><p>No recipes match your filters.</p></div>';
      } else {
        grid.innerHTML = '';
        recipesToShow.forEach(recipe => {

          // ================================================================
          // BIZTONSÁGOS KEDVENC GOMB GENERÁLÁS
          // Ha FavoritesManager nincs betöltve, akkor nem jelenik meg a gomb
          // Ha Auth nincs, akkor nem jelenik meg a gomb
          // ================================================================
          let favoriteButton = '';
          if (typeof FavoritesManager !== 'undefined' &&
              typeof Auth !== 'undefined' &&
              Auth.isAuthenticated()) {

            const isFavorite = FavoritesManager.isFavorite(recipe._id);
            const starColor = isFavorite ? '#FFD700' : '#CCCCCC';
            const title = isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez';

            favoriteButton = `
              <button
                class="btn btn-link p-0 favorite-btn"
                onclick="toggleFavoriteRecipe('${recipe._id}')"
                title="${title}"
                style="font-size: 1.5rem; text-decoration: none;"
              >
                <i class="fas fa-star" style="color: ${starColor};"></i>
              </button>
            `;
          }

          grid.innerHTML += `
            <div class="col-md-4 mb-4">
              <div class="card recipe-card h-100">
                <img src="${recipe.imageUrl}" class="card-img-top" alt="${recipe.name}">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">${recipe.name}</h5>
                    ${favoriteButton}
                  </div>
                  <p class="card-text text-muted small">
                    <i class="fas fa-clock me-1"></i>${recipe.prepTime + recipe.cookTime} min
                    <i class="fas fa-fire ms-2 me-1"></i>${recipe.nutrition.calories} cal
                    <i class="fas fa-utensils ms-2 me-1"></i>${recipe.servings} servings
                  </p>
                  <div class="mb-2">
                    ${recipe.dietaryInfo.vegan ? '<span class="badge bg-success">Vegan</span>' : ''}
                    ${recipe.dietaryInfo.vegetarian ? '<span class="badge bg-success">Vegetarian</span>' : ''}
                    ${recipe.dietaryInfo.keto ? '<span class="badge bg-info">Keto</span>' : ''}
                    ${recipe.dietaryInfo.glutenFree ? '<span class="badge bg-warning">Gluten-Free</span>' : ''}
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="viewRecipe('${recipe._id}')">View Recipe</button>
                </div>
              </div>
            </div>
          `;
        });
      }
    };

    // Function to apply filters
    const applyFilters = () => {
      const searchTerm = document.getElementById('recipe-search').value.toLowerCase();
      const veganFilter = document.getElementById('filter-vegan').checked;
      const vegetarianFilter = document.getElementById('filter-vegetarian').checked;
      const ketoFilter = document.getElementById('filter-keto').checked;
      const glutenFreeFilter = document.getElementById('filter-gluten-free').checked;

      let filtered = recipes.filter(recipe => {
        // Search filter
        const matchesSearch = !searchTerm ||
          recipe.name.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm);

        // Dietary filters (OR logic - show if ANY filter matches)
        const hasActiveFilters = veganFilter || vegetarianFilter || ketoFilter || glutenFreeFilter;
        const matchesDietary = !hasActiveFilters || (
          (veganFilter && recipe.dietaryInfo.vegan) ||
          (vegetarianFilter && recipe.dietaryInfo.vegetarian) ||
          (ketoFilter && recipe.dietaryInfo.keto) ||
          (glutenFreeFilter && recipe.dietaryInfo.glutenFree)
        );

        return matchesSearch && matchesDietary;
      });

      renderRecipes(filtered);
    };

    // Initial render
    renderRecipes(recipes);

    // Add event listeners for filters
    document.getElementById('recipe-search').addEventListener('input', applyFilters);
    document.getElementById('filter-vegan').addEventListener('change', applyFilters);
    document.getElementById('filter-vegetarian').addEventListener('change', applyFilters);
    document.getElementById('filter-keto').addEventListener('change', applyFilters);
    document.getElementById('filter-gluten-free').addEventListener('change', applyFilters);

  } catch (error) {
    Utils.showAlert('Error loading recipes: ' + error.message, 'danger');
  }
});

// View Recipe Details
window.viewRecipe = async (id) => {
  try {
    const response = await API.getRecipe(id);
    const recipe = response.data;

    const modalHTML = `
      <div class="modal fade" id="recipeModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${recipe.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <img src="${recipe.imageUrl}" class="img-fluid rounded mb-3" alt="${recipe.name}">
              <p>${recipe.description}</p>

              <div class="row mb-3">
                <div class="col-6">
                  <p class="mb-1"><strong>Prep Time:</strong> ${recipe.prepTime} min</p>
                  <p class="mb-1"><strong>Cook Time:</strong> ${recipe.cookTime} min</p>
                  <p class="mb-1"><strong>Servings:</strong> ${recipe.servings}</p>
                </div>
                <div class="col-6">
                  <p class="mb-1"><strong>Calories:</strong> ${recipe.nutrition.calories}</p>
                  <p class="mb-1"><strong>Protein:</strong> ${recipe.nutrition.protein}g</p>
                  <p class="mb-1"><strong>Carbs:</strong> ${recipe.nutrition.carbs}g</p>
                </div>
              </div>

              <h6>Ingredients:</h6>
              <ul>
                ${recipe.ingredients.map(ing => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`).join('')}
              </ul>

              <h6>Instructions:</h6>
              <ol>
                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
    modal.show();
    document.getElementById('recipeModal').addEventListener('hidden.bs.modal', function () {
      this.remove();
    });
  } catch (error) {
    Utils.showAlert('Error loading recipe: ' + error.message, 'danger');
  }
};

// ================================================================
// KEDVENCEK OLDAL - BRANCH-KOMPATIBILIS VERZIÓ
// ================================================================

Router.addRoute('favorites', async (container) => {
  // Ellenőrzések
  if (typeof Auth === 'undefined' || !Auth.isAuthenticated()) {
    if (typeof Router !== 'undefined') {
      Router.navigate('login');
    }
    return;
  }

  if (typeof FavoritesManager === 'undefined') {
    container.innerHTML = `
      <div class="container my-5">
        <div class="alert alert-danger">
          <h4>Hiba</h4>
          <p>A Kedvencek funkció nem elérhető. Hiányzik a favorites.js fájl.</p>
        </div>
      </div>
    `;
    return;
  }

  const favorites = FavoritesManager.getFavorites();
  const stats = FavoritesManager.getStatistics();

  container.innerHTML = `
    <div class="container my-5">
      <h2 class="mb-4">
        <i class="fas fa-star me-2" style="color: #FFD700;"></i>Kedvenc Receptjeim
      </h2>

      <!-- Statisztikák -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <h4>${stats.count}</h4>
            <p>Összes Kedvenc</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <h4>${stats.avgCalories}</h4>
            <p>Átlag Kalória</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <h4>${stats.avgTotalTime} min</h4>
            <p>Átlag Elkészítési Idő</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <h4>${FavoritesManager.MAX_FAVORITES}</h4>
            <p>Maximum Limit</p>
          </div>
        </div>
      </div>

      ${favorites.length === 0 ? `
        <!-- Üres állapot -->
        <div class="alert alert-info text-center py-5">
          <i class="fas fa-star fa-3x mb-3" style="color: #FFD700; opacity: 0.5;"></i>
          <h4>Még nincs kedvenc recepted</h4>
          <p>Böngészd a recepteket és add hozzá a kedvenceidhez a csillag gombra kattintva!</p>
          <a href="#recipes" class="btn btn-primary mt-3">
            <i class="fas fa-utensils me-2"></i>Receptek Böngészése
          </a>
        </div>
      ` : `
        <!-- Receptek Lista -->
        <div class="row" id="favorites-grid">
          ${favorites.map(recipe => `
            <div class="col-md-4 mb-4">
              <div class="card recipe-card h-100">
                <img src="${recipe.imageUrl}" class="card-img-top" alt="${recipe.name}">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">${recipe.name}</h5>
                    <button
                      class="btn btn-link p-0 favorite-btn"
                      onclick="toggleFavoriteRecipe('${recipe._id}')"
                      title="Eltávolítás a kedvencekből"
                      style="font-size: 1.5rem; text-decoration: none;"
                    >
                      <i class="fas fa-star" style="color: #FFD700;"></i>
                    </button>
                  </div>
                  <p class="card-text text-muted small">
                    <i class="fas fa-clock me-1"></i>${recipe.prepTime + recipe.cookTime} min
                    <i class="fas fa-fire ms-2 me-1"></i>${recipe.calories} cal
                    <i class="fas fa-utensils ms-2 me-1"></i>${recipe.servings} servings
                  </p>
                  <div class="mb-2">
                    ${recipe.dietaryInfo?.vegan ? '<span class="badge bg-success">Vegan</span>' : ''}
                    ${recipe.dietaryInfo?.vegetarian ? '<span class="badge bg-success">Vegetarian</span>' : ''}
                    ${recipe.dietaryInfo?.keto ? '<span class="badge bg-info">Keto</span>' : ''}
                    ${recipe.dietaryInfo?.glutenFree ? '<span class="badge bg-warning">Gluten-Free</span>' : ''}
                  </div>
                  <p class="text-muted small">
                    <i class="fas fa-calendar-alt me-1"></i>Hozzáadva: ${new Date(recipe.addedAt).toLocaleDateString('hu-HU')}
                  </p>
                  <button class="btn btn-primary btn-sm" onclick="viewRecipe('${recipe._id}')">
                    Recept Megtekintése
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
});

// #locations redirects to #sport-places (the old Google-Maps-based page was removed)
Router.addRoute('locations', () => Router.navigate('sport-places'));

// Weather Page
Router.addRoute('weather', async (container) => {
  container.innerHTML = `
    <div class="container-fluid my-5">
      <h2 class="mb-4 text-center"><i class="fas fa-cloud-sun me-2"></i>Weather & Workout Recommendations</h2>

      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-end">
                <div class="col-md-4 mb-2">
                  <label class="form-label">Select City</label>
                  <select class="form-control" id="weather-city">
                    ${Object.keys(CONFIG.CITIES).map(city => `<option value="${city}">${city}</option>`).join('')}
                  </select>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-primary w-100" onclick="loadWeather()">
                    <i class="fas fa-search me-2"></i>Get Weather
                  </button>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-primary w-100" onclick="loadWeatherByLocation()">
                    <i class="fas fa-location-arrow me-2"></i>Use My Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="weather-content"></div>
    </div>
  `;

  // Auto-load weather for default city (Szeged)
  setTimeout(() => loadWeather(), 100);
});

// Load weather by selected city
window.loadWeather = async () => {
  const city = document.getElementById('weather-city').value;
  const coords = CONFIG.CITIES[city];
  await fetchWeatherData(coords.lat, coords.lng, city);
};

// Load weather by user's current location
window.loadWeatherByLocation = () => {
  if (!navigator.geolocation) {
    Utils.showAlert('Geolocation is not supported by your browser', 'warning');
    return;
  }

  Utils.showAlert('Getting your location...', 'info');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      await fetchWeatherData(position.coords.latitude, position.coords.longitude, 'Your Location');
    },
    (error) => {
      Utils.showAlert('Unable to retrieve your location: ' + error.message, 'danger');
    }
  );
};

// Fetch and display weather data
window.fetchWeatherData = async (lat, lng, cityName) => {
  const container = document.getElementById('weather-content');
  Utils.showLoading(container);

  try {
    // Get user data for personalized recommendations
    let user = null;
    let bmi = null;
    let fitnessLevel = 'intermediate';

    if (Auth.isAuthenticated()) {
      try {
        const response = await API.getMe();
        user = response.user;
        bmi = user.bmi;
        fitnessLevel = user.fitnessLevel || 'intermediate';
      } catch (error) {
        console.log('Could not load user data:', error);
      }
    }

    // Fetch current weather, forecast, and recommendations in parallel
    const [currentWeather, forecast, recommendation] = await Promise.all([
      API.getCurrentWeather(lat, lng),
      API.getForecast(lat, lng),
      API.getWeatherRecommendation(lat, lng, bmi, fitnessLevel)
    ]);

    const weather = currentWeather.data;
    const forecastData = forecast.data;
    const rec = recommendation.recommendation;

    container.innerHTML = `
      <div class="row mb-4">
        <!-- Current Weather -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0"><i class="fas fa-cloud-sun me-2"></i>Current Weather - ${cityName}</h5>
            </div>
            <div class="card-body text-center">
              <img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" alt="${weather.description}" class="mb-3">
              <h1 class="display-3 mb-0">${weather.temp}°C</h1>
              <p class="text-muted mb-3">${weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p>
              <div class="row">
                <div class="col-6">
                  <p class="mb-1"><i class="fas fa-temperature-high me-2"></i><strong>Feels Like:</strong></p>
                  <p>${weather.feelsLike}°C</p>
                </div>
                <div class="col-6">
                  <p class="mb-1"><i class="fas fa-tint me-2"></i><strong>Humidity:</strong></p>
                  <p>${weather.humidity}%</p>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <p class="mb-1"><i class="fas fa-wind me-2"></i><strong>Wind Speed:</strong></p>
                  <p>${weather.windSpeed} m/s</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weather Recommendations -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header ${rec.suitable ? 'bg-success' : 'bg-warning'} text-white">
              <h5 class="mb-0"><i class="fas fa-lightbulb me-2"></i>Workout Recommendations</h5>
            </div>
            <div class="card-body">
              <div class="alert ${rec.suitable ? 'alert-success' : 'alert-warning'} mb-3">
                <i class="fas fa-info-circle me-2"></i>${rec.message}
              </div>

              <h6 class="mb-3">Recommended Activities:</h6>
              <div class="mb-3">
                ${rec.workoutTypes.map(type => `<span class="badge bg-primary me-2 mb-2">${type}</span>`).join('')}
              </div>

              ${rec.suggestedWorkouts.length > 0 ? `
                <h6 class="mb-3">Suggested Workouts from Database:</h6>
                <div class="list-group">
                  ${rec.suggestedWorkouts.slice(0, 3).map(workout => `
                    <div class="list-group-item">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="mb-1">${workout.name}</h6>
                          <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>${workout.duration} min
                            <i class="fas fa-fire ms-2 me-1"></i>${workout.caloriesBurned} cal
                          </small>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="viewWorkout('${workout._id}')">View</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : '<p class="text-muted">No specific workouts found in database.</p>'}
            </div>
          </div>
        </div>
      </div>

      <!-- 5-Day Forecast -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0"><i class="fas fa-calendar-alt me-2"></i>5-Day Forecast</h5>
            </div>
            <div class="card-body">
              <div class="row">
                ${forecastData.map(day => `
                  <div class="col-md mb-3 text-center">
                    <div class="card h-100">
                      <div class="card-body">
                        <h6 class="mb-2">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h6>
                        <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}" style="width: 60px;">
                        <h4 class="mb-1">${day.temp}°C</h4>
                        <p class="small text-muted mb-1">${day.description}</p>
                        <p class="small mb-0">
                          <i class="fas fa-tint me-1"></i>${day.humidity}%
                          <i class="fas fa-wind ms-2 me-1"></i>${day.windSpeed} m/s
                        </p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Weather fetch error:', error);
    container.innerHTML = `
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-circle me-2"></i>Error loading weather data: ${error.message}
        <hr>
        <p class="mb-0 small">Please check:</p>
        <ul class="mb-0 small">
          <li>OpenWeather API key is configured in server .env file</li>
          <li>Server is running and responding</li>
          <li>Internet connection is active</li>
        </ul>
      </div>
    `;
    Utils.showAlert('Error loading weather data: ' + error.message, 'danger');
  }
};

// Profile Page
Router.addRoute('profile', async (container) => {
  if (!Auth.isAuthenticated()) {
    Router.navigate('login');
    return;
  }

  Utils.showLoading(container);

  try {
    const response = await API.getMe();
    const user = response.user;

    container.innerHTML = `
      <div class="container my-5">
        <h2 class="mb-4"><i class="fas fa-user me-2"></i>My Profile</h2>

        <div class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">Profile Information</div>
              <div class="card-body">
                <form id="profile-form">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Name</label>
                      <input type="text" class="form-control" id="profile-name" value="${user.name}">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" value="${user.email}" disabled>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Height (cm)</label>
                      <input type="number" class="form-control" id="profile-height" value="${user.height || ''}">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Goal Weight (kg)</label>
                      <input type="number" class="form-control" id="profile-goal" value="${user.goalWeight || ''}">
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Fitness Level</label>
                      <select class="form-control" id="profile-fitness">
                        <option value="beginner" ${user.fitnessLevel === 'beginner' ? 'selected' : ''}>Beginner</option>
                        <option value="intermediate" ${user.fitnessLevel === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                        <option value="advanced" ${user.fitnessLevel === 'advanced' ? 'selected' : ''}>Advanced</option>
                      </select>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Gender</label>
                      <select class="form-control" id="profile-gender">
                        <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Male</option>
                        <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Female</option>
                        <option value="other" ${user.gender === 'other' ? 'selected' : ''}>Other</option>
                        <option value="prefer-not-to-say" ${user.gender === 'prefer-not-to-say' ? 'selected' : ''}>Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">Update Profile</button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card mb-3">
              <div class="card-header">Current Stats</div>
              <div class="card-body">
                <p><strong>Current Weight:</strong> ${user.currentWeight || 'Not set'} kg</p>
                <p><strong>BMI:</strong> ${user.bmi || 'N/A'}</p>
                <p><strong>Category:</strong> <span class="badge bg-${Utils.getBMIColor(user.bmi).substring(1)}">${user.bmiCategory || 'N/A'}</span></p>
                <p><strong>Goal Weight:</strong> ${user.goalWeight || 'Not set'} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const updates = {
        name: document.getElementById('profile-name').value,
        height: parseFloat(document.getElementById('profile-height').value) || undefined,
        goalWeight: parseFloat(document.getElementById('profile-goal').value) || undefined,
        fitnessLevel: document.getElementById('profile-fitness').value,
        gender: document.getElementById('profile-gender').value
      };

      try {
        const response = await API.updateProfile(updates);
        Auth.setUser(response.user);
        Utils.showAlert('Profile updated successfully!', 'success');
      } catch (error) {
        Utils.showAlert('Error updating profile: ' + error.message, 'danger');
      }
    });
  } catch (error) {
    Utils.showAlert('Error loading profile: ' + error.message, 'danger');
  }
});


// ================================================================
// KEDVENC RECEPTEK KEZELÉSE - BRANCH-KOMPATIBILIS VERZIÓ
// ================================================================

/**
 * Kedvenc recept váltása (hozzáadás/eltávolítás)
 * BIZTONSÁGOS VERZIÓ - Ellenőrzi hogy minden szükséges van-e betöltve
 * @param {string} recipeId - Recept azonosító
 */
window.toggleFavoriteRecipe = async function(recipeId) {
  // ================================================================
  // 1. Ellenőrizzük hogy FavoritesManager be van-e töltve
  // ================================================================
  if (typeof FavoritesManager === 'undefined') {
    console.error('FavoritesManager nincs betöltve! Töltsd be a favorites.js fájlt.');
    if (typeof Utils !== 'undefined' && Utils.showAlert) {
      Utils.showAlert('A kedvencek funkció nem elérhető.', 'danger');
    }
    return;
  }

  // ================================================================
  // 2. Ellenőrizzük hogy Auth be van-e töltve
  // ================================================================
  if (typeof Auth === 'undefined') {
    console.error('Auth nincs betöltve!');
    return;
  }

  // ================================================================
  // 3. Ellenőrizzük hogy be van-e jelentkezve
  // ================================================================
  if (!Auth.isAuthenticated()) {
    if (typeof Utils !== 'undefined' && Utils.showAlert) {
      Utils.showAlert('Jelentkezz be a kedvencek használatához!', 'warning');
    }
    if (typeof Router !== 'undefined') {
      Router.navigate('login');
    }
    return;
  }

  try {
    const isFavorite = FavoritesManager.isFavorite(recipeId);

    if (isFavorite) {
      // ============================================================
      // ELTÁVOLÍTÁS
      // ============================================================
      const success = FavoritesManager.removeFavorite(recipeId);
      if (success) {
        if (typeof Utils !== 'undefined' && Utils.showAlert) {
          Utils.showAlert('Recept eltávolítva a kedvencekből', 'info');
        }

        // Ha a kedvencek oldalon vagyunk, frissítjük
        if (typeof Router !== 'undefined' && window.location.hash === '#favorites') {
          Router.handleRoute();
        }
      }
    } else {
      // ============================================================
      // HOZZÁADÁS
      // ============================================================
      // Először le kell kérni a teljes receptet az API-ból
      if (typeof API === 'undefined') {
        console.error('API nincs betöltve!');
        return;
      }

      const response = await API.getRecipe(recipeId);
      const recipe = response.data;

      const success = FavoritesManager.addFavorite(recipe);
      if (success) {
        if (typeof Utils !== 'undefined' && Utils.showAlert) {
          Utils.showAlert(`${recipe.name} hozzáadva a kedvencekhez!`, 'success');
        }
      }
    }

    // Frissítjük a csillag ikont
    if (typeof updateFavoriteStars === 'function') {
      updateFavoriteStars();
    }

    // Frissítjük a menü számlálót
    if (typeof Auth !== 'undefined' && Auth.updateUI) {
      Auth.updateUI();
    }

  } catch (error) {
    console.error('Hiba a kedvenc váltásakor:', error);
    if (typeof Utils !== 'undefined' && Utils.showAlert) {
      Utils.showAlert('Hiba történt: ' + error.message, 'danger');
    }
  }
};

/**
 * Összes csillag ikon frissítése
 * BIZTONSÁGOS VERZIÓ
 */
function updateFavoriteStars() {
  if (typeof FavoritesManager === 'undefined') {
    return; // Csendes kilépés ha nincs FavoritesManager
  }

  document.querySelectorAll('.favorite-btn').forEach(btn => {
    try {
      const onclickAttr = btn.getAttribute('onclick');
      if (!onclickAttr) return;

      const match = onclickAttr.match(/'([^']+)'/);
      if (!match) return;

      const recipeId = match[1];
      const isFavorite = FavoritesManager.isFavorite(recipeId);
      const star = btn.querySelector('i');

      if (star) {
        star.style.color = isFavorite ? '#FFD700' : '#CCCCCC';
        btn.title = isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez';
      }
    } catch (error) {
      console.error('Hiba a csillag frissítésekor:', error);
    }
  });
}

// ================================================================
// #region Sport Places Map (#sport-places)
// ================================================================
// Uses Leaflet + OpenStreetMap — completely free, no API key needed.
// Location data comes from /api/locations/nearby (MongoDB-first,
// falls back to Google Places API server-side if needed).
// ================================================================

Router.addRoute('sport-places', async (container) => {
  container.innerHTML = `
    <div class="container-fluid my-4">
      <h2 class="mb-4 text-center">
        <i class="fas fa-map-marked-alt me-2 text-primary"></i>Sport Places Near You
      </h2>

      <!-- Search controls -->
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <div class="row g-2 align-items-end">
            <div class="col-md-3">
              <label class="form-label fw-semibold">City</label>
              <select class="form-select" id="sp-city">
                ${Object.keys(CONFIG.CITIES).map(city => `<option value="${city}">${city}</option>`).join('')}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label fw-semibold">Type</label>
              <select class="form-select" id="sp-type">
                <option value="fitness_center">Fitness Centers</option>
                <option value="gym">Gyms</option>
                <option value="sports_hall">Sports Halls</option>
                <option value="park">Parks</option>
                <option value="outdoor">Outdoor / Street Workout</option>
                <option value="trail">Trails</option>
                <option value="swimming_pool">Swimming Pools</option>
                <option value="pilates_studio">Pilates / Yoga</option>
                <option value="running_track">Running Tracks</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label fw-semibold">Radius</label>
              <select class="form-select" id="sp-radius">
                <option value="1000">1 km</option>
                <option value="2000">2 km</option>
                <option value="5000" selected>5 km</option>
                <option value="10000">10 km</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100" onclick="sportPlacesSearch()">
                <i class="fas fa-search me-1"></i>Search
              </button>
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-secondary w-100" onclick="sportPlacesUseMyLocation()">
                <i class="fas fa-location-arrow me-1"></i>Use My Location
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Map + results side by side -->
      <div class="row">
        <div class="col-lg-8 mb-3">
          <div id="sp-map" style="height: 520px; border-radius: 10px; border: 1px solid #dee2e6;"></div>
        </div>
        <div class="col-lg-4" style="max-height:540px; overflow-y:auto;">
          <div id="sp-results">
            <div class="text-muted text-center mt-5">
              <i class="fas fa-map-pin fa-2x mb-2 d-block"></i>
              Select a city and type, then click Search.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // ---- Load Leaflet CSS + JS dynamically (no API key required) ----
  function loadLeaflet(callback) {
    if (window.L) { callback(); return; }

    // Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  // ---- Shared state ----
  let spMap = null;
  let spMarkers = [];
  let spCurrentLat = CONFIG.DEFAULT_MAP_CENTER.lat;
  let spCurrentLng = CONFIG.DEFAULT_MAP_CENTER.lng;

  // ---- Initialize the Leaflet map ----
  function initMap() {
    spMap = L.map('sp-map').setView([spCurrentLat, spCurrentLng], CONFIG.DEFAULT_MAP_ZOOM);

    // OpenStreetMap tiles — free, no key needed
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(spMap);
  }

  // ---- Remove all markers from the map ----
  function clearMarkers() {
    spMarkers.forEach(m => spMap.removeLayer(m));
    spMarkers = [];
  }

  // ---- Drop markers and populate the results panel ----
  function renderResults(places) {
    clearMarkers();
    const resultsDiv = document.getElementById('sp-results');

    if (!places || places.length === 0) {
      resultsDiv.innerHTML = '<div class="alert alert-info">No places found. Try a larger radius.</div>';
      return;
    }

    let cardsHTML = `<p class="text-muted small mb-2">${places.length} place(s) found</p>`;
    const bounds = [];

    places.forEach((place, index) => {
      const lat = place.location.lat;
      const lng = place.location.lng;
      const stars = '⭐'.repeat(Math.round(place.rating || 0));

      // Numbered circle icon
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          background:#0d6efd;color:#fff;border-radius:50%;
          width:28px;height:28px;line-height:28px;
          text-align:center;font-weight:700;font-size:13px;
          box-shadow:0 2px 6px rgba(0,0,0,0.35)">
          ${index + 1}
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([lat, lng], { icon }).addTo(spMap);

      // Popup shown when marker is clicked
      marker.bindPopup(`
        <strong>${place.name}</strong><br>
        <span style="color:#666;font-size:12px">${place.address || ''}</span><br>
        ${place.rating ? `${stars} ${place.rating.toFixed(1)}` : ''}
      `);

      spMarkers.push(marker);
      bounds.push([lat, lng]);

      cardsHTML += `
        <div class="card mb-2 shadow-sm" style="cursor:pointer" onclick="spFocusMarker(${index})">
          <div class="card-body py-2 px-3">
            <div class="fw-semibold">${index + 1}. ${place.name}</div>
            <div class="text-muted small">${place.address || ''}</div>
            ${place.rating ? `<div class="small">${stars} ${place.rating.toFixed(1)}</div>` : ''}
            ${place.amenities && place.amenities.length > 0
              ? `<div class="text-muted" style="font-size:11px">${place.amenities.slice(0, 3).join(' · ')}</div>`
              : ''}
          </div>
        </div>
      `;
    });

    resultsDiv.innerHTML = cardsHTML;

    // Zoom map to fit all markers
    if (bounds.length > 1) {
      spMap.fitBounds(bounds, { padding: [30, 30] });
    } else if (bounds.length === 1) {
      spMap.setView(bounds[0], 15);
    }
  }

  // ---- Pan to a marker and open its popup when a card is clicked ----
  window.spFocusMarker = function(index) {
    if (spMarkers[index]) {
      spMap.setView(spMarkers[index].getLatLng(), 16);
      spMarkers[index].openPopup();
    }
  };

  // ---- Search by selected city ----
  window.sportPlacesSearch = async function() {
    const city = document.getElementById('sp-city').value;
    const coords = CONFIG.CITIES[city];
    if (coords) {
      spCurrentLat = coords.lat;
      spCurrentLng = coords.lng;
      spMap.setView([spCurrentLat, spCurrentLng], CONFIG.DEFAULT_MAP_ZOOM);
    }
    await doSearch();
  };

  // ---- Search using browser geolocation ----
  window.sportPlacesUseMyLocation = function() {
    if (!navigator.geolocation) {
      Utils.showAlert('Geolocation is not supported by your browser.', 'warning');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        spCurrentLat = position.coords.latitude;
        spCurrentLng = position.coords.longitude;
        spMap.setView([spCurrentLat, spCurrentLng], 14);
        await doSearch();
      },
      () => Utils.showAlert('Could not get your location. Check browser permissions.', 'warning')
    );
  };

  // ---- Call the backend and render results ----
  async function doSearch() {
    const type = document.getElementById('sp-type').value;
    const radius = document.getElementById('sp-radius').value;
    const resultsDiv = document.getElementById('sp-results');
    resultsDiv.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary"></div></div>';

    try {
      const response = await API.getNearbyLocations(spCurrentLat, spCurrentLng, radius, type);
      renderResults(response.data);
    } catch (error) {
      console.error('[sport-places] Search failed:', error);
      resultsDiv.innerHTML = `<div class="alert alert-danger">Search failed: ${error.message}</div>`;
    }
  }

  // ---- Boot: load Leaflet, then initialize the map ----
  loadLeaflet(initMap);
});
// #endregion Sport Places


// ================================================================
// #region Admin Dashboard (#admin and #admin/:userId)
// ================================================================
// Only visible to users with isAdmin: true.
// #admin       → lists all users with a "View Details" button
// #admin/ID    → shows one user's weight chart + workout log table
// ================================================================

Router.addRoute('admin', async (container, params) => {
  // Guard: redirect non-admins immediately
  const currentUser = Auth.getUser();
  if (!currentUser || !currentUser.isAdmin) {
    container.innerHTML = '<div class="container mt-5"><div class="alert alert-danger">Access denied. Admin only.</div></div>';
    return;
  }

  // params[0] is the userId for the detail view (e.g. #admin/abc123)
  const targetUserId = params && params[0];

  if (targetUserId) {
    // ---- USER DETAIL VIEW ----
    Utils.showLoading(container);

    try {
      const [statsRes, weightRes, workoutsRes] = await Promise.all([
        API.getAdminUserStats(targetUserId),
        API.getAdminUserWeight(targetUserId, 30),
        API.getAdminUserWorkouts(targetUserId, 30)
      ]);

      const weightLogs = weightRes.data || [];
      const workoutLogs = workoutsRes.data || [];

      container.innerHTML = `
        <div class="container my-4">
          <a href="#admin" class="btn btn-outline-secondary btn-sm mb-4">
            <i class="fas fa-arrow-left me-1"></i>Back to Users
          </a>
          <h3 class="mb-4"><i class="fas fa-user me-2"></i>User Details</h3>

          <!-- Stats Cards -->
          <div class="row g-3 mb-4">
            <div class="col-md-3">
              <div class="card text-center shadow-sm">
                <div class="card-body">
                  <div class="h4 text-primary">${statsRes.data.latestWeight ? statsRes.data.latestWeight + ' kg' : 'N/A'}</div>
                  <div class="text-muted small">Current Weight</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center shadow-sm">
                <div class="card-body">
                  <div class="h4 text-info">${statsRes.data.latestBmi ? statsRes.data.latestBmi.toFixed(1) : 'N/A'}</div>
                  <div class="text-muted small">BMI</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center shadow-sm">
                <div class="card-body">
                  <div class="h4 text-success">${statsRes.data.workouts.totalWorkouts}</div>
                  <div class="text-muted small">Workouts (30 days)</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center shadow-sm">
                <div class="card-body">
                  <div class="h4 text-warning">${statsRes.data.workouts.totalCalories}</div>
                  <div class="text-muted small">Calories Burned</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Weight Chart -->
          <div class="card shadow-sm mb-4">
            <div class="card-header"><i class="fas fa-chart-line me-2"></i>Weight History (30 days)</div>
            <div class="card-body">
              <canvas id="admin-weight-chart" height="80"></canvas>
            </div>
          </div>

          <!-- Workout Log Table -->
          <div class="card shadow-sm">
            <div class="card-header"><i class="fas fa-dumbbell me-2"></i>Recent Workouts</div>
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Workout</th>
                    <th>Duration</th>
                    <th>Calories</th>
                    <th>Effort (RPE)</th>
                  </tr>
                </thead>
                <tbody>
                  ${workoutLogs.length === 0
                    ? '<tr><td colspan="5" class="text-center text-muted py-3">No workouts logged yet.</td></tr>'
                    : workoutLogs.map(log => `
                        <tr>
                          <td>${Utils.formatDate(log.date)}</td>
                          <td>${log.workoutId ? log.workoutId.name : 'Unknown'}</td>
                          <td>${log.duration} min</td>
                          <td>${log.caloriesBurned} kcal</td>
                          <td>${log.perceivedEffort ? log.perceivedEffort + '/10' : '—'}</td>
                        </tr>
                      `).join('')
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      // Render weight chart with Chart.js
      if (weightLogs.length > 0) {
        const ctx = document.getElementById('admin-weight-chart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: weightLogs.map(l => Utils.formatDate(l.date)),
            datasets: [{
              label: 'Weight (kg)',
              data: weightLogs.map(l => l.weight),
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46,204,113,0.1)',
              tension: 0.3,
              fill: true
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { title: { display: true, text: 'kg' } } }
          }
        });
      }

    } catch (error) {
      console.error('[admin] Failed to load user detail for:', targetUserId, error);
      container.innerHTML = `<div class="container mt-5"><div class="alert alert-danger">Failed to load user data: ${error.message}</div></div>`;
    }

  } else {
    // ---- USER LIST VIEW ----
    Utils.showLoading(container);

    try {
      const res = await API.getAdminUsers();
      const users = res.data || [];

      container.innerHTML = `
        <div class="container my-4">
          <h3 class="mb-4"><i class="fas fa-shield-alt me-2 text-warning"></i>Admin — All Users</h3>

          <div class="card shadow-sm">
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Fitness Level</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(u => `
                    <tr>
                      <td class="fw-semibold">${u.name}</td>
                      <td>${u.email}</td>
                      <td><span class="badge bg-secondary">${u.fitnessLevel}</span></td>
                      <td>${u.isAdmin ? '<span class="badge bg-warning text-dark">Admin</span>' : '<span class="badge bg-light text-dark">User</span>'}</td>
                      <td>${Utils.formatDate(u.createdAt)}</td>
                      <td>
                        <a href="#admin/${u._id}" class="btn btn-sm btn-outline-primary">
                          <i class="fas fa-chart-bar me-1"></i>View
                        </a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('[admin] Failed to load user list:', error);
      container.innerHTML = `<div class="container mt-5"><div class="alert alert-danger">Failed to load users: ${error.message}</div></div>`;
    }
  }
});
// #endregion Admin Dashboard

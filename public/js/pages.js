// BMI Calculator Page
Router.addRoute('bmi', async (container) => {
  container.innerHTML = `
    <div class="container my-5">
      <h2 class="mb-4"><i class="fas fa-calculator me-2"></i>BMI Calculator & Weight Tracker</h2>

      <div class="row">
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

        <!-- Log Weight -->
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">Log Your Weight</div>
            <div class="card-body">
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

  // BMI Calculator
  document.getElementById('bmi-calc-form').addEventListener('submit', async (e) => {
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

    if (recipes.length === 0) {
      grid.innerHTML = '<div class="col-12"><p>No recipes available yet.</p></div>';
    } else {
      recipes.forEach(recipe => {
        grid.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card recipe-card h-100">
              <img src="${recipe.imageUrl}" class="card-img-top" alt="${recipe.name}">
              <div class="card-body">
                <h5 class="card-title">${recipe.name}</h5>
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

// Locations Page
Router.addRoute('locations', (container) => {
  container.innerHTML = `
    <div class="container-fluid my-5">
      <h2 class="mb-4 text-center"><i class="fas fa-map-marker-alt me-2"></i>Find Nearby Fitness Locations</h2>

      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-2">
                  <select class="form-control" id="location-type">
                    <option value="gym">Gyms</option>
                    <option value="park">Parks</option>
                    <option value="running_track">Running Tracks</option>
                    <option value="swimming_pool">Swimming Pools</option>
                  </select>
                </div>
                <div class="col-md-3 mb-2">
                  <select class="form-control" id="location-radius">
                    <option value="1000">1 km</option>
                    <option value="5000" selected>5 km</option>
                    <option value="10000">10 km</option>
                    <option value="20000">20 km</option>
                  </select>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-primary w-100" onclick="searchLocations()">
                    <i class="fas fa-search me-2"></i>Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 mb-4">
          <div id="map"></div>
        </div>
        <div class="col-md-4">
          <div id="locations-list"></div>
        </div>
      </div>
    </div>
  `;

  // Note: Google Maps integration requires API key and script loading
  Utils.showAlert('Note: Map feature requires Google Maps API key configuration', 'info');
});

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

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
                  <label class="form-label">Select City</label>
                  <select class="form-control" id="location-city">
                    ${Object.keys(CONFIG.CITIES).map(city => `<option value="${city}">${city}</option>`).join('')}
                  </select>
                </div>
                <div class="col-md-2 mb-2">
                  <label class="form-label">Location Type</label>
                  <select class="form-control" id="location-type">
                    <option value="gym">Gyms</option>
                    <option value="park">Parks</option>
                    <option value="stadium">Stadiums</option>
                    <option value="swimming_pool">Swimming Pools</option>
                    <option value="fitness">Fitness Centers</option>
                  </select>
                </div>
                <div class="col-md-2 mb-2">
                  <label class="form-label">Radius</label>
                  <select class="form-control" id="location-radius">
                    <option value="1000">1 km</option>
                    <option value="2000">2 km</option>
                    <option value="5000" selected>5 km</option>
                    <option value="10000">10 km</option>
                  </select>
                </div>
                <div class="col-md-2 mb-2">
                  <label class="form-label">&nbsp;</label>
                  <button class="btn btn-primary w-100" onclick="searchLocationsByCity()">
                    <i class="fas fa-search me-2"></i>Search
                  </button>
                </div>
                <div class="col-md-3 mb-2">
                  <label class="form-label">&nbsp;</label>
                  <button class="btn btn-outline-primary w-100" onclick="searchLocationsByMyLocation()">
                    <i class="fas fa-location-arrow me-2"></i>Use My Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 mb-4">
          <div id="map" style="height: 500px; border-radius: 8px; overflow: hidden;"></div>
        </div>
        <div class="col-md-4">
          <div id="locations-list"></div>
        </div>
      </div>
    </div>
  `;

  // Initialize Google Maps integration
  initializeMap();
});

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
    container.innerHTML = `
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-circle me-2"></i>Error loading weather data: ${error.message}
      </div>
    `;
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

// ==========================
// Google Maps Integration
// ==========================

let map;
let markers = [];
let placesService;
let infoWindow;

// Initialize Google Maps
window.initializeMap = () => {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || !google.maps) {
    mapElement.innerHTML = `
      <div class="alert alert-warning h-100 d-flex align-items-center justify-content-center">
        <div class="text-center">
          <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
          <p>Google Maps is loading... Please wait.</p>
        </div>
      </div>
    `;

    // Load Google Maps script if not already loaded
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initializeMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      setTimeout(initializeMap, 1000);
    }
    return;
  }

  // Initialize map with default location (Szeged)
  map = new google.maps.Map(mapElement, {
    center: CONFIG.DEFAULT_MAP_CENTER,
    zoom: CONFIG.DEFAULT_MAP_ZOOM,
    mapId: 'FITTRACK_MAP', // Required for advanced markers
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  });

  placesService = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow();

  // Auto-search for gyms in Szeged on load
  setTimeout(() => {
    const coords = CONFIG.DEFAULT_MAP_CENTER;
    searchNearbyPlaces(coords.lat, coords.lng, 5000, 'gym');
  }, 500);
};

// Search locations by selected city
window.searchLocationsByCity = () => {
  const city = document.getElementById('location-city').value;
  const type = document.getElementById('location-type').value;
  const radius = parseInt(document.getElementById('location-radius').value);

  const coords = CONFIG.CITIES[city];

  // Center map on selected city
  map.setCenter(coords);
  map.setZoom(CONFIG.DEFAULT_MAP_ZOOM);

  searchNearbyPlaces(coords.lat, coords.lng, radius, type);
};

// Search locations by user's current location
window.searchLocationsByMyLocation = () => {
  if (!navigator.geolocation) {
    Utils.showAlert('Geolocation is not supported by your browser', 'warning');
    return;
  }

  Utils.showAlert('Getting your location...', 'info');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const type = document.getElementById('location-type').value;
      const radius = parseInt(document.getElementById('location-radius').value);

      // Center map on user location
      map.setCenter({ lat, lng });
      map.setZoom(CONFIG.DEFAULT_MAP_ZOOM);

      searchNearbyPlaces(lat, lng, radius, type);
    },
    (error) => {
      Utils.showAlert('Unable to retrieve your location: ' + error.message, 'danger');
    }
  );
};

// Search nearby places using Google Places API
window.searchNearbyPlaces = (lat, lng, radius, type) => {
  // Clear existing markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  const location = new google.maps.LatLng(lat, lng);

  const request = {
    location: location,
    radius: radius,
    type: [type]
  };

  placesService.nearbySearch(request, (results, status) => {
    const listContainer = document.getElementById('locations-list');

    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      listContainer.innerHTML = `
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h6 class="mb-0">Found ${results.length} locations</h6>
          </div>
          <div class="list-group list-group-flush" style="max-height: 500px; overflow-y: auto;">
          </div>
        </div>
      `;

      const listGroup = listContainer.querySelector('.list-group');

      results.forEach((place, index) => {
        // Add marker to map
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
          animation: google.maps.Animation.DROP,
          label: (index + 1).toString()
        });

        markers.push(marker);

        // Add click listener to marker
        marker.addListener('click', () => {
          showPlaceInfo(place, marker);
        });

        // Calculate distance
        const distance = calculateDistance(lat, lng, place.geometry.location.lat(), place.geometry.location.lng());

        // Add to list
        const rating = place.rating ? `<i class="fas fa-star text-warning"></i> ${place.rating}` : 'No rating';
        const isOpen = place.opening_hours?.open_now !== undefined
          ? (place.opening_hours.open_now ? '<span class="badge bg-success">Open now</span>' : '<span class="badge bg-danger">Closed</span>')
          : '';

        listGroup.innerHTML += `
          <div class="list-group-item list-group-item-action" onclick="focusMarker(${index})" style="cursor: pointer;">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h6 class="mb-1">${index + 1}. ${place.name}</h6>
                <p class="mb-1 small text-muted">${place.vicinity}</p>
                <p class="mb-0 small">
                  ${rating}
                  <span class="ms-2"><i class="fas fa-map-marker-alt"></i> ${distance.toFixed(2)} km</span>
                  ${isOpen}
                </p>
              </div>
            </div>
          </div>
        `;
      });

      // Adjust map bounds to show all markers
      const bounds = new google.maps.LatLngBounds();
      results.forEach(place => bounds.extend(place.geometry.location));
      map.fitBounds(bounds);

      Utils.showAlert(`Found ${results.length} ${type}(s) nearby`, 'success');
    } else {
      listContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>No locations found. Try increasing the search radius.
        </div>
      `;
    }
  });
};

// Focus on specific marker
window.focusMarker = (index) => {
  if (markers[index]) {
    map.setCenter(markers[index].getPosition());
    map.setZoom(16);
    google.maps.event.trigger(markers[index], 'click');
  }
};

// Show place information in info window
window.showPlaceInfo = (place, marker) => {
  const content = `
    <div style="max-width: 250px;">
      <h6 class="mb-2">${place.name}</h6>
      <p class="mb-1 small">${place.vicinity}</p>
      ${place.rating ? `<p class="mb-1 small"><i class="fas fa-star text-warning"></i> ${place.rating} (${place.user_ratings_total} reviews)</p>` : ''}
      ${place.opening_hours?.open_now !== undefined ? `<p class="mb-1 small">${place.opening_hours.open_now ? '<span class="text-success">Open now</span>' : '<span class="text-danger">Closed</span>'}</p>` : ''}
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}" target="_blank" class="btn btn-sm btn-primary mt-2">
        <i class="fas fa-external-link-alt me-1"></i>View on Google Maps
      </a>
    </div>
  `;

  infoWindow.setContent(content);
  infoWindow.open(map, marker);
};

// Calculate distance between two points (Haversine formula)
window.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// FitTrack Application

// Home Page
Router.addRoute('home', (container) => {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="fade-in">Welcome to FitTrack</h1>
        <p class="fade-in">Your comprehensive fitness companion for a healthier lifestyle</p>
        <div class="mt-4">
          ${!Auth.isAuthenticated() ? `
            <a href="#register" class="btn btn-light btn-lg me-2">Get Started</a>
            <a href="#login" class="btn btn-outline-light btn-lg">Login</a>
          ` : `
            <a href="#dashboard" class="btn btn-light btn-lg">Go to Dashboard</a>
          `}
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container my-5">
      <h2 class="text-center mb-5">Features</h2>
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card feature-card">
            <i class="fas fa-weight"></i>
            <h3>BMI & Weight Tracking</h3>
            <p>Track your BMI and weight over time with beautiful charts and insights.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card feature-card">
            <i class="fas fa-dumbbell"></i>
            <h3>Personalized Workouts</h3>
            <p>Get workout recommendations based on your fitness level and BMI.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card feature-card">
            <i class="fas fa-utensils"></i>
            <h3>Healthy Recipes</h3>
            <p>Discover nutritious recipes with dietary filters and calorie tracking.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card feature-card">
            <i class="fas fa-map-marker-alt"></i>
            <h3>Nearby Gyms & Parks</h3>
            <p>Find fitness locations near you with prices and reviews.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card feature-card">
            <i class="fas fa-cloud-sun"></i>
            <h3>Weather-Based Tips</h3>
            <p>Get smart workout recommendations based on current weather.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card feature-card">
            <i class="fas fa-chart-line"></i>
            <h3>Progress Tracking</h3>
            <p>Monitor your fitness journey with detailed statistics and reports.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient text-white text-center py-5">
      <div class="container">
        <h2 class="mb-4">Ready to Start Your Fitness Journey?</h2>
        <p class="lead mb-4">Join FitTrack today and achieve your health goals!</p>
        ${!Auth.isAuthenticated() ? `
          <a href="#register" class="btn btn-light btn-lg">Sign Up Now</a>
        ` : ''}
      </div>
    </section>
  `;
});

// Login Page
Router.addRoute('login', (container) => {
  if (Auth.isAuthenticated()) {
    Router.navigate('dashboard');
    return;
  }

  container.innerHTML = `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0"><i class="fas fa-sign-in-alt me-2"></i>Login</h3>
            </div>
            <div class="card-body">
              <form id="login-form">
                <div class="mb-3">
                  <label for="identifier" class="form-label">Username or Email</label>
                  <input type="text" class="form-control" id="identifier" placeholder="Enter your username or email" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  <i class="fas fa-sign-in-alt me-2"></i>Login
                </button>
              </form>
              <div class="text-center mt-3">
                <p>Don't have an account? <a href="#register">Register here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;

    try {
      // Send as either email or username depending on format
      const loginData = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await API.login(loginData);
      Auth.setToken(response.token);
      Auth.setUser(response.user);
      Auth.updateUI();
      Utils.showAlert('Login successful!', 'success');
      Router.navigate('dashboard');
    } catch (error) {
      Utils.showAlert(error.message || 'Login failed', 'danger');
    }
  });
});

// Register Page
Router.addRoute('register', (container) => {
  if (Auth.isAuthenticated()) {
    Router.navigate('dashboard');
    return;
  }

  container.innerHTML = `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0"><i class="fas fa-user-plus me-2"></i>Create Account</h3>
            </div>
            <div class="card-body">
              <form id="register-form">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Full Name</label>
                    <input type="text" class="form-control" id="name" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" required minlength="3" pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores allowed">
                    <small class="text-muted">Min 3 characters, letters, numbers, and underscores only</small>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required minlength="8">
                    <small class="text-muted">Min 8 characters</small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="height" class="form-label">Height (cm)</label>
                    <input type="number" class="form-control" id="height" min="50" max="300">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="weight" class="form-label">Current Weight (kg)</label>
                    <input type="number" class="form-control" id="weight" min="20" max="500" step="0.1">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="gender" class="form-label">Gender</label>
                    <select class="form-control" id="gender">
                      <option value="prefer-not-to-say">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  <i class="fas fa-user-plus me-2"></i>Register
                </button>
              </form>
              <div class="text-center mt-3">
                <p>Already have an account? <a href="#login">Login here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
      name: document.getElementById('name').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      height: parseFloat(document.getElementById('height').value) || undefined,
      currentWeight: parseFloat(document.getElementById('weight').value) || undefined,
      gender: document.getElementById('gender').value
    };

    try {
      const response = await API.register(userData);
      Auth.setToken(response.token);
      Auth.setUser(response.user);
      Auth.updateUI();
      Utils.showAlert('Registration successful!', 'success');
      Router.navigate('dashboard');
    } catch (error) {
      Utils.showAlert(error.message || 'Registration failed', 'danger');
    }
  });
});

// Dashboard Page
Router.addRoute('dashboard', async (container) => {
  if (!Auth.isAuthenticated()) {
    Router.navigate('login');
    return;
  }

  Utils.showLoading(container);

  try {
    const [statsResponse, chartResponse] = await Promise.all([
      API.getStats(30),
      API.getWeightChartData(30)
    ]);

    const stats = statsResponse.stats;
    const chartData = chartResponse.data;

    container.innerHTML = `
      <div class="container my-5">
        <h2 class="mb-4"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</h2>

        <!-- Stats Cards -->
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="stat-card">
              <h4>${stats.currentWeight || 'N/A'} kg</h4>
              <p>Current Weight</p>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stat-card">
              <h4>${stats.currentBMI || 'N/A'}</h4>
              <p>Current BMI</p>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stat-card">
              <h4>${stats.workouts.totalWorkouts}</h4>
              <p>Workouts (30 days)</p>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stat-card">
              <h4>${stats.workouts.totalCalories}</h4>
              <p>Calories Burned</p>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">Weight Trend (30 Days)</div>
              <div class="card-body">
                <canvas id="weight-chart"></canvas>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">BMI Trend (30 Days)</div>
              <div class="card-body">
                <canvas id="bmi-chart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">Quick Actions</div>
              <div class="card-body">
                <div class="row text-center">
                  <div class="col-md-3 mb-2">
                    <a href="#bmi" class="btn btn-primary w-100">
                      <i class="fas fa-calculator me-2"></i>Log Weight
                    </a>
                  </div>
                  <div class="col-md-3 mb-2">
                    <a href="#workouts" class="btn btn-success w-100">
                      <i class="fas fa-dumbbell me-2"></i>Find Workout
                    </a>
                  </div>
                  <div class="col-md-3 mb-2">
                    <a href="#recipes" class="btn btn-warning w-100">
                      <i class="fas fa-utensils me-2"></i>Browse Recipes
                    </a>
                  </div>
                  <div class="col-md-3 mb-2">
                    <a href="#locations" class="btn btn-info w-100">
                      <i class="fas fa-map-marker-alt me-2"></i>Find Gyms
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Create charts
    if (chartData.weights.length > 0) {
      new Chart(document.getElementById('weight-chart'), {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Weight (kg)',
            data: chartData.weights,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          }
        }
      });

      new Chart(document.getElementById('bmi-chart'), {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'BMI',
            data: chartData.bmis,
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  } catch (error) {
    Utils.showAlert('Error loading dashboard: ' + error.message, 'danger');
  }
});

// Continue with more routes in next file...

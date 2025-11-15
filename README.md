# FitTrack - Comprehensive Fitness Tracking Web Application

![FitTrack](https://img.shields.io/badge/FitTrack-v1.0.0-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

FitTrack is a comprehensive web application that helps users maintain a healthy lifestyle by tracking BMI and weight changes, finding nearby fitness facilities, providing personalized workout plans, offering healthy recipes, and making smart recommendations based on weather and physical condition.

## 🚀 Features

### Core Functionality
- **User Authentication & Profile Management**
  - Secure registration and login with JWT
  - Profile customization with fitness goals
  - Password hashing with bcrypt

- **BMI Calculator & Weight Tracking**
  - Real-time BMI calculation
  - Historical weight logging
  - Interactive charts with Chart.js
  - Weight trend visualization

- **Google Maps Integration**
  - Find nearby gyms, parks, running tracks
  - Location details with ratings and reviews
  - Distance calculation from user location
  - Price comparison

- **Personalized Workout Plans**
  - BMI-based workout recommendations
  - Difficulty levels (beginner, intermediate, advanced)
  - Joint-friendly exercises for higher BMI
  - Workout logging and history

- **Recipe Database & Nutrition**
  - Dietary filters (vegan, vegetarian, keto, paleo, gluten-free)
  - Allergen exclusion
  - Calorie and macronutrient tracking
  - Meal type filtering

- **Weather Integration**
  - Current weather and 5-day forecast
  - Weather-based workout recommendations
  - Indoor/outdoor activity suggestions

- **Statistics & Progress Tracking**
  - Comprehensive dashboard
  - Weight and BMI trends
  - Workout statistics
  - Calorie tracking

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 (responsive design)
- Chart.js (data visualization)
- Font Awesome (icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (authentication)
- bcrypt.js (password hashing)

### External APIs
- Google Maps JavaScript API
- OpenWeatherMap API
- (Optional) Recipe APIs (Edamam/Spoonacular)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v6 or higher) - running locally or MongoDB Atlas account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd FitTrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fittrack
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fittrack

# JWT
JWT_SECRET=your-long-random-secret-key-change-in-production
JWT_EXPIRE=24h

# API Keys
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
OPENWEATHER_API_KEY=your-openweather-api-key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Get API Keys

**Google Maps API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Maps JavaScript API" and "Places API"
4. Create credentials (API key)
5. Restrict the API key (optional but recommended)

**OpenWeatherMap API:**
1. Sign up at [OpenWeatherMap](https://openweathermap.org/)
2. Generate an API key (free tier: 1000 calls/day)

### 5. Seed the Database

Populate the database with sample workouts and recipes:

```bash
node server/seed.js
```

You should see:
```
✓ 5 workouts added
✓ 5 recipes added
✓ Database seeded successfully!
```

### 6. Start the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 🎯 Usage Guide

### First Time Setup

1. **Register an Account**
   - Navigate to `http://localhost:3000`
   - Click "Get Started" or "Register"
   - Fill in your details (name, email, password, height, weight)

2. **Log Your Weight**
   - Go to "BMI Calculator" page
   - Log your current weight
   - View your BMI category and recommendation

3. **Browse Workouts**
   - Visit "Workouts" page
   - View personalized recommendations based on your BMI
   - Click workouts to see detailed exercises

4. **Find Recipes**
   - Go to "Recipes" page
   - Filter by dietary preferences
   - View nutritional information and cooking instructions

5. **Locate Fitness Facilities**
   - Navigate to "Locations" page
   - Allow location access
   - Search for nearby gyms, parks, or tracks

## 📡 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "height": 175,
  "currentWeight": 75
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Weight Tracking

#### Log Weight
```http
POST /api/weight
Authorization: Bearer <token>
Content-Type: application/json

{
  "weight": 74.5,
  "notes": "Feeling great!"
}
```

#### Get Weight History
```http
GET /api/weight?days=30
Authorization: Bearer <token>
```

#### Get Chart Data
```http
GET /api/weight/chart?days=30
Authorization: Bearer <token>
```

#### Calculate BMI (Public)
```http
POST /api/weight/bmi/calculate
Content-Type: application/json

{
  "height": 175,
  "weight": 75
}
```

### Workouts

#### Get All Workouts
```http
GET /api/workouts?difficulty=beginner&type=cardio
```

#### Get Recommended Workouts
```http
GET /api/workouts/recommended/me
Authorization: Bearer <token>
```

#### Log Workout
```http
POST /api/workouts/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "workoutId": "workout_id_here",
  "duration": 30,
  "difficulty": 3,
  "notes": "Great session!"
}
```

### Recipes

#### Get Recipes
```http
GET /api/recipes?vegan=true&maxCalories=500
```

#### Get Recipe Details
```http
GET /api/recipes/:id
```

### Locations

#### Get Nearby Locations
```http
GET /api/locations/nearby?lat=47.5316&lng=21.6273&radius=5000&type=gym
```

#### Get Location Details
```http
GET /api/locations/:placeId
```

### Weather

#### Get Current Weather
```http
GET /api/weather/current?lat=47.5316&lng=21.6273
```

#### Get Weather Recommendation
```http
GET /api/weather/recommendation?lat=47.5316&lng=21.6273&bmi=24&fitnessLevel=intermediate
```

## 🌐 Deployment

### Netlify Deployment (Recommended for Frontend + Backend)

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Create `netlify.toml` in root:**
```toml
[build]
  command = "npm install"
  publish = "public"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. **Deploy:**
```bash
netlify deploy --prod
```

### Alternative: Split Deployment

**Frontend (Netlify/Vercel):**
- Deploy the `public` folder
- Set up redirects for SPA

**Backend (Heroku/Railway):**
- Deploy the Node.js application
- Add environment variables
- Use MongoDB Atlas for database

**Database (MongoDB Atlas):**
1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

## 🧪 Testing

### Manual Testing

1. **Authentication Flow:**
   - Register → Login → Dashboard → Logout

2. **BMI & Weight:**
   - Calculate BMI
   - Log weight
   - View charts

3. **Workouts:**
   - Browse workouts
   - View details
   - Log completed workout

4. **Recipes:**
   - Search recipes
   - Filter by diet
   - View nutrition info

5. **Locations:**
   - Find nearby gyms
   - View details
   - Check reviews

### API Testing with Postman

Import the following collection to test all endpoints:

```json
{
  "info": {
    "name": "FitTrack API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [...]
}
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT authentication with expiration
- ✅ Input validation with express-validator
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ NoSQL injection prevention
- ✅ XSS protection

## 📁 Project Structure

```
FitTrack/
├── server/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth & validation
│   │   └── utils/           # Helper functions
│   ├── server.js            # Express app setup
│   └── seed.js              # Database seeding
├── public/
│   ├── css/
│   │   └── style.css        # Custom styles
│   ├── js/
│   │   ├── config.js        # Configuration
│   │   ├── auth.js          # Authentication
│   │   ├── api.js           # API client
│   │   ├── router.js        # SPA routing
│   │   ├── app.js           # Main app logic
│   │   └── pages.js         # Page renderers
│   ├── images/              # Static images
│   └── index.html           # Main HTML
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── README.md                # This file
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection failed
```
**Solution:** Ensure MongoDB is running on localhost:27017 or check your MongoDB Atlas connection string.

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Change PORT in `.env` file or kill the process using port 3000.

### API Keys Not Working
**Solution:**
- Verify API keys are correctly set in `.env`
- Check API quotas haven't been exceeded
- Ensure `.env` is in the root directory

### Charts Not Displaying
**Solution:**
- Check if Chart.js is loaded (view browser console)
- Ensure there's data in the database (log some weight entries)

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Bootstrap for responsive design framework
- Chart.js for beautiful visualizations
- Google Maps for location services
- OpenWeatherMap for weather data
- Font Awesome for icons

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Happy Fitness Tracking! 💪🏃‍♂️🥗**

<<<<<<< HEAD
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
=======
# FitTrack



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://git-okt.sed.inf.szte.hu/imn417e_2025_fittrack/fittrack.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://git-okt.sed.inf.szte.hu/imn417e_2025_fittrack/fittrack/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> a554ef4aab5b5d06b369042af1c23fe61c1e1a63

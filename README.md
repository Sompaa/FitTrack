# FitTrack — Fitness Tracking Web Application

![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

FitTrack helps users maintain a healthy lifestyle by tracking BMI and weight, finding nearby fitness facilities, providing personalized workout plans, offering healthy recipes, and making smart recommendations based on weather and physical condition.

---

## Features

- **Authentication** — JWT-based register/login, bcrypt password hashing, admin role
- **BMI & Weight Tracking** — log daily weight, auto-calculate BMI, Chart.js trend graphs
- **Workout Plans** — 32 pre-built workouts (beginner → advanced), BMI-based recommendations, workout logging
- **Recipe Database** — 26 recipes with macros, dietary filters (vegan/keto/paleo/gluten-free), allergen exclusion
- **Location Services** — 11 Szeged venues (gyms, parks, pools, tracks) with Google Maps and `$near` proximity queries
- **Weather Integration** — OpenWeatherMap forecast + indoor/outdoor activity suggestions
- **Admin Dashboard** — manage users, view all logs

---

## Technology Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+), Bootstrap 5, Chart.js, Font Awesome

**Backend:** Node.js, Express.js, MongoDB Atlas + Mongoose, JWT, bcrypt.js

**External APIs:** Google Maps JavaScript API, OpenWeatherMap API

---

## Prerequisites

- Node.js v18+
- A MongoDB Atlas account (free tier is fine) — or local MongoDB v6+
- Git

---

## Installation

### 1. Clone & install

```bash
git clone <your-repository-url>
cd FitTrack
npm install
```

### 2. Configure environment

Copy the example and fill in your values:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Mac / Linux
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | Atlas connection string: `mongodb+srv://user:pass@cluster.mongodb.net/fittrack` |
| `JWT_SECRET` | Yes | Any long random string |
| `GOOGLE_MAPS_API_KEY` | For map features | From Google Cloud Console |
| `OPENWEATHER_API_KEY` | For weather | From openweathermap.org (free tier: 1000 calls/day) |
| `PORT` | No | Default: 3000 |

### 3. Seed the database

```bash
npm run seed
```

Expected output:

```
MongoDB connected for seeding
  32 workouts added
  26 recipes added
  33 locations added
  3 demo users created
  10 Hungarian users inserted
  77 weight log entries added
  41 workout log entries added
  10 fitness goals added

Demo accounts (password: password123):
  admin@fittrack.com  — Admin
  demo1@fittrack.com  — Alex Johnson (intermediate)
  demo2@fittrack.com  — Sam Rivera (beginner)
```

Re-run `npm run seed` any time to reset to a clean demo state.

### 4. Start the server

```bash
npm run dev    # development — nodemon auto-restarts on file changes
npm start      # production
```

Open **http://localhost:3000** in your browser.

---

## API Reference

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me           # Authorization: Bearer <token>
```

### Weight

```http
POST /api/weight            # { weight, notes }
GET  /api/weight?days=30
GET  /api/weight/chart?days=30
POST /api/weight/bmi/calculate   # public — { height, weight }
```

### Workouts

```http
GET  /api/workouts?difficulty=beginner&type=cardio
GET  /api/workouts/recommended/me   # Auth required
POST /api/workouts/log              # { workoutId, duration, perceivedEffort, notes }
GET  /api/workouts/logs/me
```

### Recipes

```http
GET /api/recipes?vegan=true&maxCalories=500
GET /api/recipes/:id
```

### Locations

```http
GET /api/locations/nearby?lat=46.25&lng=20.14&radius=5000&type=gym
GET /api/locations/:id
```

### Weather

```http
GET /api/weather/current?lat=46.25&lng=20.14
GET /api/weather/recommendation?lat=46.25&lng=20.14&bmi=24&fitnessLevel=intermediate
```

---

## Project Structure

```
FitTrack/
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── api.js        # fetch wrapper, auto-injects JWT
│       ├── app.js        # home / login / register / dashboard routes
│       ├── auth.js       # login state helpers
│       ├── config.js     # API base URL, city coords, ThemeManager
│       ├── favorites.js  # localStorage favourites
│       ├── pages.js      # all other page renderers
│       └── router.js     # hash-based SPA router
├── server/
│   ├── server.js
│   ├── seed.js           # combined seed (run via npm run seed)
│   └── src/
│       ├── controllers/
│       ├── middleware/   # auth.js (protect), adminAuth.js (requireAdmin)
│       ├── models/       # User, Workout, WorkoutLog, WeightLog, Recipe, Location, FitnessGoal
│       ├── routes/
│       └── utils/jwt.js
├── docs/                 # UML diagrams (.puml) + project plan
├── .env.example
├── .gitignore
├── netlify.toml
└── package.json
```

---

## Demo Accounts

All passwords: `password123`

| Email | Role | Data |
|---|---|---|
| `admin@fittrack.com` | Admin | Full access to `/api/admin` |
| `demo1@fittrack.com` | User (intermediate) | 30 days weight + workout logs |
| `demo2@fittrack.com` | User (beginner) | 30 days weight + workout logs |

---

## Deployment

The `netlify.toml` is pre-configured for frontend-only Netlify hosting (static `public/` + SPA redirect). For a full-stack deploy use **Railway** or **Render** for the Node.js backend and **MongoDB Atlas** for the database.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `MongoServerError` / `ECONNREFUSED` | Check `MONGODB_URI` in `.env`; whitelist your IP in Atlas Network Access |
| `Port 3000 already in use` | Set `PORT=3001` in `.env` or kill the process (`netstat -ano \| findstr :3000`) |
| `Cannot find module` | Run `npm install` |
| Map not loading | Verify `GOOGLE_MAPS_API_KEY` and that Maps JavaScript API is enabled in Google Cloud Console |
| Charts not displaying | Log some weight entries first; check browser console for JS errors |

---

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT with 24h expiry
- Rate limiting on `/api/`: 100 req / 15 min / IP
- CORS configured to `CLIENT_URL`
- Never commit `.env` — only `.env.example` (with placeholders) is tracked

---

## License

MIT

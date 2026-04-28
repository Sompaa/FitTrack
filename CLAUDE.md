# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Development server with nodemon auto-reload
npm start         # Production server
npm test          # Run Jest tests (no test files exist yet — will report "no tests found")
npm run seed      # Seed MongoDB with sample workouts and recipes
```

There is no lint command configured.

## Architecture Overview

FitTrack is a single Express.js application that serves both a REST API and a vanilla JavaScript SPA. The backend lives in `/server`, the frontend in `/public`.

**Backend** (`/server`):
- Entry point: `server/server.js` — registers routes, connects to MongoDB, serves `/public` as static files
- Pattern: `routes/ → controllers/ → models/` — routes define endpoints, controllers handle logic, models define Mongoose schemas
- Auth middleware (`src/middleware/auth.js`) — `protect` middleware validates JWT Bearer tokens; attach it to any route that requires login
- Admin middleware (`src/middleware/adminAuth.js`) — `requireAdmin` must run after `protect`; checks `req.user.isAdmin`
- JWT utilities (`src/utils/jwt.js`) — token generation/verification; 24h expiry via `JWT_EXPIRE` env var

**Frontend** (`/public`):
- Pure vanilla JS SPA with hash-based routing (`#home`, `#dashboard`, `#recipes`, etc.)
- `router.js` maps hashes to page renderers; supports sub-routes (`#admin/USER_ID` → route `admin`, params `['USER_ID']`)
- `app.js` — registers simple routes: `home`, `login`, `register`, `dashboard`
- `pages.js` — registers all remaining routes (2000+ lines of HTML templates)
- `api.js` — centralized `fetch` wrapper that auto-injects the JWT token from `localStorage` (`fittrack_token`)
- `config.js` — API base URL (`window.location.origin + '/api'`), city coordinates for location features, and `ThemeManager` (dark/light mode persisted in `localStorage`)
- `auth.js` — login state helpers; `favorites.js` — client-side favorites (recipes/workouts) stored in `localStorage`
- All dynamic content is rendered into `<div id="app-content">` in `index.html`

## Key Data Models

| Model | Purpose |
|---|---|
| `User` | Profile, height/weight, fitness level, preferences; password hashed with bcryptjs; `isAdmin` boolean for admin access |
| `WeightLog` | Weight entries; BMI is calculated and stored on save |
| `Workout` | Predefined workouts with difficulty, type, exercises, BMI suitability ranges |
| `WorkoutLog` | User's completed workout sessions |
| `Recipe` | Recipe database with macros, dietary flags, allergens |
| `Location` | Gyms/parks/tracks/pools with GeoJSON Point coordinates; requires a `2dsphere` index for `$near` proximity queries |

## Authentication & Authorization Flow

1. `POST /api/auth/register` or `/api/auth/login` → returns JWT
2. Frontend stores token in `localStorage` as `fittrack_token`
3. `api.js` attaches `Authorization: Bearer <token>` to every request
4. `protect` middleware on the server decodes the token and populates `req.user`
5. Admin-only routes chain `protect` then `requireAdmin` — the latter checks `req.user.isAdmin`; grant admin by setting `isAdmin: true` directly in MongoDB

## API Routes

| Prefix | Description |
|---|---|
| `/api/auth` | Login, register |
| `/api/users` | Profile, stats |
| `/api/weight` | Weight logging |
| `/api/workouts` | Workouts & logs (browse/recommend/log) |
| `/api/recipes` | Recipe browser |
| `/api/locations` | Nearby gyms/parks (geospatial) |
| `/api/weather` | Weather proxy → OpenWeatherMap |
| `/api/admin` | Admin dashboard — all routes require `isAdmin` |
| `/api/health` | Health check |

## External Integrations

- **Google Maps JS API** — location search for nearby gyms/parks (key: `GOOGLE_MAPS_API_KEY`); loads directly in the browser
- **OpenWeatherMap API** — weather data fetched via backend proxy at `/api/weather` (key: `OPENWEATHER_API_KEY`)

## Environment Variables

`.env.example` already contains working development credentials — copy it to `.env` to run locally with no changes.

```
PORT=3000
NODE_ENV=development
MONGODB_URI=          # MongoDB Atlas connection string
JWT_SECRET=           # Secret for signing JWTs
JWT_EXPIRE=24h
GOOGLE_MAPS_API_KEY=
OPENWEATHER_API_KEY=
CLIENT_URL=http://localhost:3000
```

## Notes

- Some comments in `config.js` and `favorites.js` are in Hungarian — this is intentional.
- `passport` and `passport-jwt` are installed but not used in active routes; auth is handled entirely via the custom `protect` middleware.
- Rate limiting is applied to `/api/` only: 100 requests per 15 minutes per IP (`express-rate-limit`).
- The canonical seed script is `server/seed.js` (run via `npm run seed`). It seeds all 7 collections: workouts (32), recipes (26), locations (11), users (13), weightlogs (77), workoutlogs (41), fitnessgoals (10).
- `server/src/models/FitnessGoal.js` was added manually — there is no route or controller for it yet.

## TODO

- **FitnessGoal routes**: Add `/api/goals` routes + controller so the model is actually accessible via the API

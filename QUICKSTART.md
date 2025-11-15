# 🚀 FitTrack Quick Start Guide

Your API keys have been configured! Here's how to get started quickly.

## ✅ What's Already Configured

- ✅ **Google Maps API Key**: Configured in both backend and frontend
- ✅ **OpenWeatherMap API Key**: Configured for weather features
- ✅ **JWT Secret**: Set for authentication
- ✅ **All dependencies**: Listed in package.json

## 📋 Next Steps

### Option 1: Using MongoDB Locally

If you have MongoDB installed:

```bash
# 1. Start MongoDB
mongod

# 2. In a new terminal, install dependencies
npm install

# 3. Seed the database with sample data
node server/seed.js

# 4. Start the application
npm start
```

### Option 2: Using MongoDB Atlas (Cloud - Recommended)

**MongoDB Atlas is FREE and easier to set up!**

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (it's free!)

2. **Create a Cluster**
   - Choose FREE tier (M0)
   - Select a region close to you
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `fittrack`
   - Password: Generate or create one (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://fittrack:<password>@...`)

6. **Update .env File**
   - Open `.env` file in FitTrack folder
   - Replace the `MONGODB_URI` line with your connection string
   - Replace `<password>` with your actual password

   Example:
   ```
   MONGODB_URI=mongodb+srv://fittrack:yourpassword@cluster0.xxxxx.mongodb.net/fittrack?retryWrites=true&w=majority
   ```

7. **Install, Seed, and Run**
   ```bash
   # Install dependencies
   npm install

   # Seed database with sample workouts and recipes
   node server/seed.js

   # Start the application
   npm start
   ```

## 🌐 Access Your Application

Once the server starts, you'll see:
```
Server is running on port 3000
MongoDB connected successfully
```

**Open your browser and go to:** http://localhost:3000

## 👤 Create Your First Account

1. Click **"Get Started"** or **"Register"**
2. Fill in your details:
   - Name: Your name
   - Email: your@email.com
   - Password: At least 8 characters, 1 uppercase, 1 number
   - Height: Your height in cm
   - Weight: Your current weight in kg

3. Click **"Register"** - You'll be automatically logged in!

## 🎯 Try These Features

### 1. Dashboard
- View your stats and progress
- See weight/BMI charts
- Quick access to all features

### 2. Log Your Weight
- Go to **BMI Calculator** page
- Enter your current weight
- Click "Log Weight"
- View it on your dashboard chart!

### 3. Find Workouts
- Go to **Workouts** page
- Browse personalized recommendations
- Click a workout to see exercises
- Log completed workouts

### 4. Browse Recipes
- Go to **Recipes** page
- Filter by dietary preferences (Vegan, Keto, etc.)
- Click a recipe for full details
- View nutrition information

### 5. Find Gyms Near You
- Go to **Locations** page
- Allow location access when prompted
- Select type (Gym, Park, etc.)
- Click "Search"
- View locations on map

## 🔧 Troubleshooting

### Port 3000 Already in Use
```bash
# Change PORT in .env file to 3001 or any other port
PORT=3001
```

### MongoDB Connection Error
- **Using Local MongoDB**: Make sure MongoDB is running (`mongod`)
- **Using MongoDB Atlas**:
  - Check your connection string in `.env`
  - Make sure you replaced `<password>` with actual password
  - Verify network access allows your IP

### API Features Not Working
- **Google Maps**: Make sure the API key is enabled in Google Cloud Console
- **Weather**: OpenWeatherMap free tier has 1000 calls/day limit

### Need to Reset Database
```bash
# Re-run the seed script
node server/seed.js
```

## 📱 Mobile Testing

The app is fully responsive! Try it on your phone:

1. Find your computer's IP address:
   ```bash
   # On Mac/Linux:
   ifconfig | grep "inet "

   # On Windows:
   ipconfig
   ```

2. Update `.env`:
   ```
   CLIENT_URL=http://YOUR_IP:3000
   ```

3. Access from phone: `http://YOUR_IP:3000`

## 🚀 Ready for Production?

See the main **README.md** for:
- Netlify deployment instructions
- Security best practices
- Environment variable management
- API documentation

## 💡 Tips

- **Backup your data**: Export weight logs regularly
- **Secure your API keys**: Don't share them publicly
- **Monitor API usage**: Check Google and OpenWeather dashboards
- **Update regularly**: Keep dependencies up to date with `npm update`

## 🆘 Need Help?

- Check the full **README.md** for detailed documentation
- Review API endpoint documentation
- Check browser console for errors (F12)
- Verify `.env` file has all required values

---

**Enjoy tracking your fitness journey with FitTrack! 💪**

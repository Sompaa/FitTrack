# FitTrack UML Diagrams

This directory contains comprehensive UML diagrams for the FitTrack application.

## 📊 Available Diagrams

### 1. Use Case Diagram (`use-case-diagram.puml`)
Shows all the use cases and actors in the FitTrack system, including:
- **Actors**: Guest User, Authenticated User, OpenWeather API, Google Maps API
- **8 Main Packages**:
  - Authentication (Register, Login, Logout)
  - Weight Management (BMI Calculator, Weight Logging, History)
  - Dashboard (Statistics, Progress Charts)
  - Workout Management (Browse, Filter, Log, Recommendations)
  - Recipe Management (Browse, Search, Filter)
  - Location Services (Search gyms/parks with Google Maps)
  - Weather Services (Current weather, Forecast, Recommendations)
  - Profile Management (View, Update)

### 2. Class Diagram (`class-diagram.puml`)
Comprehensive class diagram showing:
- **Models**: User, WeightLog, WorkoutLog, Workout, Recipe, Exercise, Nutrition, DietaryInfo, Ingredient
- **Controllers**: Auth, User, Weight, Workout, Recipe, Weather, Location
- **Middleware**: Authentication, Validation
- **External Services**: OpenWeather API, Google Maps API
- **Relationships**: Associations, compositions, dependencies

### 3. Sequence Diagram (`sequence-diagram-log-workout.puml`)
Detailed sequence diagram showing the "Log Workout" flow:
- User authentication
- Form submission
- JWT token verification
- Database validation
- Workout log creation
- Success response
- Dashboard update

## 🖥️ How to View the Diagrams

### Option 1: Online PlantUML Viewer (Easiest)
1. Go to [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)
2. Copy the content of any `.puml` file
3. Paste it into the text area
4. Click "Submit" to view the diagram

### Option 2: VS Code Extension (Recommended)
1. Install the "PlantUML" extension in VS Code
2. Open any `.puml` file
3. Press `Alt + D` (or right-click → "Preview Current Diagram")
4. The diagram will render in a preview pane

### Option 3: Generate PNG/SVG Images
Install PlantUML locally:
```bash
# Install Java (required)
# Windows: Download from java.com
# Mac: brew install java
# Linux: sudo apt-get install default-jre

# Install PlantUML
# Download plantuml.jar from https://plantuml.com/download

# Generate images
java -jar plantuml.jar docs/use-case-diagram.puml
java -jar plantuml.jar docs/class-diagram.puml
java -jar plantuml.jar docs/sequence-diagram-log-workout.puml
```

This will generate `.png` files in the same directory.

### Option 4: Online Tools
- **PlantText**: https://www.planttext.com/
- **PlantUML QEditor**: https://github.com/borisbrodski/PlantUML-QEditor

## 📁 Diagram Files

```
docs/
├── README.md                           # This file
├── use-case-diagram.puml              # Use Case Diagram (actors & use cases)
├── class-diagram.puml                 # Class Diagram (models & controllers)
└── sequence-diagram-log-workout.puml  # Sequence Diagram (log workout flow)
```

## 🎨 Diagram Details

### Use Case Diagram
- **Purpose**: Shows what users can do in the system
- **Actors**: 4 actors (2 human, 2 system)
- **Use Cases**: 29 use cases across 8 functional areas
- **Relationships**: Includes, extends, and uses relationships

### Class Diagram
- **Purpose**: Shows the system's structure and relationships
- **Classes**:
  - 9 Model classes
  - 7 Controller classes
  - 2 Middleware classes
  - 2 External service classes
- **Relationships**:
  - Associations (User to WeightLog, User to WorkoutLog, etc.)
  - Compositions (Recipe contains Ingredients, Workout contains Exercises)
  - Dependencies (Controllers use Models)

### Sequence Diagram
- **Purpose**: Shows the flow of logging a workout
- **Participants**: 10 components from User to Database
- **Steps**: ~40 interactions
- **Scenarios**: Success path, authentication failure, workout not found

## 🔧 Customization

You can modify the diagrams by editing the `.puml` files:
- Change colors using `skinparam`
- Add/remove use cases or classes
- Adjust relationships
- Add notes and annotations

## 📚 PlantUML Syntax Reference

- [Official PlantUML Guide](https://plantuml.com/)
- [Use Case Diagram Syntax](https://plantuml.com/use-case-diagram)
- [Class Diagram Syntax](https://plantuml.com/class-diagram)
- [Sequence Diagram Syntax](https://plantuml.com/sequence-diagram)

## 🎯 Usage in Documentation

These diagrams can be:
- Included in project documentation
- Used for presentations
- Shared with stakeholders
- Referenced during development
- Used for onboarding new developers

---

**Generated for FitTrack Application**
*Comprehensive fitness tracking web application*

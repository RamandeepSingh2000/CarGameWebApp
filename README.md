# 🚗 Car Racing Game - 3D Adventure

## 🌟 Description
A modern 3D car racing game built with Babylon.js for immersive gameplay, featuring a microservices architecture with Apollo GraphQL for backend services and React for the frontend. The game includes AI-powered chat assistance, player progress tracking, and a leaderboard system.

## ✨ Key Features

### Game Features
- 🏎️ 3D car physics and controls using Babylon.js
- 🗺️ Multiple challenging levels with different environments
- 🎮 Keyboard controls for car movement and camera
- 🔊 Immersive audio effects for engine, collisions, and environment
- 🏆 Experience points, scoring system, and achievements

### Technical Features
- 🤖 AI-powered game assistant using Google's Gemini API
- 📊 Player progress tracking and statistics
- 🏆 Global leaderboard to compare scores
- 💬 Interactive chat interface for game hints and tips
- 🔐 JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- React (Microfrontends architecture)
- Babylon.js (3D game engine)
- Apollo Client (GraphQL)
- Bootstrap (UI components)

### Backend
- Node.js
- Apollo Server (GraphQL)
- MongoDB (Database)
- Google Gemini API (AI chat)
- JWT (Authentication)

## 📂 Project Structure

### Microservices
- `auth-microservice`: Handles user authentication and management
- `game-progress-microservice`: Manages player progress, scores, and leaderboard
- `shell-service`: Main entry point that orchestrates other services

### Microfrontends
- `auth-app`: User login/registration interface
- `game-app`: 3D game interface built with Babylon.js
- `chatbot-app`: AI-powered game assistant
- `game-progress-app`: Player statistics and progress dashboard
- `shell-app`: Main container that integrates all microfrontends

## ⚙️ Configuration

### Important Environment Variables
- `SERVICE_MONGO_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key for AI chat
- `JWT_SECRET`: Secret key for JWT token generation
- `Google_API_KEY`: Additional Google API key for services

## 🚀 Getting Started

### 1. Backend Setup

#### 1. Make sure mongoDB is running on your computer.

#### 2. Running Auth Service
```bash
# Create a .env file in microservices/auth-service
SERVICE_MONGO_URI='Mongo db url here'
JWT_SECRET='your_jwt_secret_here'


```bash
# In a terminal, from root folder
cd microservices/auth-service
npm i
npm run dev
```

#### 3. Running Game-Progress Service


# Create a .env file in microservices/game-progress-service
SERVICE_MONGO_URI='Mongo db url here'
GEMINI_API_KEY='api key here'
Google_API_KEY='api key here'

```bash
# In a terminal, from root folder
cd microservices/game-progress-service
npm i
npm run dev
```
#### 4. Running Shell Service

```bash
# In a terminal, from root folder
cd microservices/shell-service
npm i
npm run start
```

### 2. Frontend Setup

#### 1. Running Auth App

```bash
# In a terminal, from root folder
cd microfrontends/auth-app
npm i
npm run deploy
```

#### 2. Running Chatbot App

```bash
# In a terminal, from root folder
cd microfrontends/chatbot-app
npm i
npm run deploy
```
#### 3. Running Game App

```bash
# In a terminal, from root folder
cd microfrontends/game-app
npm i
npm run deploy
```

#### 4. Running Game-Progress App

```bash
# In a terminal, from root folder
cd microfrontends/game-progress-app
npm i
npm run deploy
```

#### 5. Running Shell App

```bash
# In a terminal, from root folder
cd microfrontends/shell-app
npm i
npm run dev
```

#### 6. Go to http://localhost:3000

---

## 🎮 Game Controls

### Basic Controls
- **W/Up Arrow**: Accelerate
- **S/Down Arrow**: Brake/Reverse
- **A/Left Arrow**: Steer Left
- **D/Right Arrow**: Steer Right

## 🔄 Game Flow

1. **Authentication**: Players must register/login to play
2. **Progress Tracking**: Game automatically saves:
   - Current level progress
   - Collected experience points
   - Achievements unlocked
3. **Level Progression**: 
   - Complete objectives to advance
   - Earn higher scores for better leaderboard ranking

## 🛠️ Development Notes

### Key Implementation Details

**Game Engine (game.js)**
- Uses Babylon.js for 3D rendering and physics
- Implements custom car physics with acceleration, braking, and drifting
- Dynamic camera system that follows the player's car
- Modular level loading system

**AI Chat System (resolvers.js)**
- Context-aware responses using player's current level
- Maintains conversation history (last 3 interactions)
- Integrates with game hint database
- Rate limiting implemented to prevent API abuse

**Progress Tracking (GameProgress.jsx)**
- Real-time updates via GraphQL subscriptions
- Persists data between sessions
- Calculates player rankings automatically

## 🚨 Common Issues & Solutions

1. **Authentication Problems**:
   - Clear cookies if login fails
   - Ensure JWT_SECRET matches across services

2. **Game Not Loading**:
   - Check browser console for WebGL errors
   - Verify all microservices are running

3. **AI Chat Not Responding**:
   - Confirm GEMINI_API_KEY is valid
   - Check network requests for errors

4. **Database Connection Issues**:
   - Verify MongoDB is running
   - Check SERVICE_MONGO_URI format

## 📈 Future Improvements

### Planned Features
- Multiplayer racing mode
- Custom car customization
- Additional power-ups and obstacles
- Mobile device support

### Technical Enhancements
- Implement Redis caching for leaderboard
- Add GraphQL subscriptions for real-time updates
- Improve AI chat response quality with fine-tuning

## 📚 API Documentation

### Game Progress Service Endpoints
- `gameProgress`: Get player's progress by ID
- `gameProgressByUserId`: Get/Create progress for user
- `leaderboard`: Get top players globally
- `gameAIQuery`: Interact with game assistant
- `gameHint`: Get level-specific hints

### Auth Service Endpoints
- `login`: Authenticate user
- `register`: Create new account
- `currentUser`: Get logged-in user info

## 🙏 Acknowledgments
- Babylon.js community
- Apollo GraphQL team
- Google Gemini API
- React Bootstrap contributors

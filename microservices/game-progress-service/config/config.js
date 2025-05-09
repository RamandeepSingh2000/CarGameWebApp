// server/microservices/auth-service/config/config.js
import dotenv from 'dotenv';
dotenv.config();
// Configuration for auth-service
export const config = {
  db: process.env.SERVICE_MONGO_URI || 'mongodb://localhost:27017/group7DB',  // ✅ Separate DB for auth-service
  port: process.env.SERVICE_PORT || 4002,  // ✅ Correct port for auth-service
};

// Log in development mode
if (process.env.NODE_ENV !== 'production') {    
    console.log(`🚀 Game Progress Microservice running on port: ${config.port}`);
  }
  
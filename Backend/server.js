import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/errorHandler.js';


dotenv.config(); 
console.log("FULL MONGO_URI:", process.env.MONGO_URI?.substring(0, 50) + "..."); // ✅ Line 9 - dotenv ONLY ONCE!

const app = express();

// ✅ Test MONGO_URI loading
console.log("FULL MONGO_URI:", process.env.MONGO_URI ? "✅ LOADED" : "❌ EMPTY");

connectDB();  // ✅ Uses your existing config/database.js

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampusEventHub API is running',
    version: '1.0.0',
    milestone: 'Milestone 1 - Authentication & User Management'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;

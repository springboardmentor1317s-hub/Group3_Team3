import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';  // ← MUST HAVE THIS
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampusEventHub API is running',
    version: '1.0.0',
    milestone: 'Milestone 1 - Authentication & User Management',
    features: ['Authentication', 'User Management', 'AI Chatbot']
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);  // ← MUST HAVE THIS

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
<<<<<<< HEAD
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Chatbot: Enabled at /api/chatbot`);
=======
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI}`);
>>>>>>> 8b1b8d9 (milestone-1)
});

export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import eventRoutes from './routes/event.routes.js';
import registrationRoutes from './routes/registration.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import feedbackRoutes from "./routes/feedback.routes.js";
import commentRoutes  from "./routes/comment.routes.js";



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampusEventHub API is running',
    version: '1.0.0',
    features: ['Authentication', 'User Management', 'AI Chatbot', 'Events', 'Registrations', 'Notifications']
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/feedback",  feedbackRoutes);
app.use("/api/comments",  commentRoutes);



app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Chatbot:       Enabled at /api/chatbot`);
  console.log(`🎉 Events:        Enabled at /api/events`);
  console.log(`📋 Registrations: Enabled at /api/registrations`);
  console.log(`🔔 Notifications: Enabled at /api/notifications`);
  console.log(`🖼️  Uploads:       Served at /uploads`);
});

export default app;
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/authRoutes.js';
import tokenAuthRoutes from './routes/tokenAuthRoutes.js';
import dueRoutes from './routes/dueRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import connectMongo from './db/db.js';

dotenv.config();

// For ES modules, manually create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.use(cookieParser());
// Middleware to parse multipart/form-data
const upload = multer();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

// Use multer to parse multipart/form-data for all routes
app.use(upload.any());

app.use('/api/auth', authRoutes);
app.use('/api/authentication', tokenAuthRoutes);
app.use('/api/dues', dueRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin/analytics', analyticsRoutes);


// Serve static files from React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
 
// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
  connectMongo();
});
// IMPORTANT: Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import workshopRoutes from './routes/workshops';
import materialRoutes from './routes/materials';
import progressRoutes from './routes/progress';
import userRoutes from './routes/users';
import externalMaterialRoutes from './routes/externalMaterial';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/admin/workshops', workshopRoutes); // Admin workshop routes
app.use('/api', materialRoutes);
app.use('/api/admin', materialRoutes); // Admin material routes (for /api/admin/workshops/:id/materials)
app.use('/api', progressRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api', externalMaterialRoutes); // External material completion routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.FRONTEND_URL,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL
    }
  });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  
  // Catch-all route for SPA - must be after all API routes
  app.use((req, res, next) => {
    // Only handle GET requests that don't start with /api
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
      next();
    }
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

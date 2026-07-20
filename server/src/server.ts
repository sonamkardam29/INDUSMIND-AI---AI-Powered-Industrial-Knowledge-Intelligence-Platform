import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { seedDatabase } from './seed/seed';

// Import Routes
import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';
import chatRoutes from './routes/chatRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import complianceRoutes from './routes/complianceRoutes';
import kgRoutes from './routes/kgRoutes';
import reportRoutes from './routes/reportRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import adminRoutes from './routes/adminRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Healthcheck & Welcome
app.get('/', (_req, res) => {
  res.json({
    platform: 'INDUSMIND AI',
    tagline: 'AI Powered Industrial Knowledge Intelligence Platform',
    version: '1.0.0 Enterprise',
    status: 'Operational',
    event: 'ET AI Hackathon 2026',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/kg', kgRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`[INDUSMIND AI] Server running on port ${ENV.PORT}`);
    console.log(`[INDUSMIND AI] Environment: ${ENV.NODE_ENV}`);
    console.log(`=======================================================`);
  });
};

startServer();

export default app;

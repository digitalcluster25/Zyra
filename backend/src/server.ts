import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { testConnection } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

const app: Express = express();

// ==================== Middleware ====================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== Routes ====================

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ZYRA API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
import authRoutes from './routes/auth';
import checkinRoutes from './routes/checkins';
import factorRoutes from './routes/factors';
import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/factors', factorRoutes);
app.use('/api/admin', adminRoutes);

// ==================== Error Handling ====================

app.use(notFound);
app.use(errorHandler);

// ==================== Server Start ====================

const PORT = env.PORT || 3001;

async function startServer() {
  try {
    // Проверка подключения к БД
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 ZYRA Backend API                                ║
║                                                       ║
║   Environment: ${env.NODE_ENV.padEnd(40)}║
║   Port: ${PORT.toString().padEnd(45)}║
║   Database: Connected ✅                              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing server');
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing server');
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Запуск только если файл запущен напрямую
if (require.main === module) {
  startServer();
}

export default app;


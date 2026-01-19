import { app } from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { logger } from './config/logger';
import { startFollowupScheduler } from './modules/followups/followups.scheduler';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Database connected successfully');
    
    // Start followup scheduler
    startFollowupScheduler();
    logger.info('Followup scheduler started');
    
    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`API Base URL: ${env.BASE_URL}`);
    });
    
    // Handle server errors
    server.on('error', (error: Error) => {
      logger.error('Server error:', error);
      process.exit(1);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

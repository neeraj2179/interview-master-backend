import app from './app';
import { config } from './config';
import { prisma } from './prisma';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('📦 Prisma connected to database');

    app.listen(config.port, () => {
      console.log(`🚀 Interview Master Express API running on http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

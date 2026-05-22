import http from 'http';
import dotenv from 'dotenv';
import { app } from './app';
import { initSocket } from './utils/socket';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Start server after connecting to databases
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

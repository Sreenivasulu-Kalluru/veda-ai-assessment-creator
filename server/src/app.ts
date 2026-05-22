import express from 'express';
import cors from 'cors';
import assignmentRoutes from './routes/assignmentRoutes';

export const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Routes
app.use('/api/assignments', assignmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

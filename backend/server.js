import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import matchRoutes from './routes/matchRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', matchRoutes);
app.use('/api', calendarRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

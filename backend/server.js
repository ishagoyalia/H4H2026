require('dotenv').config();
const express = require('express');
const cors = require('cors');
const matchRoutes = require('./routes/matchRoutes');
const calendarRoutes = require('../backend/routes/calendarRoutes');

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

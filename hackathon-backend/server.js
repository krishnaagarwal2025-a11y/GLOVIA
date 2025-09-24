require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();

// Basic security
app.use(helmet());

// CORS: allow your frontend origin in production, for dev allow localhost:3000 (change if needed)
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], 
  credentials: true
}));


// JSON parsing
app.use(express.json());
app.use(cookieParser());

// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Simple root route
app.get('/', (req, res) => res.send('Hackathon backend is running'));

// Connect to MongoDB
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

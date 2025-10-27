const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration - for dev and for prod
app.use(cors({
   origin: [
      'shophub-ecomm.netlify.app' // your deployed frontend
   ],
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, 'client', 'dist')));
   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
   });
}

// Test route
app.get('/api', (req, res) => {
   res.json({
      message: 'ShopHub API is running...',
      status: 'active'
   });
});

// Error handling
app.use((err, req, res, next) => {
   console.error('Error:', err.stack);
   res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
   });
});

// Main port logic for Render or local
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});

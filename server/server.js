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

const allowedOrigins = [
   'http://localhost:5173',
   'http://localhost:3000',
   'http://127.0.0.1:5173',
   'https://shophub-e-com.netlify.app'
];

app.use(cors({
   origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
         callback(null, true);
      } else {
         callback(new Error('Not allowed by CORS'));
      }
   },
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   optionsSuccessStatus: 200
}));


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Test route
app.get('/api', (req, res) => {
   res.json({
      message: 'ShopHub API is running...',
      status: 'active'
   });
});

// Serve static files from frontend (Vite/React build) in production
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, 'client', 'dist')));
   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
   });
}

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
   console.log(`📍 API URL: http://localhost:${PORT}`);
});

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

connectDB(); // Connect to MongoDB

const app = express(); // Route Loader


// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/profile_uploads', express.static(path.join(__dirname, 'public/profile_uploads')));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.cartCount = 0; 
  next();
})

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/cartRoutes'));
app.use('/', require('./routes/checkoutRoutes'));
app.use('/', require('./routes/orderRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Unmatched Routes error(404)
app.use((req, res, next) => {
  res.status(404).render('user/error', {
    user: res.locals.user,
    cartCount: res.locals.cartCount,
    message: 'Page not found'
  });
});

// Server errors(500)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).render('user/error', {
    user: res.locals.user,
    cartCount: res.locals.cartCount,
    message: 'Internal Server Error'
  });
});

module.exports = app;
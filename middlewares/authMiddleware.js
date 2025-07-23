const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');

exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token from cookie:', token);

  if(!token) return res.redirect('/login?message=login_required');

  try {
    console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT Payload:', decoded);

    if (!decoded.id) {
      console.error('❌ decoded.id is missing!');
      return res.redirect('/login?message=login_required');
    }

    const user = await User.findById(decoded.id);
    console.log('User fetched from DB:', user);
    
    if (!user) {
      return res.redirect('/login?message=login_required');
    }

    req.user = user;
    res.locals.user = user;

    const cart = await Cart.findOne({userId: req.user._id});
    req.cartCount = cart ? cart.items.length : 0;
    res.locals.cartCount = req.cartCount;

    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.clearCookie('token');
    return res.redirect('/login?message=login_required');
  }
};

exports.requireAdmin = (req, res, next) => {
  if(req.user?.role !== 'admin') {
    return res.status(403).send('Access denied');
  }
  next();
};
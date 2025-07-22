const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getLogin = (req, res) => res.render('auth/login', {user: null, cartCount: 0, error: null, success: null, siteKey: process.env.RECAPTCHA_SITE_KEY});
exports.getSignup = (req, res) => res.render('auth/signup', {user: null, cartCount: 0, error: null, success: null, query: req.query});
exports.getForgotPassword = (req, res) => res.render('auth/forgotPassword', {user: null, cartCount: 0, error: null, message: null, query: req.query});

exports.postLogin = async (req, res) => {
  const { email, password, 'g-recaptcha-response': captcha} = req.body;

  console.log("📩 Full req.body:", req.body);

   if (!email || !password) {
    return res.render('auth/login', {
      error: 'Please provide both email and password.',
      success: null,
      user: null,
      cartCount: 0,
      siteKey: process.env.RECAPTCHA_SITE_KEY
    });
  }

   if (!captcha) {
    return res.render('auth/login', { 
      error: 'Please complete the CAPTCHA.', 
      success: null,
      user: null,
      cartCount: 0,
      siteKey: process.env.RECAPTCHA_SITE_KEY 
    });
  }


  try {
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`;
    const response = await axios.post(verifyURL);

     if (!response.data.success) {
      return res.render('auth/login', { 
        user: null,
        cartCount: 0,
        error: 'CAPTCHA verification failed.', 
        success: null,
        siteKey: process.env.RECAPTCHA_SITE_KEY 
      });
    }

    const user = await User.findOne({
      email: new RegExp(`^${email.trim()}$`, 'i')
    });

       if (!user) {
        return res.render('auth/login', {
          user: null,
          cartCount: 0,
          error: 'User not found.',
          success: null,
          siteKey: process.env.RECAPTCHA_SITE_KEY
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('auth/login', {
        user: null,
        cartCount: 0,
        error: 'Incorrect password.',
        success: null,
        siteKey: process.env.RECAPTCHA_SITE_KEY
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 86400000 // 1 day
    });

    return res.redirect('/');

  } catch (err) {
    console.error('Login error:', err);
    return res.render('auth/login', {
      user: null,
      cartCount: 0,
      error: 'Something went wrong.',
      success: null,
      siteKey: process.env.RECAPTCHA_SITE_KEY
    });
  }
};

exports.postSignup = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const imagePath = req.file ? '/profile_uploads/' + req.file.filename : '';

    const user = new User({
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user', 
      image: imagePath
    });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/signup?message=signup_failed');
  }
  
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.render('auth/logout', {user: null, cartCount: 0});
  res.redirect('/login?message=logged_out');
};

exports.postForgotPassword = (req, res) => {
  res.send('Password reset link sent (simulation)');
};
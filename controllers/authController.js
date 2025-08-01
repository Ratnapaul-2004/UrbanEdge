const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

exports.getLogin = (req, res) => res.render('auth/login', {
  user: null, 
  cartCount: 0, 
  error: null, 
  success:  req.query.success === 'account_created' ? '✅ Account created successfully. Please login.' : null, 
  siteKey: process.env.RECAPTCHA_SITE_KEY
});

exports.getSignup = (req, res) => {
  const user = req.user || null;
  const cartCount = (req.session && req.session.cartCount) || 0;

  res.render('auth/signup', {
    user,
    cartCount,
    query: req.query || {},
    error: null,
    success: null 
  });
};

exports.getForgotPassword = (req, res) => res.render('auth/forgotPassword', {
  user: null, 
  cartCount: 0, 
  error: null, 
  message: null, 
  query: req.query
});

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

    console.log("Trying to find user with email:", req.body.email);
    const user = await User.findOne({ email});

    console.log('🧠 User found:', user);

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: false
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
    const { name, email, password, confirmPassword } = req.body;

    // ✅ Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.render('auth/signup', {
        user: null,
        cartCount: 0,
        error: '❌ All fields are required.',
        success: null,
        query: {}
      });
    }

    if (password !== confirmPassword) {
      return res.render('auth/signup', {
        user: null,
        cartCount: 0,
        error: '❌ Passwords do not match.',
        success: null,
        query: {}
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/signup', {
        user: null,
        cartCount: 0,
        error: '❌ Email is already registered.',
        success: null,
        query: {}
      });
    }

    // ✅ Handle profile image
    const profileImage = req.file ? req.file.filename : 'default.png'; // fallback image

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: profileImage
    });

    await newUser.save();

    // ✅ Create JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Redirect or render success
    res.redirect('/login'); 
    
  } catch (err) {
    console.error('Signup Error:', err);
    res.render('auth/signup', {
      user: null,
      cartCount: 0,
      error: '❌ Server error. Please try again later.',
      success: null,
      query: {}
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login?message=logged_out');
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/forgot-password', {
        error: '❌ No user found with that email',
        user: null,
        cartCount: 0,
      });
    }

    const newPassword = Math.random().toString(36).slice(-8); // random password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"UrbanEdge Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your UrbanEdge Password has been Reset',
      html: `
        <h3>Hi ${user.name},</h3>
        <p>Your new password is: <strong>${newPassword}</strong></p>
        <p>Please login using this password and change it after logging in.</p>
        <br>
        <p>Thank you,<br>The UrbanEdge Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.render('auth/login', {
      success: '✅ New password sent to your email',
      error: null,
      user: null,
      cartCount: 0,
      siteKey: process.env.RECAPTCHA_SITE_KEY
    });

  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.render('auth/forgot-password', {
      error: '⚠️ Something went wrong. Please try again.',
      user: null,
      cartCount: 0
    });
  }
};


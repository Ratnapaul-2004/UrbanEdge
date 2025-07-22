const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

exports.getLogin = (req, res) => res.render('auth/login', {user: null, cartCount: 0, error: null, success:  req.query.success === 'account_created' ? '✅ Account created successfully. Please login.' : null, siteKey: process.env.RECAPTCHA_SITE_KEY});

exports.getSignup = (req, res) => {
  const user = req.user || null;
  const cartCount = req.session.cartCount || 0;

  res.render('auth/signup', {
    user,
    cartCount,
    query: req.query 
  });
};

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
      console.log('❌ CAPTCHA Error:', response.data);
      return res.render('auth/login', { 
        user: null,
        cartCount: 0,
        error: 'CAPTCHA verification failed.', 
        success: null,
        siteKey: process.env.RECAPTCHA_SITE_KEY 
      });
    }

    console.log('🔍 Trying to login with:', email);
    // const user = await User.findOne({
    //   email: new RegExp(`^${email.trim()}$`, 'i')
    // });
    console.log("Trying to find user with email:", req.body.email);
    const user = await User.findOne({ email: req.body.email });

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
      maxAge: 86400000
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

    const cartCount = req.session.cartCount || 0;
     const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('auth/signup', { error: 'User already exists', success: null, cartCount, query: req.query});
      }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imagePath = req.file ? '/profile_uploads/' + req.file.filename : '';

    const user = new User({
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user', 
      image: imagePath
    });

    console.log('👉 Signup attempt:', { name, email });
    await user.save();
    console.log('✅ User saved:', user);
    // return res.render('auth/login', { success: "✅ Signup successful! Please login.", error: null });
    res.redirect('/login?success=account_created');
  } catch (err) {
    console.error(err);
    return res.render('auth/signup', { error: "❌ Something went wrong during signup", success: null });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  // res.render('auth/logout', {user: null, cartCount: 0});
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


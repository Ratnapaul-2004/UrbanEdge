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

exports.getResetPassword = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.redirect('/forgot-password?error=invalid_token');
    }

    res.render('auth/reset-password', { token }); // create this view
  } catch (err) {
    console.error('Reset link error:', err);
    res.status(500).send("Something went wrong");
  }
};

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
      return res.redirect('/forgot-password?error=user_not_found');
    }

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // use app-specific password
      }
    });

    const mailOptions = {
      to: user.email,
      from: 'your-email@gmail.com',
      subject: 'Password Reset - UrbanEdge',
      html: `<p>You requested a password reset. Click <a href="https://urbanedge-backend-5cu3.onrender.com/reset-password/${token}">here</a> to reset your password.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.redirect('/forgot-password?message=email_sent');
  } catch (err) {
    console.error('Error in forgot password:', err);
    res.status(500).send("Error processing request");
  }
};

exports.postResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.redirect('/forgot-password?error=expired_token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.redirect('/login?message=password_reset_success');
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).send("Error resetting password");
  }
};
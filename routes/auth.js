const express = require('express');
const { User, db } = require('../models/Database');
const router = express.Router();

// Register page
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Register POST
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, subject } = req.body;

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.render('register', { error: 'Email already registered' });
    }

    // Create new user using Database class
    const newUserData = { name, email, password, role };
    if (role === 'teacher' && subject) {
      newUserData.subject = subject;
    }

    const user = await db.createUser(newUserData);

    // Set session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    // Redirect based on role
    if (role === 'student') {
      res.redirect('/student/dashboard');
    } else {
      res.redirect('/teacher/dashboard');
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await db.validatePassword(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    // Redirect based on role
    if (user.role === 'student') {
      res.redirect('/student/dashboard');
    } else {
      res.redirect('/teacher/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Login failed. Please try again.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;

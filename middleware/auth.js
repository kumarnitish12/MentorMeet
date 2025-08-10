const { User } = require('../models/Database');

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

// Check if user is a student
const requireStudent = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'student') {
    return res.redirect('/auth/login');
  }
  next();
};

// Check if user is a teacher
const requireTeacher = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'teacher') {
    return res.redirect('/auth/login');
  }
  next();
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      req.user = user;
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  next();
};

module.exports = {
  requireAuth,
  requireStudent,
  requireTeacher,
  getCurrentUser
};
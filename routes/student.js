const express = require('express');
const { User, Appointment } = require('../models/Database');
const { requireStudent, getCurrentUser } = require('../middleware/auth');

const router = express.Router();

// Apply middleware to all routes
router.use(requireStudent);
router.use(getCurrentUser);

// Student dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Get all teachers
    const teachers = await User.find({ role: 'teacher' }).select('name subject');
    
    // Get student's appointments
    const appointments = await Appointment.find({ studentId: req.session.userId })
      .populate('teacherId', 'name subject')
      .sort({ createdAt: -1 });
    
    res.render('student-dashboard', { 
      user: req.user, 
      teachers, 
      appointments 
    });
  } catch (error) {
    console.error('Error loading student dashboard:', error);
    res.status(500).send('Server error');
  }
});

// Book appointment
router.post('/book-appointment', async (req, res) => {
  try {
    const { teacherId, date, time, note } = req.body;
    
    // Create new appointment
    const appointment = new Appointment({
      studentId: req.session.userId,
      teacherId,
      date: new Date(date),
      time,
      note
    });
    
    await appointment.save();
    
    // Populate teacher info for socket emission
    await appointment.populate('studentId', 'name email');
    await appointment.populate('teacherId', 'name subject');
    
    // Emit real-time notification to teacher
    req.io.to(`teacher-${teacherId}`).emit('new-appointment-request', {
      appointment: appointment,
      student: appointment.studentId
    });
    
    res.redirect('/student/dashboard');
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
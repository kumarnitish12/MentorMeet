const express = require('express');
const { Appointment } = require('../models/Database');
const { requireTeacher, getCurrentUser } = require('../middleware/auth');

const router = express.Router();

// Apply middleware to all routes
router.use(requireTeacher);
router.use(getCurrentUser);

// Teacher dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Get teacher's appointments
    const appointments = await Appointment.find({ teacherId: req.session.userId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    
    res.render('teacher-dashboard', { 
      user: req.user, 
      appointments 
    });
  } catch (error) {
    console.error('Error loading teacher dashboard:', error);
    res.status(500).send('Server error');
  }
});

// Update appointment status
router.put('/appointment/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, teacherId: req.session.userId },
      { status },
      { new: true }
    ).populate('studentId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Emit status update to student (if connected)
    req.io.to(`student-${appointment.studentId._id}`).emit('appointment-status-update', {
      appointmentId: appointment._id,
      status: appointment.status
    });
    
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
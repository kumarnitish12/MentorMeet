// models/Database.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  created_at: { type: Date, default: Date.now }
});

// Appointment schema
const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  note: String,
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Database class
class Database {
  async createUser({ name, email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ name, email, password: hashedPassword, role });
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async getAllTeachers() {
    return await User.find({ role: 'teacher' }, 'name email');
  }

  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async createAppointment({ studentId, teacherId, date, time, note }) {
    return await Appointment.create({ studentId, teacherId, date, time, note });
  }

  async getAppointmentsByStudent(studentId) {
    return await Appointment.find({ studentId }).populate('teacherId', 'name').sort({ created_at: -1 });
  }

  async getAppointmentsByTeacher(teacherId) {
    return await Appointment.find({ teacherId }).populate('studentId', 'name').sort({ created_at: -1 });
  }

  async updateAppointmentStatus(appointmentId, status) {
    const res = await Appointment.updateOne({ _id: appointmentId }, { status });
    return res.modifiedCount > 0;
  }

  async getAppointmentById(appointmentId) {
    return await Appointment.findById(appointmentId)
      .populate('studentId', 'name email')
      .populate('teacherId', 'name email');
  }
}

module.exports = {
  db: new Database(),
  User,
  Appointment
};


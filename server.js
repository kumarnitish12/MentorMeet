const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();

// ✅ Connect to MongoDB
require('./models/Database'); // This will run mongoose.connect()

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.session.userId) {
    if (req.session.userRole === 'student') {
      return res.redirect('/student/dashboard');
    } else if (req.session.userRole === 'teacher') {
      return res.redirect('/teacher/dashboard');
    }
  }
  res.render('home');
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-teacher-room', (teacherId) => {
    socket.join(`teacher-${teacherId}`);
    console.log(`Teacher ${teacherId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

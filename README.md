# Mentor Meet 📚

Mentor Meet is a platform that connects **students and teachers/mentors** in real time.  
Students can request mentorship sessions, and teachers can accept or decline appointments — making the process smooth and interactive.  

---

## ✨ Features

- 👩‍🎓 **Students**
  - Send appointment requests to teachers/mentors  
  - View status of their requests (pending, accepted, declined)  
  - Connect with mentors directly on the platform  

- 👨‍🏫 **Teachers/Mentors**
  - Receive new appointment requests in real time  
  - Accept or decline student requests  
  - Manage their scheduled sessions  

- 🔔 **Real-Time Updates**
  - Instant status updates on request acceptance or decline  

---

## 🛠️ Tech Stack

- **Frontend Templating:** EJS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (with Mongoose)  
- **Deployment:** Vercel  
- **Other Tools:** Bolt AI (for scaffolding), JavaScript, CSS  

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mentor-meet.git
cd mentor-meet

2. Install Dependencies
npm install

3. Setup Environment Variables

Create a .env file and configure:

MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=your-secret-key
PORT=3000

4. Run Locally
npm start


Visit: http://localhost:3000

📊 Data Flow

Users: Students and Teachers stored in MongoDB with role-based auth

Appointments: Contains student → teacher mapping with status (pending, accepted, declined)

Messages (optional): Students & teachers can exchange messages


🤝 Contributing

Contributions are welcome!

Fork the repo

Create a branch (git checkout -b feature/awesome-feature)

Commit changes

Push and open a Pull Request


📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Nitish Kumar

GitHub: kumarnitish12

✨ Mentorship made easy for students & teachers with real-time appointment management.

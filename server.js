import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Enhanced CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? false 
      : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? false 
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// API route for health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Enhanced in-memory store for poll data
let pollState = {
  currentQuestion: null,
  options: [],
  isActive: false,
  timer: null,
  students: new Map(),
  answers: new Map(),
  results: {},
  teacherConnected: false
};

// Utility functions
const calculateResults = () => {
  const results = {};
  if (pollState.options && pollState.options.length > 0) {
    pollState.options.forEach((_, index) => {
      results[index] = 0;
    });
  }
  
  pollState.answers.forEach((answer) => {
    if (results[answer] !== undefined) {
      results[answer]++;
    }
  });
  
  return results;
};

const broadcastResults = () => {
  pollState.results = calculateResults();
  io.emit('resultsUpdate', {
    results: pollState.results,
    totalStudents: pollState.students.size,
    answered: pollState.answers.size,
    question: pollState.currentQuestion,
    options: pollState.options,
    isActive: pollState.isActive
  });
};

const startTimer = () => {
  if (pollState.timer) {
    clearTimeout(pollState.timer);
  }
  
  pollState.timer = setTimeout(() => {
    pollState.isActive = false;
    broadcastResults();
    io.emit('timerExpired');
  }, 60000);
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current state to newly connected client
  socket.emit('stateUpdate', {
    currentQuestion: pollState.currentQuestion,
    options: pollState.options,
    isActive: pollState.isActive,
    results: pollState.results,
    totalStudents: pollState.students.size,
    answered: pollState.answers.size
  });

  // Handle teacher connection
  socket.on('teacherConnected', () => {
    console.log('Teacher connected:', socket.id);
    pollState.teacherConnected = true;
    socket.emit('teacherStatus', { connected: true });
  });

  // Student registration
  socket.on('registerStudent', (studentData) => {
    console.log('Registering student:', studentData);
    
    if (!studentData.name || studentData.name.trim() === '') {
      socket.emit('registrationError', 'Please enter a valid name');
      return;
    }
    
    // Check if name is already taken
    let nameExists = false;
    pollState.students.forEach((student) => {
      if (student.name.toLowerCase() === studentData.name.toLowerCase().trim()) {
        nameExists = true;
      }
    });
    
    if (nameExists) {
      socket.emit('registrationError', 'Name already taken. Please choose another.');
      return;
    }
    
    pollState.students.set(socket.id, {
      id: socket.id,
      name: studentData.name.trim(),
      joinedAt: new Date()
    });
    
    console.log('Student registered successfully:', studentData.name);
    socket.emit('registrationSuccess', { 
      name: studentData.name.trim(),
      totalStudents: pollState.students.size
    });
    
    // Notify all clients about new student
    io.emit('studentJoined', { 
      name: studentData.name.trim(),
      totalStudents: pollState.students.size 
    });
    
    // Broadcast updated results
    broadcastResults();
  });

  // Teacher creates new poll
  socket.on('createPoll', (pollData) => {
    console.log('Creating new poll:', pollData);
    
    if (!pollData.question || !pollData.options) {
      socket.emit('pollError', 'Invalid poll data');
      return;
    }
    
    // Reset previous poll
    pollState.answers.clear();
    pollState.results = {};
    
    pollState.currentQuestion = pollData.question;
    pollState.options = pollData.options;
    pollState.isActive = true;

    // Start the timer
    startTimer();

    // Broadcast new poll to all clients
    io.emit('newQuestion', {
      question: pollData.question,
      options: pollData.options,
      isActive: true
    });

    console.log('Poll created and broadcasted to all clients');
    broadcastResults();
  });

  // Student submits answer
  socket.on('submitAnswer', (answerData) => {
    console.log('Student submitting answer:', answerData);
    
    if (!pollState.isActive) {
      socket.emit('answerError', 'No active poll available');
      return;
    }

    const student = pollState.students.get(socket.id);
    if (!student) {
      socket.emit('answerError', 'Please register first');
      return;
    }

    if (pollState.answers.has(socket.id)) {
      socket.emit('answerError', 'You have already voted in this poll');
      return;
    }

    if (answerData.answerIndex === undefined || answerData.answerIndex < 0) {
      socket.emit('answerError', 'Invalid answer selection');
      return;
    }

    pollState.answers.set(socket.id, answerData.answerIndex);
    socket.emit('answerSuccess', { answerIndex: answerData.answerIndex });

    console.log(`Answer recorded for ${student.name}:`, answerData.answerIndex);
    broadcastResults();

    // Check if all students have answered
    if (pollState.answers.size === pollState.students.size && pollState.students.size > 0) {
      pollState.isActive = false;
      clearTimeout(pollState.timer);
      io.emit('allAnswered');
      console.log('All students have answered the poll');
    }
  });

  // Request current results
  socket.on('getResults', () => {
    broadcastResults();
  });

  // End current poll manually
  socket.on('endPoll', () => {
    pollState.isActive = false;
    if (pollState.timer) {
      clearTimeout(pollState.timer);
    }
    broadcastResults();
    io.emit('pollEnded');
    console.log('Poll ended manually by teacher');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove student if they were registered
    if (pollState.students.has(socket.id)) {
      const student = pollState.students.get(socket.id);
      pollState.students.delete(socket.id);
      pollState.answers.delete(socket.id);
      
      console.log(`Student ${student.name} left the session`);
      io.emit('studentLeft', {
        name: student.name,
        totalStudents: pollState.students.size
      });
      broadcastResults();
    }
    
    // Check if teacher disconnected
    if (pollState.teacherConnected) {
      pollState.teacherConnected = false;
      console.log('Teacher disconnected');
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Application URL: http://localhost:${PORT}`);
  console.log(`📍 API Health Check: http://localhost:${PORT}/api/health`);
});
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Poll state management
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

// Socket.io event handlers
io.on('connection', (socket) => {
    console.log(' User connected:', socket.id);

    // Send current state to newly connected client
    socket.emit('stateUpdate', {
        currentQuestion: pollState.currentQuestion,
        options: pollState.options,
        isActive: pollState.isActive,
        results: pollState.results,
        totalStudents: pollState.students.size,
        answered: pollState.answers.size
    });

    // Teacher connection
    socket.on('teacherConnected', () => {
        console.log(' Teacher connected:', socket.id);
        pollState.teacherConnected = true;
        socket.emit('teacherStatus', { connected: true });
    });

    // Student registration
    socket.on('registerStudent', (studentData) => {
        console.log(' Registering student:', studentData);
        
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
        
        socket.emit('registrationSuccess', { 
            name: studentData.name.trim(),
            totalStudents: pollState.students.size
        });
        
        io.emit('studentJoined', { 
            name: studentData.name.trim(),
            totalStudents: pollState.students.size 
        });
        
        broadcastResults();
    });

    // Create new poll
    socket.on('createPoll', (pollData) => {
        console.log(' Creating new poll:', pollData);
        
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

        startTimer();

        io.emit('newQuestion', {
            question: pollData.question,
            options: pollData.options,
            isActive: true
        });

        broadcastResults();
    });

    // Student submits answer
    socket.on('submitAnswer', (answerData) => {
        console.log(' Student submitting answer:', answerData);
        
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

        pollState.answers.set(socket.id, answerData.answerIndex);
        socket.emit('answerSuccess', { answerIndex: answerData.answerIndex });

        broadcastResults();

        // Check if all students have answered
        if (pollState.answers.size === pollState.students.size && pollState.students.size > 0) {
            pollState.isActive = false;
            clearTimeout(pollState.timer);
            io.emit('allAnswered');
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
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(' User disconnected:', socket.id);
        
        if (pollState.students.has(socket.id)) {
            const student = pollState.students.get(socket.id);
            pollState.students.delete(socket.id);
            pollState.answers.delete(socket.id);
            
            io.emit('studentLeft', {
                name: student.name,
                totalStudents: pollState.students.size
            });
            broadcastResults();
        }
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
});
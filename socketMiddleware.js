import io from 'socket.io-client'
import {
  setPollData,
  setResults,
  setAnswered,
  setConnectionStatus,
  setRegistered,
  setStudentName
} from './pollSlice'

let socket = null

// Helper function to get backend URL
const getBackendUrl = () => {
  // In development, use explicit localhost:5000
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  // In production, use same origin
  return window.location.origin;
};

const socketMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action
  const { dispatch, getState } = store

  switch (type) {
    case 'socket/connect':
      if (!socket) {
        console.log('🔄 Attempting to connect to server...');
        
        const backendUrl = getBackendUrl();
        console.log('Backend URL:', backendUrl);
        
        try {
          socket = io(backendUrl, {
            transports: ['websocket', 'polling'],
            timeout: 5000,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            forceNew: true
          });

          // Connection events
          socket.on('connect', () => {
            console.log('✅ Successfully connected to server!');
            console.log('Socket ID:', socket.id);
            dispatch(setConnectionStatus('connected'));
          });

          socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from server:', reason);
            dispatch(setConnectionStatus('disconnected'));
          });

          socket.on('connect_error', (error) => {
            console.error('🔥 Connection error:', error);
            dispatch(setConnectionStatus('error'));
            
            // Try to reconnect after delay
            setTimeout(() => {
              if (socket && !socket.connected) {
                console.log('🔄 Attempting to reconnect...');
                socket.connect();
              }
            }, 3000);
          });

          socket.on('welcome', (data) => {
            console.log('👋 Server welcome:', data);
          });

          // Polling events
          socket.on('newQuestion', (data) => {
            console.log('📝 New question received');
            dispatch(setPollData(data));
            dispatch(setAnswered(false));
          });

          socket.on('resultsUpdate', (data) => {
            console.log('📊 Results update received');
            dispatch(setResults(data));
          });

          socket.on('answerSuccess', () => {
            console.log('✅ Answer submitted successfully');
            dispatch(setAnswered(true));
          });

          socket.on('registrationSuccess', (data) => {
            console.log('✅ Registration successful');
            dispatch(setRegistered(true));
            dispatch(setStudentName(data.name));
          });

          // Error handlers
          socket.on('registrationError', (error) => {
            console.error('❌ Registration error:', error);
            alert(`Registration Error: ${error}`);
          });

          socket.on('test-response', (data) => {
            console.log('🧪 Test response:', data);
          });

        } catch (error) {
          console.error('💥 Error setting up socket:', error);
          dispatch(setConnectionStatus('error'));
        }
      } else if (!socket.connected) {
        // If socket exists but not connected, try to connect
        socket.connect();
      }
      break;

    case 'socket/test':
      if (socket && socket.connected) {
        socket.emit('test', { message: 'Hello from client!' });
      }
      break;

    case 'socket/registerStudent':
      if (socket && socket.connected) {
        socket.emit('registerStudent', { name: payload });
      } else {
        console.error('❌ Cannot register: Socket not connected');
        alert('Not connected to server. Please wait for connection.');
      }
      break;

    case 'socket/createPoll':
      if (socket && socket.connected) {
        socket.emit('createPoll', payload);
      } else {
        alert('Not connected to server. Please check connection.');
      }
      break;

    case 'socket/submitAnswer':
      if (socket && socket.connected) {
        socket.emit('submitAnswer', payload);
      }
      break;

    case 'socket/endPoll':
      if (socket && socket.connected) {
        socket.emit('endPoll');
      }
      break;

    case 'socket/getResults':
      if (socket && socket.connected) {
        socket.emit('getResults');
      }
      break;

    case 'socket/reconnect':
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      setTimeout(() => {
        dispatch({ type: 'socket/connect' });
      }, 1000);
      break;

    case 'socket/disconnect':
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      dispatch(setConnectionStatus('disconnected'));
      break;

    default:
      break;
  }

  return next(action);
};

export default socketMiddleware;
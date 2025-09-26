import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PersonaSelection from './Components/PersonaSelection'
import StudentView from './Components/StudentView'
import TeacherView from './Components/TeacherView'
import HealthCheck from './Components/HealthCheck'
import { setConnectionStatus } from './store/pollSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { userRole, connectionStatus } = useSelector((state) => state.poll)
  const [health, setHealth] = useState(null)

  useEffect(() => {
    // Test backend connection first
    testBackendConnection();
    
    // Then connect socket
    dispatch({ type: 'socket/connect' });

    return () => {
      dispatch({ type: 'socket/disconnect' });
    }
  }, [dispatch]);

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      setHealth(data);
      console.log('✅ Backend health check:', data);
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      setHealth({ status: 'ERROR', message: error.message });
    }
  };

  const handleTestSocket = () => {
    dispatch({ type: 'socket/test' });
  };

  const handleReconnect = () => {
    dispatch({ type: 'socket/reconnect' });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4CAF50';
      case 'error': return '#f44336';
      default: return '#ff9800';
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Real-Time Polling App</h1>
        <div className="header-info">
          <div className="connection-status" style={{ color: getStatusColor() }}>
            ● {connectionStatus.toUpperCase()} 
            <button onClick={handleTestSocket} className="test-btn">Test Socket</button>
            <button onClick={handleReconnect} className="reconnect-btn">Reconnect</button>
          </div>
          <HealthCheck />
        </div>
      </header>
      
      <main className="main-content">
        {!userRole ? (
          <PersonaSelection />
        ) : userRole === 'student' ? (
          <StudentView />
        ) : (
          <TeacherView />
        )}
      </main>

      {/* Debug info */}
      <div className="debug-info">
        <details>
          <summary>Debug Information</summary>
          <pre>
            Connection Status: {connectionStatus}
            {health && `\nHealth: ${JSON.stringify(health, null, 2)}`}
          </pre>
        </details>
      </div>
    </div>
  )
}

export default App
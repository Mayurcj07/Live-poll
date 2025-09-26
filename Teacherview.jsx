import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import QuestionCreation from './QuestionCreation'
import LiveResults from './LiveResults'
import PollingControl from './PollingControl'
import './TeacherView.css'

const TeacherView = () => {
  const dispatch = useDispatch()
  const { currentQuestion, isActive, totalStudents, answered, connectionStatus } = useSelector((state) => state.poll)
  const [showCreation, setShowCreation] = useState(false)

  useEffect(() => {
    // Notify server that teacher is connected when socket is ready
    if (connectionStatus === 'connected') {
      console.log('👨‍🏫 Teacher view: Socket connected, notifying server...')
      dispatch({ type: 'socket/teacherConnected' })
    }
  }, [connectionStatus, dispatch])

  const handleReconnect = () => {
    console.log('🔄 Manual reconnect triggered')
    dispatch({ type: 'socket/reconnect' })
  }

  const handleTestConnection = () => {
    console.log('🧪 Testing connection...')
    console.log('Current connection status:', connectionStatus)
    dispatch({ type: 'socket/getResults' })
  }

  return (
    <div className="teacher-view">
      <div className="teacher-header">
        <div className="teacher-title">
          <h2>👨‍🏫 Teacher Dashboard</h2>
          <div className={`connection-status ${connectionStatus}`}>
            ● {connectionStatus.toUpperCase()}
          </div>
        </div>
        
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-number">{totalStudents}</span>
            <span className="stat-label">Total Students</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{answered}</span>
            <span className="stat-label">Answered</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{totalStudents - answered}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {connectionStatus !== 'connected' && (
        <div className="connection-alert error">
          <div className="alert-content">
            <div className="alert-message">
              <span>⚠️ Not connected to server. Please check:</span>
              <ul>
                <li>Backend server is running on port 5000</li>
                <li>No firewall blocking the connection</li>
                <li>Backend URL is correct: http://localhost:5000</li>
              </ul>
            </div>
            <div className="alert-actions">
              <button onClick={handleReconnect} className="reconnect-btn">
                🔄 Reconnect
              </button>
              <button onClick={handleTestConnection} className="test-btn">
                🧪 Test Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {connectionStatus === 'connected' && (
        <div className="connection-alert success">
          <div className="alert-content">
            <span>✅ Successfully connected to server!</span>
          </div>
        </div>
      )}

      <PollingControl 
        isActive={isActive}
        showCreation={showCreation}
        setShowCreation={setShowCreation}
        connectionStatus={connectionStatus}
      />

      {showCreation ? (
        <QuestionCreation onClose={() => setShowCreation(false)} />
      ) : (
        <LiveResults isTeacher={true} />
      )}
    </div>
  )
}

export default TeacherView
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setStudentName, setRegistered } from '../store/pollSlice'
import NameInput from './NameInput'
import AnswerSubmission from './AnswerSubmission'
import LiveResults from './LiveResults'
import './StudentView.css'

const StudentView = () => {
  const dispatch = useDispatch()
  const { isRegistered, studentName, currentQuestion, hasAnswered, connectionStatus } = useSelector((state) => state.poll)
  const [localName, setLocalName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (connectionStatus === 'connected' && isRegistered) {
      console.log('Student ready to participate')
    }
  }, [connectionStatus, isRegistered])

  const handleNameSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!localName.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (connectionStatus !== 'connected') {
      setError('Not connected to server. Please try again.')
      return
    }
    
    dispatch(setStudentName(localName.trim()))
    dispatch({ type: 'socket/registerStudent', payload: localName.trim() })
  }

  const handleReconnect = () => {
    dispatch({ type: 'socket/resetConnection' })
  }

  if (!isRegistered) {
    return (
      <NameInput
        name={localName}
        setName={setLocalName}
        onSubmit={handleNameSubmit}
        error={error}
        connectionStatus={connectionStatus}
        onReconnect={handleReconnect}
      />
    )
  }

  return (
    <div className="student-view">
      <div className="student-info">
        <div className="welcome-section">
          <div className="welcome-message">
            <h3>👋 Welcome, {studentName}!</h3>
            <span className={`status-badge ${connectionStatus}`}>
              {connectionStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
            </span>
          </div>
          
          {connectionStatus !== 'connected' && (
            <button onClick={handleReconnect} className="reconnect-btn-small">
              Reconnect
            </button>
          )}
        </div>
        
        {currentQuestion && (
          <div className="poll-status">
            {!hasAnswered ? (
              <span className="status-active">📝 Active Poll - Please vote!</span>
            ) : (
              <span className="status-voted">✅ You've voted! Waiting for results...</span>
            )}
          </div>
        )}
      </div>
      
      {connectionStatus === 'connected' ? (
        currentQuestion && !hasAnswered ? (
          <AnswerSubmission />
        ) : (
          <LiveResults />
        )
      ) : (
        <div className="connection-warning">
          <p>⚠️ Please reconnect to participate in polls</p>
        </div>
      )}
    </div>
  )
}

export default StudentView
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setStudentName, setRegistered } from '../store/PollSlice'
import NameInput from './NameInput'
import AnswerSubmission from './AnswerSubmission'
import LiveResults from './LiveResults'
import './StudentView.css'

const StudentView = () => {
  const dispatch = useDispatch()
  const { isRegistered, studentName, currentQuestion, hasAnswered, connectionStatus } = useSelector((state) => state.poll)
  const [localName, setLocalName] = useState('')

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (localName.trim()) {
      dispatch(setStudentName(localName.trim()))
      dispatch({ type: 'socket/registerStudent', payload: localName.trim() })
    }
  }

  if (!isRegistered) {
    return (
      <NameInput
        name={localName}
        setName={setLocalName}
        onSubmit={handleNameSubmit}
      />
    )
  }

  return (
    <div className="student-view">
      <div className="student-header">
        <h2>🎓 Student Dashboard</h2>
        <div className="student-info">
          <span className="student-name">Welcome, {studentName}!</span>
          <span className={`connection-status ${connectionStatus}`}>
            ● {connectionStatus}
          </span>
        </div>
      </div>

      {currentQuestion && !hasAnswered ? (
        <AnswerSubmission />
      ) : (
        <LiveResults />
      )}
    </div>
  )
}

export default StudentView
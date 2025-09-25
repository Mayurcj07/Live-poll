import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import QuestionCreation from './QuestionCreation'
import LiveResults from './LiveResults'
import PollingControl from './PollingControl'
import './TeacherView.css'

const TeacherView = () => {
  const dispatch = useDispatch()
  const { currentQuestion, isActive, totalStudents, answered, connectionStatus } = useSelector((state) => state.poll)
  const [showCreation, setShowCreation] = useState(false)

  return (
    <div className="teacher-view">
      <div className="teacher-header">
        <h2>👨‍🏫 Teacher Dashboard</h2>
        <div className="teacher-info">
          <div className={`connection-status ${connectionStatus}`}>
            ● {connectionStatus}
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">{totalStudents}</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat">
              <span className="stat-number">{answered}</span>
              <span className="stat-label">Answered</span>
            </div>
            <div className="stat">
              <span className="stat-number">{totalStudents - answered}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <PollingControl 
        isActive={isActive}
        showCreation={showCreation}
        setShowCreation={setShowCreation}
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
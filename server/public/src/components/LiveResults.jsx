import React from 'react'
import { useSelector } from 'react-redux'
import './LiveResults.css'

const LiveResults = ({ isTeacher = false }) => {
  const { results, options, currentQuestion, totalStudents, answered } = useSelector((state) => state.poll)

  const getPercentage = (count) => {
    return totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
  }

  if (!currentQuestion) {
    return (
      <div className="live-results">
        <div className="no-poll-card">
          <h3>📊 No Active Poll</h3>
          <p>{isTeacher ? 'Create a new poll to get started!' : 'Waiting for teacher to start a poll...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="live-results">
      <div className="results-card">
        <h3>{currentQuestion}</h3>
        
        {isTeacher && (
          <div className="teacher-stats">
            <div className="stat-item">
              <span>Total Students: </span>
              <strong>{totalStudents}</strong>
            </div>
            <div className="stat-item">
              <span>Answered: </span>
              <strong>{answered}</strong>
            </div>
            <div className="stat-item">
              <span>Pending: </span>
              <strong>{totalStudents - answered}</strong>
            </div>
          </div>
        )}

        <div className="results-list">
          {options.map((option, index) => {
            const voteCount = results[index] || 0
            const percentage = getPercentage(voteCount)
            
            return (
              <div key={index} className="result-item">
                <div className="option-info">
                  <span className="option-text">{option}</span>
                  <span className="vote-count">{voteCount} votes ({percentage}%)</span>
                </div>
                <div className="result-bar">
                  <div 
                    className="bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LiveResults
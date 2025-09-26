import React from 'react'
import { useSelector } from 'react-redux'

const LiveResults = ({ isTeacher = false }) => {
  const { results, options, currentQuestion, totalStudents, answered } = useSelector((state) => state.poll)

  const getPercentage = (count) => {
    return totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
  }

  return (
    <div className="live-results">
      <h3>{currentQuestion || 'No active poll'}</h3>
      
      {isTeacher && (
        <div className="teacher-stats">
          <p>Total Students: {totalStudents}</p>
          <p>Answered: {answered}</p>
          <p>Pending: {totalStudents - answered}</p>
        </div>
      )}

      <div className="results-container">
        {options.map((option, index) => (
          <div key={index} className="result-item">
            <div className="option-text">{option}</div>
            <div className="result-bar">
              <div 
                className="bar-fill"
                style={{ width: `${getPercentage(results[index] || 0)}%` }}
              ></div>
            </div>
            <div className="result-count">
              {results[index] || 0} votes ({getPercentage(results[index] || 0)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveResults
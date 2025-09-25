import React from 'react'
import { useDispatch } from 'react-redux'
import './PollingControl.css'

const PollingControl = ({ isActive, showCreation, setShowCreation }) => {
  const dispatch = useDispatch()

  const handleEndPoll = () => {
    dispatch({ type: 'socket/endPoll' })
  }

  const handleRefreshResults = () => {
    dispatch({ type: 'socket/getResults' })
  }

  return (
    <div className="polling-control">
      <div className="control-card">
        <div className="control-buttons">
          {!showCreation && (
            <button 
              onClick={() => setShowCreation(true)} 
              disabled={isActive}
              className="create-btn"
            >
              Create New Poll
            </button>
          )}
          
          {isActive && (
            <button onClick={handleEndPoll} className="end-btn">
              End Current Poll
            </button>
          )}
          
          <button onClick={handleRefreshResults} className="refresh-btn">
            Refresh Results
          </button>
        </div>
      </div>
    </div>
  )
}

export default PollingControl
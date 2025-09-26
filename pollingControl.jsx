import React from 'react'
import { useDispatch } from 'react-redux'

const PollingControl = ({ isActive, showCreation, setShowCreation }) => {
  const dispatch = useDispatch()

  const handleEndPoll = () => {
    dispatch({ type: 'socket/endPoll' })
  }

  const handleGetResults = () => {
    dispatch({ type: 'socket/getResults' })
  }

  return (
    <div className="polling-control">
      <div className="control-buttons">
        {!showCreation && (
          <button onClick={() => setShowCreation(true)} disabled={isActive}>
            Create New Poll
          </button>
        )}
        
        {isActive && (
          <button onClick={handleEndPoll}>
            End Poll
          </button>
        )}
        
        <button onClick={handleGetResults}>
          Refresh Results
        </button>
      </div>
    </div>
  )
}

export default PollingControl
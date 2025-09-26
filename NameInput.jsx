import React from 'react'
import './NameInput.css'

const NameInput = ({ name, setName, onSubmit, error }) => {
  return (
    <div className="name-input-container">
      <div className="name-input-card">
        <div className="name-input-header">
          <h2>🎓 Join as Student</h2>
          <p>Enter your name to join the classroom</p>
        </div>
        
        <form onSubmit={onSubmit} className="name-input-form">
          <div className="input-group">
            <label htmlFor="studentName">Your Name:</label>
            <input
              id="studentName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              required
              maxLength={20}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="join-button">
            🚀 Join Classroom
          </button>
        </form>
        
        <div className="name-input-tips">
          <p>💡 Tips:</p>
          <ul>
            <li>Use a unique name that identifies you</li>
            <li>You'll see active polls once joined</li>
            <li>Vote in real-time with your classmates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NameInput
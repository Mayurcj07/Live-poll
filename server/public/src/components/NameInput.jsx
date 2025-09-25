import React from 'react'
import './NameInput.css'

const NameInput = ({ name, setName, onSubmit }) => {
  return (
    <div className="name-input-container">
      <div className="name-input-card">
        <div className="name-input-header">
          <h2>Join as Student 🎓</h2>
          <p>Enter your name to join the classroom</p>
        </div>
        
        <form onSubmit={onSubmit} className="name-input-form">
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              required
              maxLength={20}
              autoFocus
            />
          </div>
          
          <button type="submit" className="join-button">
            Join Classroom
          </button>
        </form>
        
        <div className="name-input-tips">
          <p>💡 Tips for students:</p>
          <ul>
            <li>Use your real name or a nickname</li>
            <li>Make sure it's unique in the classroom</li>
            <li>You'll see active polls once joined</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NameInput
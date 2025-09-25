import React from 'react'
import { useDispatch } from 'react-redux'
import { setUserRole } from '../store/PollSlice'
import './PersonaSelection.css'

const PersonaSelection = () => {
  const dispatch = useDispatch()

  const handleRoleSelect = (role) => {
    dispatch(setUserRole(role))
  }

  return (
    <div className="persona-selection">
      <div className="selection-card">
        <h2>Welcome to Live Polling! 🎯</h2>
        <p>Choose your role to get started</p>
        
        <div className="role-buttons">
          <button 
            className="role-btn student-btn"
            onClick={() => handleRoleSelect('student')}
          >
            <div className="role-icon">🎓</div>
            <div className="role-content">
              <h3>I am a Student</h3>
              <p>Join polls and vote in real-time</p>
            </div>
          </button>
          
          <button 
            className="role-btn teacher-btn"
            onClick={() => handleRoleSelect('teacher')}
          >
            <div className="role-icon">👨‍🏫</div>
            <div className="role-content">
              <h3>I am a Teacher</h3>
              <p>Create polls and view live results</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonaSelection
import React from 'react'
import { useDispatch } from 'react-redux'
import { setUserRole } from '../store/pollSlice'
import './PersonaSelection.css'

const PersonaSelection = () => {
  const dispatch = useDispatch()

  const handleRoleSelect = (role) => {
    dispatch(setUserRole(role))
  }

  return (
    <div className="persona-selection">
      <div className="selection-container">
        <h2>Choose Your Role</h2>
        <div className="role-buttons">
          <button 
            className="role-btn student-btn"
            onClick={() => handleRoleSelect('student')}
          >
            I am a Student
          </button>
          <button 
            className="role-btn teacher-btn"
            onClick={() => handleRoleSelect('teacher')}
          >
            I am a Teacher
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonaSelection
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import './QuestionCreation.css'

const QuestionCreation = ({ onClose }) => {
  const dispatch = useDispatch()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const trimmedQuestion = question.trim()
    const trimmedOptions = options.map(opt => opt.trim()).filter(opt => opt !== '')
    
    if (!trimmedQuestion) {
      alert('Please enter a question')
      return
    }
    
    if (trimmedOptions.length < 2) {
      alert('Please enter at least 2 options')
      return
    }
    
    if (trimmedOptions.some(opt => !opt)) {
      alert('Please fill in all options')
      return
    }

    dispatch({
      type: 'socket/createPoll',
      payload: {
        question: trimmedQuestion,
        options: trimmedOptions
      }
    })
    onClose()
  }

  return (
    <div className="question-creation">
      <div className="creation-card">
        <h3>Create New Poll</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Poll Question:</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Options:</label>
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removeOption(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 6 && (
              <button type="button" onClick={addOption} className="add-btn">
                + Add Option
              </button>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Start Poll
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionCreation
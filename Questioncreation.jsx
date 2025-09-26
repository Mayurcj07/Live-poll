import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

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
    setOptions([...options, ''])
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (question.trim() && options.every(opt => opt.trim()) && options.length >= 2) {
      dispatch({
        type: 'socket/createPoll',
        payload: {
          question: question.trim(),
          options: options.map(opt => opt.trim())
        }
      })
      onClose()
    }
  }

  return (
    <div className="question-creation">
      <h3>Create New Poll</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question..."
            required
          />
        </div>

        <div className="form-group">
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption}>
            Add Option
          </button>
        </div>

        <div className="form-actions">
          <button type="submit">Start Poll</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default QuestionCreation
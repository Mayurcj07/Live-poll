import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './AnswerSubmission.css'

const AnswerSubmission = () => {
  const dispatch = useDispatch()
  const { currentQuestion, options } = useSelector((state) => state.poll)

  const handleAnswerSubmit = (answerIndex) => {
    dispatch({
      type: 'socket/submitAnswer',
      payload: { answerIndex }
    })
  }

  return (
    <div className="answer-submission">
      <div className="question-card">
        <h3>{currentQuestion}</h3>
        <p>Select your answer:</p>
        
        <div className="options-grid">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleAnswerSubmit(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnswerSubmission
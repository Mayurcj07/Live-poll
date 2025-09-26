import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

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
      <h3>{currentQuestion}</h3>
      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleAnswerSubmit(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AnswerSubmission
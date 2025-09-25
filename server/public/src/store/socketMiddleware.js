import io from 'socket.io-client'
import {
  setPollData,
  setResults,
  setAnswered,
  setConnectionStatus,
  setRegistered,
  setStudentName,
  resetPoll
} from './PollSlice'

let socket = null

const socketMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action
  const { dispatch, getState } = store

  switch (type) {
    case 'socket/connect':
      if (!socket) {
        console.log(' Connecting to server...')
        
        // Connect to backend server
        const backendUrl = 'http://localhost:3002'
        
        socket = io(backendUrl, {
          transports: ['websocket', 'polling'],
          timeout: 5000,
          reconnection: true,
          reconnectionAttempts: 5
        })

        socket.on('connect', () => {
          console.log('Connected to server')
          dispatch(setConnectionStatus('connected'))
        })

        socket.on('disconnect', () => {
          console.log(' Disconnected from server')
          dispatch(setConnectionStatus('disconnected'))
        })

        socket.on('connect_error', (error) => {
          console.error('Connection error:', error)
          dispatch(setConnectionStatus('error'))
        })

        socket.on('stateUpdate', (data) => {
          console.log('State update received')
          if (data.currentQuestion) {
            dispatch(setPollData({
              question: data.currentQuestion,
              options: data.options || [],
              isActive: data.isActive
            }))
          }
          dispatch(setResults(data))
        })

        socket.on('newQuestion', (data) => {
          console.log(' New question received')
          dispatch(setPollData(data))
        })

        socket.on('resultsUpdate', (data) => {
          console.log('Results update received')
          dispatch(setResults(data))
        })

        socket.on('answerSuccess', () => {
          console.log('Answer submitted successfully')
          dispatch(setAnswered(true))
        })

        socket.on('registrationSuccess', (data) => {
          console.log(' Registration successful')
          dispatch(setRegistered(true))
          dispatch(setStudentName(data.name))
        })

        socket.on('registrationError', (error) => {
          alert(`Registration Error: ${error}`)
        })

        socket.on('answerError', (error) => {
          alert(`Answer Error: ${error}`)
        })
      }
      break

    case 'socket/reconnect':
      if (socket) {
        socket.disconnect()
        socket = null
      }
      setTimeout(() => {
        dispatch({ type: 'socket/connect' })
      }, 1000)
      break

    case 'socket/disconnect':
      if (socket) {
        socket.disconnect()
        socket = null
      }
      break

    case 'socket/registerStudent':
      if (socket) socket.emit('registerStudent', { name: payload })
      break

    case 'socket/createPoll':
      if (socket) socket.emit('createPoll', payload)
      break

    case 'socket/submitAnswer':
      if (socket) socket.emit('submitAnswer', payload)
      break

    case 'socket/endPoll':
      if (socket) socket.emit('endPoll')
      break

    case 'socket/getResults':
      if (socket) socket.emit('getResults')
      break

    default:
      break
  }

  return next(action)
}

export default socketMiddleware
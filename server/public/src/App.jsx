import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PersonaSelection from './components/PersonaSelection'
import StudentView from './components/StudentView'
import TeacherView from './components/TeacherView'
import HealthCheck from './components/HealthCheck'
import { setConnectionStatus } from './store/PollSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { userRole, connectionStatus } = useSelector((state) => state.poll)

  useEffect(() => {
    dispatch({ type: 'socket/connect' })

    return () => {
      dispatch({ type: 'socket/disconnect' })
    }
  }, [dispatch])

  const handleReconnect = () => {
    dispatch({ type: 'socket/reconnect' })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Live Polling App</h1>
        <div className="header-info">
          <div className={`connection-status ${connectionStatus}`}>
            ● {connectionStatus.toUpperCase()}
            <button onClick={handleReconnect} className="reconnect-btn">
              🔄
            </button>
          </div>
          <HealthCheck />
        </div>
      </header>
      
      <main className="main-content">
        {!userRole ? (
          <PersonaSelection />
        ) : userRole === 'student' ? (
          <StudentView />
        ) : (
          <TeacherView />
        )}
      </main>
    </div>
  )
}

export default App
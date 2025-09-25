import React, { useState, useEffect } from 'react'
import './HealthCheck.css'

const HealthCheck = () => {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      if (!response.ok) throw new Error('HTTP error')
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      setHealth({ status: 'ERROR', message: 'Cannot reach server' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`health-check ${health?.status === 'OK' ? 'healthy' : 'error'}`}>
      <div className="health-status">
        <span>Server: {health ? health.status : 'Checking...'}</span>
        <button onClick={checkHealth} disabled={loading} className="health-btn">
          {loading ? '⟳' : '↻'}
        </button>
      </div>
    </div>
  )
}

export default HealthCheck
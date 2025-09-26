import React, { useState, useEffect } from 'react'

const HealthCheck = () => {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/test')
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
  }, [])

  return (
    <div className={`health-check ${health?.status === 'OK' ? 'healthy' : 'error'}`}>
      <button onClick={checkHealth} disabled={loading}>
        {loading ? 'Checking...' : 'Check Server Health'}
      </button>
      {health && (
        <span>
          Server: {health.status} - {health.message}
        </span>
      )}
    </div>
  )
}

export default HealthCheck
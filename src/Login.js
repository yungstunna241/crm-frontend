import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate                = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await axios.post(
        'https://crm-backend-1-2mb5.onrender.com/login',
        { username, password },
        { withCredentials: false }
      )
      if (!data.token) throw new Error('No token returned')

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)

      navigate('/', { replace: true })
    } catch (err) {
      console.error('Login error:', err.response || err.message)
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError('Login failed. Check console for details.')
      }
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#f0f4f8'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <h2 style={{ textAlign: 'center', color: '#2980b9' }}>Agent Login</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          autoComplete="current-password"
        />
        <button type="submit" style={{
          padding: 10,
          border: 'none',
          borderRadius: 4,
          background: '#2980b9',
          color: '#fff',
          cursor: 'pointer'
        }}>
          Log In
        </button>
      </form>
    </div>
  )
}

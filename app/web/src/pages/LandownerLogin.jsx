import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/axios'


export default function LandownerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { setUser } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg(''); setLoading(true)
    
    try {
       const response = await api.post('/landowner-auth/login', {
  email,
  password
      })

      if (response.data.success) {
        setUser(response.data.user)
        setMsg('Login successful! Redirecting...')
        setTimeout(() => nav('/landowner-dashboard'), 800)
      }
    } catch (e) {
      if (e.response?.data?.needsVerification) {
        setErr('Your landowner account is not yet verified. Please wait for admin approval.')
      } else {
        setErr(e.response?.data?.error || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Landowner Login</h2>
      
      {msg && <div className="text-green-700 mb-4 p-3 bg-green-50 rounded">{msg}</div>}
      {err && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{err}</div>}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <input 
          className="input" 
          placeholder="Email" 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          required 
        />
        
        <input 
          className="input" 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required 
        />
        
        <button 
          className="btn w-full" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login as Landowner'}
        </button>
      </form>
      
      <div className="mt-4 text-sm space-y-2">
        <p>Don't have a landowner account? <Link to="/landowner-register" className="underline text-blue-600">Register here</Link></p>
        <p>Are you a student? <Link to="/login" className="underline text-blue-600">Student Login</Link></p>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
        <p><strong>Note:</strong> Your landowner account must be verified by an administrator before you can log in. You will receive an email notification once your account is approved.</p>
      </div>
    </div>
  )
}


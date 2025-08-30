import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userCategory, setUserCategory] = useState('student')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const { register } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg('')
    
    if (userCategory === 'landowner') {
      // Redirect to landowner registration
      nav('/landowner-register')
      return
    }
    
    try {
      await register(name, email, password)
      setMsg('Registered! You can login now.')
      setTimeout(()=> nav('/login'), 800)
    } catch (e) {
      setErr(e.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Register</h2>
      {msg && <div className="text-green-700">{msg}</div>}
      {err && <div className="text-red-600">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">User Category</label>
          <select 
            className="input" 
            value={userCategory} 
            onChange={e => setUserCategory(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="landowner">Landowner</option>
          </select>
        </div>
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full">
          {userCategory === 'landowner' ? 'Continue to Landowner Registration' : 'Create account'}
        </button>
      </form>
      <p className="mt-3 text-sm">Have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  )
}

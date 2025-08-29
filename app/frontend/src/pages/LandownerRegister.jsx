import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/axios'


export default function LandownerRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [propertyDocument, setPropertyDocument] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg(''); setLoading(true)
    
    if (!propertyDocument) {
      setErr('Please upload your property ownership document (PDF)')
      setLoading(false)
      return
    }

    if (propertyDocument.type !== 'application/pdf') {
      setErr('Only PDF files are allowed for property ownership documents')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('propertyDocument', propertyDocument)

      // To this:
const response = await api.post('/landowner-auth/register', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

      setMsg('Landowner registration successful! Your verification request has been submitted. You will receive an email once approved.')
      setTimeout(() => nav('/landowner-login'), 2000)
    } catch (e) {
      setErr(e.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setErr('Only PDF files are allowed')
        return
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setErr('File size must be less than 10MB')
        return
      }
      setPropertyDocument(file)
      setErr('')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Landowner Registration</h2>
      <p className="text-sm text-gray-600 mb-4">
        Register as a landowner to list your properties. You'll need to upload your property ownership documents for verification.
      </p>
      
      {msg && <div className="text-green-700 mb-4 p-3 bg-green-50 rounded">{msg}</div>}
      {err && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{err}</div>}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <input 
          className="input" 
          placeholder="Full Name" 
          value={name} 
          onChange={e => setName(e.target.value)}
          required 
        />
        
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Ownership Document (PDF) *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {propertyDocument && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {propertyDocument.name}
            </p>
          )}
        </div>
        
        <button 
          className="btn w-full" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register as Landowner'}
        </button>
      </form>
      
      <div className="mt-4 text-sm space-y-2">
        <p>Already have a landowner account? <Link to="/landowner-login" className="underline text-blue-600">Login here</Link></p>
        <p>Want to register as a student? <Link to="/register" className="underline text-blue-600">Student Registration</Link></p>
      </div>
    </div>
  )
}


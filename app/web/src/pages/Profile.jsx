import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/axios'

export default function Profile() {
  const { user, refresh } = useAuth()
  const [name, setName] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setResumeUrl(user.resumeUrl || '')
      setCvUrl(user.cvUrl || '')
    }
  }, [user])

  const save = async (e) => {
    e.preventDefault()
    await api.put('/me', { name, resumeUrl, cvUrl, password: password || undefined })
    await refresh()
    setPassword('')
    setMsg('Profile updated')
    setTimeout(()=>setMsg(''), 1500)
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h2 className="text-xl font-semibold text-blue-800">My Profile</h2>
      {msg && <div className="text-green-700 mt-2">{msg}</div>}
      <form onSubmit={save} className="space-y-3 mt-4">
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input className="input" value={resumeUrl} onChange={e=>setResumeUrl(e.target.value)} placeholder="Resume URL" />
        <input className="input" value={cvUrl} onChange={e=>setCvUrl(e.target.value)} placeholder="CV URL" />
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password (optional)" />
        <button className="btn">Save</button>
      </form>
    </div>
  )
}

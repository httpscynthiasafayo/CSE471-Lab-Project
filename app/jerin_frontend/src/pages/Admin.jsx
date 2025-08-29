import { useState } from 'react'
import { api } from '../api/axios'
import AdminLandownerVerification from '../components/AdminLandownerVerification'

export default function Admin() {
  const [email, setEmail] = useState('')
  const makeAdmin = async (e) => { e.preventDefault(); await api.post('/admin/make-admin', { email }); alert('Promoted (if user exists)') }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-blue-800">Admin Dashboard</h2>
        <p className="text-sm text-blue-700">Use this only in development.</p>
      </div>

        <div className="card">
        <h3 className="font-semibold text-blue-800 mb-2">Make Admin</h3>
              <form onSubmit={makeAdmin} className="flex gap-2">
          <input className="input" placeholder="User email" value={email} onChange={e=>setEmail(e.target.value)} />
                <button className="btn">Promote</button>
              </form>
            </div>
    </div>
  )
}

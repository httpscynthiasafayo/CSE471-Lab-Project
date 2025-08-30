import { useState } from 'react'
import { api } from '../api/axios'
import AdminLandownerVerification from '../components/AdminLandownerVerification'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [activeTab, setActiveTab] = useState('verification')
  
  const makeAdmin = async (e) => { 
    e.preventDefault()
    try {
      await api.post('/admin/make-admin', { email })
      alert('User promoted to admin (if user exists)')
      setEmail('')
    } catch (error) {
      alert('Error promoting user: ' + (error.response?.data?.error || 'Unknown error'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-blue-800">Admin Dashboard</h2>
        <p className="text-sm text-blue-700">Manage users and verification requests.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verification'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Landowner Verification
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Management
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'verification' && (
        <div className="card">
          <AdminLandownerVerification />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h3 className="font-semibold text-blue-800 mb-4">User Management</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Promote User to Admin</h4>
              <p className="text-sm text-gray-600 mb-3">Use this only in development.</p>
              <form onSubmit={makeAdmin} className="flex gap-2">
                <input 
                  className="input flex-1" 
                  placeholder="User email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
                <button className="btn">Promote</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { api } from '../api/axios'

export default function AdminLandownerVerification() {
  const [verificationRequests, setVerificationRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchVerificationRequests()
  }, [])

  const fetchVerificationRequests = async () => {
    try {
      const response = await api.get('/admin/landowner-verification-requests')
      setVerificationRequests(response.data)
    } catch (error) {
      console.error('Error fetching verification requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId) => {
    setActionLoading(true)
    try {
      await api.post(`/admin/landowner-verification-requests/${requestId}/approve`, {
        adminNotes
      })
      alert('Landowner verification approved successfully!')
      setSelectedRequest(null)
      setAdminNotes('')
      await fetchVerificationRequests()
    } catch (error) {
      alert('Error approving verification: ' + (error.response?.data?.error || 'Unknown error'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (requestId) => {
    if (!adminNotes.trim()) {
      alert('Please provide admin notes for rejection')
      return
    }
    
    setActionLoading(true)
    try {
      await api.post(`/admin/landowner-verification-requests/${requestId}/reject`, {
        adminNotes
      })
      alert('Landowner verification rejected')
      setSelectedRequest(null)
      setAdminNotes('')
      await fetchVerificationRequests()
    } catch (error) {
      alert('Error rejecting verification: ' + (error.response?.data?.error || 'Unknown error'))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading verification requests...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-800">Landowner Verification Requests</h3>
        <span className="text-sm text-gray-600">
          {verificationRequests.length} pending request(s)
        </span>
      </div>

      {verificationRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending verification requests
        </div>
      ) : (
        <div className="space-y-4">
          {verificationRequests.map((request) => (
            <div key={request._id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{request.userId.name}</h4>
                  <p className="text-sm text-gray-600">{request.userId.email}</p>
                  <p className="text-xs text-gray-500">
                    Requested: {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                  {request.status}
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <a
                  href={`/api/admin/landowner-documents/${request._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  View Document
                </a>
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Review
                </button>
              </div>

              {selectedRequest?._id === request._id && (
                <div className="border-t pt-3 mt-3">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notes
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        rows="3"
                        placeholder="Add notes about the verification decision..."
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(null)
                          setAdminNotes('')
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

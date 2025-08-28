import { useEffect, useState } from 'react'
import { api } from '../api/axios'

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [posts, setPosts] = useState({})
  const [loading, setLoading] = useState(true)

  const loadBookmarks = async () => {
    try {
      const { data } = await api.get('/bookmarks')
      setBookmarks(data)
      
      // Fetch post details for POST bookmarks
      const postBookmarks = data.filter(b => b.itemType === 'POST')
      const postDetails = {}
      
      for (const bookmark of postBookmarks) {
        try {
          const { data: post } = await api.get(`/posts/${bookmark.itemId}`)
          postDetails[bookmark.itemId] = post
        } catch (error) {
          console.error('Error fetching post:', error)
        }
      }
      
      setPosts(postDetails)
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBookmarks() }, [])

  const removeBookmark = async (id) => { 
    await api.delete(`/bookmarks/${id}`)
    loadBookmarks()
  }

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">📚 My Bookmarks</h2>
      
      <div className="space-y-4">
        {bookmarks.map(bookmark => {
          if (bookmark.itemType === 'POST') {
            const post = posts[bookmark.itemId]
            if (!post) {
              return (
                <div key={bookmark._id} className="card bg-red-50 border-red-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-red-600 font-medium">Guide Not Found</div>
                      <div className="text-sm text-red-500">This guide may have been deleted</div>
                    </div>
                    <button 
                      className="btn bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => removeBookmark(bookmark._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={bookmark._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-blue-800">{post.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.type === 'SOP' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {post.type} Guide
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          📍 {post.country}
                        </span>
                      </div>
                      
                      {post.type === 'SOP' && (
                        <div className="flex flex-wrap gap-1 text-xs">
                          {post.university && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              🏫 {post.university}
                            </span>
                          )}
                          {post.program && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              📚 {post.program}
                            </span>
                          )}
                          {post.degreeType && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              🎓 {post.degreeType}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-md text-gray-500 my-2 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {post.body}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Bookmarked: {new Date(bookmark.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button 
                    className="btn bg-red-500 hover:bg-red-600 text-white ml-4"
                    onClick={() => removeBookmark(bookmark._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          }

          // For other bookmark types (PROPERTY, UNIVERSITY)
          return (
            <div key={bookmark._id} className="card">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-blue-600 font-medium">{bookmark.itemType}</div>
                  <div className="text-blue-900">ID: {bookmark.itemId}</div>
                  <div className="text-xs text-gray-500">Saved: {new Date(bookmark.createdAt).toLocaleString()}</div>
                </div>
                <button 
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => removeBookmark(bookmark._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          )
        })}
        
        {!bookmarks.length && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-500">No bookmarks yet</h3>
            <p className="text-gray-400 mt-2">Start bookmarking guides to save them for later</p>
          </div>
        )}
      </div>
    </div>
  )
}

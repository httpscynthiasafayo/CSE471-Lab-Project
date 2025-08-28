import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/axios'

const AuthContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchMe() {
    try {
      const { data } = await api.get('/me')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMe() }, [])

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password })
    await fetchMe()
  }

  const register = async (name, email, password) => {
    await api.post('/auth/register', { name, email, password })
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  // Helper function to check if user is landowner
  const isLandowner = () => {
    return user?.role === 'landowner'
  }

  // Helper function to check if landowner is verified
  const isLandownerVerified = () => {
    return user?.role === 'landowner' && user?.isLandownerVerified === true
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      loading, 
      login, 
      register, 
      logout, 
      refresh: fetchMe,
      isLandowner,
      isLandownerVerified
    }}>
      {children}
    </AuthContext.Provider>
  )
}

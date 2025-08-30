import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/axios'

const AuthContext = createContext(null)

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

  
  const subscribeFree = async () => {
    try {
      const { data } = await api.post('/me/subscribe-free')
      setUser((prev) => ({ ...prev, subscription: data.subscription, planSet: data.planSet }))
    } catch (err) {
      console.error('Failed to subscribe to Free plan:', err)
    }
  }

  
  const subscribePremium = async () => {
    try {
      const { data } = await api.post('/me/subscribe-premium')
      setUser((prev) => ({ ...prev, subscription: data.subscription, planSet: data.planSet }))
    } catch (err) {
      console.error('Failed to subscribe to Premium plan:', err)
    }
  }
  const cancelPremium = async () => {
    try {
      const { data } = await api.post('/stripe/cancel-subscription');
      setUser((prev) => ({
        ...prev,
        subscription: {
          plan: "none",
          status: "inactive",
          startDate: null,
          subscriptionId: null
        },
        planSet: false
      }));
      // Return message for toast
      return data.message || "Subscription cancelled.";
    } catch (err) {
      console.error("Failed to cancel premium:", err);
      // Throw error so Home.jsx can catch and show toast
      throw new Error("Failed to cancel subscription.");
    }
  };
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
      subscribeFree,
      subscribePremium,
      cancelPremium,
      isLandowner,
      isLandownerVerified
    }}>
      {children}
    </AuthContext.Provider>
  )
}

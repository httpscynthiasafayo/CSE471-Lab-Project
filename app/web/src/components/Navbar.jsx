import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = async () => {
    await logout()
    nav('/login')
  }

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-900' : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'}`

  return (
    <nav className="bg-white border-b border-purple-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-2xl text-purple-700">AbroadEase</span>
          </Link>
          
          <div className="flex items-center gap-1">
            {user && <NavLink to="/guides" className={linkClass}>📚 Guides</NavLink>}
            <NavLink to="/universities" className={linkClass}>🎓 Universities</NavLink>
            <NavLink to="/housing" className={linkClass}>🏠 Housing</NavLink>
            <NavLink to="/visas" className={linkClass}>📋 Visas</NavLink>
            
            {user && <>
              <NavLink to="/bookmarks" className={linkClass}>🔖 Bookmarks</NavLink>
              <NavLink to="/notifications" className={linkClass}>🔔 Notifications</NavLink>
              <NavLink to="/profile" className={linkClass}>👤 Profile</NavLink>
            </>}
            
            {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>⚙️ Admin</NavLink>}
            
            {!user ? (
              <div className="flex items-center gap-2 ml-4">
                <NavLink to="/login" className="btn-secondary">Login</NavLink>
                <NavLink to="/register" className="btn">Register</NavLink>
              </div>
            ) : (
              <button onClick={handleLogout} className="btn ml-4">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

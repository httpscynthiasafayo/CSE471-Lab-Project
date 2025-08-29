import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import LandownerRegister from './pages/LandownerRegister.jsx'
import LandownerLogin from './pages/LandownerLogin.jsx'
import LandownerDashboard from './pages/LandownerDashboard.jsx'
import Profile from './pages/Profile.jsx'
import Guides from './pages/Guides.jsx'
import PostDetail from './pages/PostDetail.jsx'
import Universities from './pages/Universities.jsx'
import Housing from './pages/Housing.jsx'
import HousingDetail from './pages/HousingDetail.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import Notifications from './pages/Notifications.jsx'
import Admin from './pages/Admin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/landowner-register" element={<LandownerRegister/>} />
          <Route path="/landowner-login" element={<LandownerLogin/>} />
          <Route path="/landowner-dashboard" element={<LandownerDashboard/>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:id" element={<PostDetail />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/housing" element={<Housing />} />
          <Route path="/housing/:id" element={<HousingDetail />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

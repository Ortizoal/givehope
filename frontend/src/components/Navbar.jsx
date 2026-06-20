import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, LogOut, User, LayoutDashboard } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Heart className="w-6 h-6 fill-current" />
            GiveHope
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/causes" className={({ isActive }) =>
              isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>
              Causes
            </NavLink>
            {user && (
              <NavLink to="/history" className={({ isActive }) =>
                isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>
                My Donations
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) =>
                isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>
                <span className="flex items-center gap-1"><LayoutDashboard className="w-4 h-4" /> Admin</span>
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden md:flex items-center gap-1 text-sm text-gray-600">
                  <User className="w-4 h-4" /> {user.name}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

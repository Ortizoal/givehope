import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl" onClick={() => setMenuOpen(false)}>
            <Heart className="w-6 h-6 fill-current" />
            GiveHope
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/causes" className={navLinkClass}>Causes</NavLink>
            {user && <NavLink to="/history" className={navLinkClass}>My Donations</NavLink>}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                <span className="flex items-center gap-1"><LayoutDashboard className="w-4 h-4" /> Admin</span>
              </NavLink>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="flex items-center gap-1 text-sm text-gray-600">
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

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <NavLink to="/causes" className={({ isActive }) =>
            `block py-2 px-3 rounded-lg text-sm font-medium ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setMenuOpen(false)}>Causes</NavLink>
          {user && (
            <NavLink to="/history" className={({ isActive }) =>
              `block py-2 px-3 rounded-lg text-sm font-medium ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setMenuOpen(false)}>My Donations</NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) =>
              `block py-2 px-3 rounded-lg text-sm font-medium ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setMenuOpen(false)}>
              <span className="flex items-center gap-1"><LayoutDashboard className="w-4 h-4" /> Admin</span>
            </NavLink>
          )}
          <div className="pt-2 border-t border-gray-100 mt-2">
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 px-3 flex items-center gap-1"><User className="w-4 h-4" /> {user.name}</p>
                <button onClick={handleLogout} className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

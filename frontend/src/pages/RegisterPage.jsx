import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Heart, Eye, EyeOff } from 'lucide-react'

function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="input pr-10"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        minLength={8}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      toast.success('Account created! Welcome to GiveHope!')
      navigate('/causes')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) { Object.values(errors).forEach(msgs => msgs.forEach(m => toast.error(m))) }
      else toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-primary-600 fill-current mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Join the GiveHope community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required autoComplete="name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required autoComplete="email" />
          </div>
          <div>
            <label className="label">Password</label>
            <PasswordInput value={form.password} onChange={e => setForm({...form, password: e.target.value})} autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <PasswordInput value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation: e.target.value})} autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-primary-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

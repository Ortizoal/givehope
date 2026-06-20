import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout')
export const getUser = () => api.get('/user')

// Causes
export const getCauses = () => api.get('/causes')
export const getCause = (slug) => api.get(`/causes/${slug}`)

// Donations
export const createCheckout = (data) => api.post('/donations/checkout', data)
export const verifyPayment = (reference) => api.get(`/donations/verify/${reference}`)
export const getDonationHistory = () => api.get('/donations/history')

// Admin
export const getAdminDashboard = () => api.get('/admin/dashboard')
export const getAdminCauses = () => api.get('/admin/causes')
export const createCause = (data) => api.post('/admin/causes', data)
export const updateCause = (id, data) => api.put(`/admin/causes/${id}`, data)
export const deleteCause = (id) => api.delete(`/admin/causes/${id}`)
export const getAdminDonations = () => api.get('/admin/donations')
export const getAdminUsers = () => api.get('/admin/users')
export const toggleUser = (id) => api.patch(`/admin/users/${id}/toggle`)

export default api

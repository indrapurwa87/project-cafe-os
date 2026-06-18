import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cafeos_admin_token') 
             || localStorage.getItem('cafeos_kitchen_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cafeos_admin_token')
      localStorage.removeItem('cafeos_kitchen_token')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      } else if (window.location.pathname.startsWith('/kitchen')) {
        window.location.href = '/kitchen/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

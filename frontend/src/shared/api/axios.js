import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor — attach JWT and X-Tenant-Slug
api.interceptors.request.use((config) => {
  // 1. Attach tenant slug header if in tenant scope
  const pathParts = window.location.pathname.split('/')
  if (pathParts[1] === 'c' && pathParts[2]) {
    config.headers['X-Tenant-Slug'] = pathParts[2]
  }

  // 2. Attach Authorization token
  const token = localStorage.getItem('cafeos_super_token')
             || localStorage.getItem('cafeos_admin_token')
             || localStorage.getItem('cafeos_kitchen_token')
             || localStorage.getItem('cafeos_cashier_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  
  return config
})

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cafeos_super_token')
      localStorage.removeItem('cafeos_admin_token')
      localStorage.removeItem('cafeos_kitchen_token')
      localStorage.removeItem('cafeos_cashier_token')
      
      const pathParts = window.location.pathname.split('/')
      const isTenantRoute = pathParts[1] === 'c' && pathParts[2]
      const tenantSlug = isTenantRoute ? pathParts[2] : ''

      if (window.location.pathname.startsWith('/super-admin')) {
        window.location.href = '/super-admin/login'
      } else if (isTenantRoute) {
        if (window.location.pathname.includes('/admin')) {
          window.location.href = `/c/${tenantSlug}/admin/login`
        } else if (window.location.pathname.includes('/kitchen')) {
          window.location.href = `/c/${tenantSlug}/kitchen/login`
        } else if (window.location.pathname.includes('/cashier')) {
          window.location.href = `/c/${tenantSlug}/cashier/login`
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api

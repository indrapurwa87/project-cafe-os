import { Navigate } from 'react-router-dom'

export default function AdminGuard({ children }) {
  const token = localStorage.getItem('cafeos_admin_token')
  return token ? children : <Navigate to="/admin/login" replace />
}

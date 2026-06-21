import { Navigate } from 'react-router-dom'

export default function SuperAdminGuard({ children }) {
  const token = localStorage.getItem('cafeos_super_token')
  return token ? children : <Navigate to="/super-admin/login" replace />
}

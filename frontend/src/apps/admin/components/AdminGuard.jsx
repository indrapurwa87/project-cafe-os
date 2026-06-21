import { Navigate, useParams } from 'react-router-dom'

export default function AdminGuard({ children }) {
  const { tenantSlug } = useParams()
  const token = localStorage.getItem('cafeos_admin_token')
  return token ? children : <Navigate to={`/c/${tenantSlug}/admin/login`} replace />
}

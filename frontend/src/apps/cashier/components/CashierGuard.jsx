import { Navigate, useParams } from 'react-router-dom'

export default function CashierGuard({ children }) {
  const { tenantSlug } = useParams()
  const token = localStorage.getItem('cafeos_cashier_token')

  if (!token) {
    return <Navigate to={`/c/${tenantSlug}/cashier/login`} replace />
  }

  try {
    // Decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!['cashier', 'admin'].includes(payload.role)) {
      localStorage.removeItem('cafeos_cashier_token')
      return <Navigate to={`/c/${tenantSlug}/cashier/login`} replace />
    }
  } catch {
    localStorage.removeItem('cafeos_cashier_token')
    return <Navigate to={`/c/${tenantSlug}/cashier/login`} replace />
  }

  return children
}

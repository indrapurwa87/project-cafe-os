import { Navigate, useParams } from 'react-router-dom'

export default function KitchenGuard({ children }) {
  const { tenantSlug } = useParams()
  const token = localStorage.getItem('cafeos_kitchen_token')
  return token ? children : <Navigate to={`/c/${tenantSlug}/kitchen/login`} replace />
}

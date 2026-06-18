import { Navigate } from 'react-router-dom'

export default function KitchenGuard({ children }) {
  const token = localStorage.getItem('cafeos_kitchen_token')
  return token ? children : <Navigate to="/kitchen/login" replace />
}

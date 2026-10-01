import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/dang-nhap" state={{ from: location }} replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return children ?? <Outlet />
}

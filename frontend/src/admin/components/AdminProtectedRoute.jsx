
import { Navigate, Outlet } from 'react-router-dom'

function AdminProtectedRoute() {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken')

  const userData = localStorage.getItem('user')

  let user = null

  try {
    user = userData ? JSON.parse(userData) : null
  } catch {
    user = null
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.role !== 'admin') {
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default AdminProtectedRoute

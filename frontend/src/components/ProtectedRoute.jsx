import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function ProtectedRoute({ allowRoles }) {
  const { loading, isAuthenticated, role } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-sm text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !allowRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}


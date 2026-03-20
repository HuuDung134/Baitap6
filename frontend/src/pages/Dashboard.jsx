import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import useAuth from '../hooks/useAuth.js'

function roleDescription(role) {
  switch (role) {
    case 'admin':
      return 'Manage users, roles, and system configuration.'
    case 'staff':
      return 'Validate tickets at entry gates and handle incidents.'
    case 'inspector':
      return 'Inspect tickets and manage violations.'
    case 'passenger':
      return 'Buy tickets, view your tickets, and manage your balance.'
    default:
      return 'Sign in to access features.'
  }
}

export default function Dashboard() {
  const { user, role } = useAuth()

  const actions = useMemo(() => {
    if (role === 'staff') {
      return [{ to: '/staff/validate', label: 'Validate ticket' }]
    }
    if (role === 'inspector') {
      return [{ to: '/inspector/manual', label: 'Manual inspection' }]
    }
    if (role === 'admin') {
      return [{ to: '/admin/users', label: 'Manage users' }]
    }
    return []
  }, [role])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl font-semibold text-slate-900">Dashboard</div>
            <div className="mt-1 text-sm text-slate-600">{roleDescription(role)}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <Button key={a.to} as={Link} to={a.to} variant="primary">
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <div className="text-sm font-semibold text-slate-900">My profile</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500">Name</div>
              <div className="text-sm font-medium text-slate-900">{user?.name || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Email</div>
              <div className="text-sm font-medium text-slate-900">{user?.email || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Role</div>
              <div className="text-sm font-medium text-slate-900">{role || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">User ID</div>
              <div className="truncate text-sm font-medium text-slate-900">{user?._id || user?.id || '-'}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Quick help</div>
          <div className="mt-3 space-y-3">
            <Alert tone="info" title="Demo accounts">
              Use the demo users from the assignment document to test different roles.
            </Alert>
            <div className="text-sm text-slate-600">
              Backend default: <span className="font-medium text-slate-900">http://localhost:3000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


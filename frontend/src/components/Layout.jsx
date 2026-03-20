import React, { useMemo } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import Button from './Button.jsx'

function roleLabel(role) {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'staff':
      return 'Staff'
    case 'inspector':
      return 'Inspector'
    case 'passenger':
      return 'Passenger'
    default:
      return role || 'Guest'
  }
}

export default function Layout() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = useMemo(() => {
    const base = [{ to: '/', label: 'Dashboard' }]
    if (role === 'staff') base.push({ to: '/staff/validate', label: 'Validate ticket' })
    if (role === 'inspector') base.push({ to: '/inspector/manual', label: 'Manual inspection' })
    if (role === 'admin') base.push({ to: '/admin/users', label: 'Users' })
    return base
  }, [role])

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-slate-900">Metro Ticket System</div>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((x) => (
                <NavLink
                  key={x.to}
                  to={x.to}
                  className={({ isActive }) =>
                    [
                      'rounded-lg px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')
                  }
                >
                  {x.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden text-right md:block">
                <div className="text-sm font-medium text-slate-900">{user?.name || user?.email}</div>
                <div className="text-xs text-slate-500">{roleLabel(role)}</div>
              </div>
            ) : null}
            {user ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  await logout()
                  navigate('/login')
                }}
              >
                Logout
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}


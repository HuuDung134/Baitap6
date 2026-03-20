import React, { useEffect, useMemo, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import { useNotifications } from '../contexts/NotificationContext.jsx'
import { listUsers, updateUserRole } from '../services/users.service.js'

const ROLES = ['passenger', 'staff', 'inspector', 'admin']

export default function AdminUsers() {
  const { notify } = useNotifications()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [savingId, setSavingId] = useState(null)

  const rows = useMemo(() => users?.users ?? users, [users])

  async function load() {
    setError('')
    setLoading(true)
    try {
      const data = await listUsers()
      setUsers(data)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unable to load users.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl font-semibold text-slate-900">User management</div>
            <div className="mt-1 text-sm text-slate-600">View users and update their roles.</div>
          </div>
          <Button variant="secondary" onClick={load} loading={loading}>
            Refresh
          </Button>
        </div>

        {error ? <Alert className="mt-4" tone="error" title="Error">{error}</Alert> : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="text-sm text-slate-600">Loading users...</div>
        ) : rows?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <UserRow
                    key={u._id || u.id || u.email}
                    user={u}
                    saving={savingId === (u._id || u.id)}
                    onSave={async (role) => {
                      const id = u._id || u.id
                      if (!id) return
                      setSavingId(id)
                      try {
                        await updateUserRole({ id, role })
                        notify({ tone: 'success', title: 'Updated', message: `${u.email} → ${role}` })
                        await load()
                      } catch (err) {
                        const msg = err?.response?.data?.message || err?.message || 'Unable to update role.'
                        notify({ tone: 'error', title: 'Update failed', message: msg })
                      } finally {
                        setSavingId(null)
                      }
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-slate-600">No users found.</div>
        )}
      </div>
    </div>
  )
}

function UserRow({ user, onSave, saving }) {
  const [role, setRole] = useState(user?.role || 'passenger')

  useEffect(() => {
    setRole(user?.role || 'passenger')
  }, [user?.role])

  return (
    <tr className="border-b border-slate-100">
      <td className="py-3 pr-3 font-medium text-slate-900">{user?.name || '-'}</td>
      <td className="py-3 pr-3 text-slate-700">{user?.email || '-'}</td>
      <td className="py-3 pr-3">
        <select
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={saving}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3 pr-3">
        <Button variant="primary" size="sm" loading={saving} onClick={() => onSave(role)}>
          Save
        </Button>
      </td>
    </tr>
  )
}


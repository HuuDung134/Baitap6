import { api } from './api.js'

export async function listUsers() {
  const res = await api.get('/api/users')
  return res.data
}

export async function updateUserRole({ id, role }) {
  const res = await api.patch(`/api/users/${encodeURIComponent(id)}/role`, { role })
  return res.data
}


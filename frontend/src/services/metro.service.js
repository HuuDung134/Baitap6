import { api } from './api.js'

export async function validateTicketEntry({ code, stationCode }) {
  const res = await api.post(`/api/metro/tickets/${encodeURIComponent(code)}/validate-entry`, { stationCode })
  return res.data
}

export async function manualInspection({ code }) {
  const res = await api.post(`/api/metro/tickets/${encodeURIComponent(code)}/manual-inspection`)
  return res.data
}


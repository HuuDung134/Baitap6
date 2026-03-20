import React, { useMemo, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { useNotifications } from '../contexts/NotificationContext.jsx'
import { validateTicketEntry } from '../services/metro.service.js'

function normalizeResult(data) {
  const raw = data?.result || data?.status || data?.decision || data?.code
  const upper = typeof raw === 'string' ? raw.toUpperCase() : null
  if (upper === 'ALLOW' || upper === 'DENY' || upper === 'EXPIRED') return upper
  if (data?.allow === true) return 'ALLOW'
  if (data?.allow === false) return 'DENY'
  return upper || 'UNKNOWN'
}

export default function TicketValidation() {
  const { notify } = useNotifications()
  const [code, setCode] = useState('')
  const [stationCode, setStationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [last, setLast] = useState(null)
  const [history, setHistory] = useState([])

  const result = useMemo(() => (last ? normalizeResult(last) : null), [last])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-900">Ticket validation (entry gate)</div>
        <div className="mt-1 text-sm text-slate-600">Enter ticket code and station code to validate.</div>

        {error ? <Alert className="mt-4" tone="error" title="Validation failed">{error}</Alert> : null}

        <form
          className="mt-6 grid gap-4 md:grid-cols-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            setLoading(true)
            try {
              const data = await validateTicketEntry({ code, stationCode })
              setLast(data)
              const item = {
                at: new Date().toISOString(),
                code,
                stationCode,
                result: normalizeResult(data),
              }
              setHistory((prev) => [item, ...prev].slice(0, 10))
              notify({ tone: 'success', title: 'Validated', message: `Result: ${item.result}` })
            } catch (err) {
              const msg = err?.response?.data?.message || err?.message || 'Unable to validate ticket.'
              setError(msg)
            } finally {
              setLoading(false)
            }
          }}
        >
          <Input label="Ticket code" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input label="Station code" value={stationCode} onChange={(e) => setStationCode(e.target.value)} required />
          <div className="flex items-end">
            <Button loading={loading} className="w-full" type="submit">
              Validate
            </Button>
          </div>
        </form>
      </div>

      {result ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Last result</div>
          <div className="mt-3">
            {result === 'ALLOW' ? (
              <Alert tone="success" title="ALLOW">
                Ticket is valid for entry.
              </Alert>
            ) : result === 'EXPIRED' ? (
              <Alert tone="warning" title="EXPIRED">
                Ticket is expired.
              </Alert>
            ) : result === 'DENY' ? (
              <Alert tone="error" title="DENY">
                Ticket is not allowed.
              </Alert>
            ) : (
              <Alert tone="info" title="UNKNOWN">
                Received an unrecognized response.
              </Alert>
            )}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Recent validations</div>
            <div className="mt-1 text-sm text-slate-600">Stored locally (latest 10).</div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setHistory([])}>
            Clear
          </Button>
        </div>

        {history.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Ticket</th>
                  <th className="py-2 pr-3">Station</th>
                  <th className="py-2 pr-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={`${h.at}-${h.code}`} className="border-b border-slate-100">
                    <td className="py-2 pr-3 text-slate-600">{new Date(h.at).toLocaleString()}</td>
                    <td className="py-2 pr-3 font-medium text-slate-900">{h.code}</td>
                    <td className="py-2 pr-3 text-slate-700">{h.stationCode}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={[
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                          h.result === 'ALLOW'
                            ? 'bg-emerald-50 text-emerald-700'
                            : h.result === 'EXPIRED'
                              ? 'bg-amber-50 text-amber-800'
                              : h.result === 'DENY'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-slate-100 text-slate-700',
                        ].join(' ')}
                      >
                        {h.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-600">No validations yet.</div>
        )}
      </div>
    </div>
  )
}


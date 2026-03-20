import React, { useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { manualInspection } from '../services/metro.service.js'

export default function ManualInspection() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-900">Manual inspection</div>
        <div className="mt-1 text-sm text-slate-600">Check ticket details by code.</div>

        {error ? <Alert className="mt-4" tone="error" title="Inspection failed">{error}</Alert> : null}

        <form
          className="mt-6 grid gap-4 md:grid-cols-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            setLoading(true)
            try {
              const res = await manualInspection({ code })
              setData(res)
            } catch (err) {
              const msg = err?.response?.data?.message || err?.message || 'Unable to inspect ticket.'
              setError(msg)
              setData(null)
            } finally {
              setLoading(false)
            }
          }}
        >
          <div className="md:col-span-2">
            <Input label="Ticket code" value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <div className="flex items-end">
            <Button loading={loading} className="w-full" type="submit">
              Inspect
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Ticket details</div>
        {data ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500">Code</div>
              <div className="text-sm font-medium text-slate-900">{data?.ticket?.code || data?.code || code}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Status</div>
              <div className="text-sm font-medium text-slate-900">{data?.ticket?.status || data?.status || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Type</div>
              <div className="text-sm font-medium text-slate-900">{data?.ticket?.type || data?.type || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Expires at</div>
              <div className="text-sm font-medium text-slate-900">
                {data?.ticket?.expiresAt
                  ? new Date(data.ticket.expiresAt).toLocaleString()
                  : data?.expiresAt
                    ? new Date(data.expiresAt).toLocaleString()
                    : '-'}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-slate-500">Raw response</div>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-600">No data yet.</div>
        )}
      </div>
    </div>
  )
}


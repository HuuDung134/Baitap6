import React from 'react'
import { useNotifications } from '../contexts/NotificationContext.jsx'

const TONE = {
  info: 'border-sky-200 bg-white',
  success: 'border-emerald-200 bg-white',
  warning: 'border-amber-200 bg-white',
  error: 'border-rose-200 bg-white',
}

export default function Notification() {
  const { items, remove } = useNotifications()

  if (!items.length) return null

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
      {items.map((n) => (
        <div
          key={n.id}
          className={[
            'pointer-events-auto rounded-xl border p-4 shadow-sm',
            'backdrop-blur supports-[backdrop-filter]:bg-white/80',
            TONE[n.tone] ?? TONE.info,
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {n.title ? <div className="truncate text-sm font-semibold text-slate-900">{n.title}</div> : null}
              {n.message ? <div className="mt-0.5 text-sm text-slate-600">{n.message}</div> : null}
            </div>
            <button
              type="button"
              onClick={() => remove(n.id)}
              className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}


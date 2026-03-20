import React from 'react'

const TONE_STYLES = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
}

export default function Alert({ tone = 'info', title, children, className = '' }) {
  return (
    <div className={['rounded-lg border p-4 text-left', TONE_STYLES[tone] ?? TONE_STYLES.info, className].join(' ')}>
      {title ? <div className="mb-1 text-sm font-semibold">{title}</div> : null}
      {children ? <div className="text-sm">{children}</div> : null}
    </div>
  )
}


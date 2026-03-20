import React from 'react'

export default function Input({
  label,
  hint,
  error,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <label className={['block text-left', className].join(' ')}>
      {label ? <div className="mb-1 text-sm font-medium text-slate-900">{label}</div> : null}
      <input
        className={[
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50',
          error ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200',
          inputClassName,
        ].join(' ')}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-sm text-rose-700">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-sm text-slate-500">{hint}</div>
      ) : null}
    </label>
  )
}


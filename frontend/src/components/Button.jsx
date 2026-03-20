import React from 'react'

const VARIANT_STYLES = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-900',
}

const SIZE_STYLES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  children,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <Comp
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50',
        VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary,
        SIZE_STYLES[size] ?? SIZE_STYLES.md,
        isDisabled ? 'opacity-60 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </Comp>
  )
}


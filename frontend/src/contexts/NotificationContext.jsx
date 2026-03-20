import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const NotificationContext = createContext(null)

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([])

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback(
    ({ tone = 'info', title, message, timeoutMs = 3000 }) => {
      const id = randomId()
      setItems((prev) => [{ id, tone, title, message }, ...prev].slice(0, 5))
      if (timeoutMs && timeoutMs > 0) {
        window.setTimeout(() => remove(id), timeoutMs)
      }
      return id
    },
    [remove],
  )

  const value = useMemo(() => ({ items, notify, remove }), [items, notify, remove])

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}


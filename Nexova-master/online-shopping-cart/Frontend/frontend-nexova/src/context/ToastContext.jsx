import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const success = useCallback((msg) => toast(msg, 'success'), [toast])
  const error   = useCallback((msg) => toast(msg, 'error'),   [toast])
  const info    = useCallback((msg) => toast(msg, 'info'),    [toast])
  const warning = useCallback((msg) => toast(msg, 'warning'), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-fade-up flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium pointer-events-auto max-w-xs
            ${t.type === 'success' ? 'bg-green-700 text-white' : ''}
            ${t.type === 'error'   ? 'bg-red-700 text-white'   : ''}
            ${t.type === 'warning' ? 'bg-amber-600 text-white' : ''}
            ${t.type === 'info'    ? 'bg-brand-500 text-white' : ''}
          `}
        >
          <span className="text-base">
            {t.type === 'success' && '✓'}
            {t.type === 'error'   && '✕'}
            {t.type === 'warning' && '⚠'}
            {t.type === 'info'    && 'ℹ'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
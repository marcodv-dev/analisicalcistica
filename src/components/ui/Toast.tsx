import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => {
    setItems(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++
    setItems(prev => [...prev, { id, message, type }])
    setTimeout(() => remove(id), 3000)
  }, [remove])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {items.map(t => (
          <div
            key={t.id}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              background: t.type === 'success' ? 'var(--success)' : t.type === 'error' ? 'var(--danger)' : t.type === 'warning' ? 'var(--warning)' : 'var(--primary)',
              color: t.type === 'warning' ? '#000' : '#fff',
              fontSize: '0.9rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {t.type === 'success' && '✓ '}{t.type === 'error' && '✕ '}{t.type === 'warning' && '⚠ '}{t.type === 'info' && 'ℹ '}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

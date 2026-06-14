/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi"

const ToastContext = createContext(null)

const iconMap = {
  error: FiAlertCircle,
  info: FiInfo,
  success: FiCheckCircle,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ message, type = "info" }) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type] || FiInfo

          return (
            <div
              key={toast.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-lg"
            >
              <Icon
                className={`mt-0.5 h-5 w-5 ${
                  toast.type === "success"
                    ? "text-emerald-600"
                    : toast.type === "error"
                      ? "text-rose-600"
                      : "text-sky-600"
                }`}
              />
              <p className="flex-1 leading-5">{toast.message}</p>
              <button
                aria-label="Dismiss notification"
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                type="button"
                onClick={() => dismiss(toast.id)}
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider")
  }

  return context
}

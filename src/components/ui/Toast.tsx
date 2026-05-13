import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
}

// ── Global toast state (module-level singleton) ───────────────────────────────
let _listeners: ((toasts: ToastMessage[]) => void)[] = []
let _toasts: ToastMessage[] = []

function notify(listeners: typeof _listeners, toasts: ToastMessage[]) {
  listeners.forEach((l) => l([...toasts]))
}

export const toast = {
  show(type: ToastType, title: string, message?: string) {
    const id = `${Date.now()}-${Math.random()}`
    _toasts = [..._toasts, { id, type, title, message }]
    notify(_listeners, _toasts)
    setTimeout(() => toast.dismiss(id), 4000)
  },
  success(title: string, message?: string) { this.show("success", title, message) },
  error(title: string, message?: string) { this.show("error", title, message) },
  warning(title: string, message?: string) { this.show("warning", title, message) },
  info(title: string, message?: string) { this.show("info", title, message) },
  dismiss(id: string) {
    _toasts = _toasts.filter((t) => t.id !== id)
    notify(_listeners, _toasts)
  },
}

const icons: Record<ToastType, JSX.Element> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
  error: <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
}

const borderColors: Record<ToastType, string> = {
  success: "border-emerald-500/30",
  error: "border-red-500/30",
  warning: "border-amber-500/30",
  info: "border-blue-500/30",
}

// ── Toast container component ─────────────────────────────────────────────────
export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    _listeners.push(setToasts)
    return () => {
      _listeners = _listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#111]/90 backdrop-blur-xl border ${borderColors[t.type]} shadow-2xl`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.message && <p className="text-xs text-gray-400 mt-0.5">{t.message}</p>}
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

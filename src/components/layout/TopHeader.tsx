import { useState, useEffect, useRef, useCallback } from "react"
import { Bell, Search, X, CheckCheck, ShieldCheck, UserPlus, AlertTriangle, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { apiFetch } from "../../hooks/useApi"
import logoSvg from "../../assets/Logo.svg"

interface AdminNotif {
  id: number
  title: string
  message: string | null
  category: string
  is_read: boolean
  link: string | null
  created_at: string
}

const CATEGORY_ICON: Record<string, { icon: any; color: string; bg: string }> = {
  verification: { icon: ShieldCheck,  color: "text-amber-400",  bg: "bg-amber-500/10"  },
  user:         { icon: UserPlus,     color: "text-blue-400",   bg: "bg-blue-500/10"   },
  scheme:       { icon: ShieldCheck,  color: "text-emerald-400",bg: "bg-emerald-500/10"},
  system:       { icon: Settings,     color: "text-purple-400", bg: "bg-purple-500/10" },
  general:      { icon: AlertTriangle,color: "text-gray-400",   bg: "bg-white/[0.05]"  },
}

function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function TopHeader() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [bellOpen, setBellOpen] = useState(false)
  const [notifs, setNotifs] = useState<AdminNotif[]>([])
  const [unread, setUnread] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifs = useCallback(async () => {
    try {
      const data = await apiFetch<AdminNotif[]>("/admin-notifications/?limit=15")
      setNotifs(data)
      setUnread(data.filter(n => !n.is_read).length)
    } catch { /* silent */ }
  }, [])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await apiFetch<{ count: number }>("/admin-notifications/unread-count")
      setUnread(data.count)
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30_000) // poll every 30s
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  // Load full list when bell opens
  useEffect(() => {
    if (bellOpen) fetchNotifs()
  }, [bellOpen, fetchNotifs])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBellOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markAllRead = async () => {
    try {
      await apiFetch("/admin-notifications/mark-all-read", { method: "PATCH" })
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnread(0)
    } catch { /* silent */ }
  }

  const markRead = async (id: number, link?: string | null) => {
    try {
      await apiFetch(`/admin-notifications/${id}/read`, { method: "PATCH" })
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnread(prev => Math.max(0, prev - 1))
    } catch { /* silent */ }
    if (link) {
      setBellOpen(false)
      navigate(link)
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-[70px] flex-shrink-0 items-center gap-x-4 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 shadow-[0_1px_0_0_rgba(255,255,255,0.04)]">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mr-2">
        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-1.5 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
          <img src={logoSvg} alt="FasalSathi" className="w-full h-full object-contain drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
        </div>
        <span className="text-sm font-bold text-white">Fasal<span className="text-emerald-400">Sathi</span></span>
      </div>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-500" />
          <input
            type="search"
            className="h-12 w-full max-w-lg bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all"
            placeholder="Search dashboard, users, schemes..."
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-x-3">
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setBellOpen(o => !o)}
              className="relative p-2.5 text-gray-400 hover:text-emerald-400 transition-colors rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {bellOpen && (
              <div className="absolute right-0 top-14 w-80 sm:w-96 bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Notifications</span>
                    {unread > 0 && (
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-full border border-rose-500/30">
                        {unread} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <button onClick={markAllRead} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                        <CheckCheck className="w-3 h-3" /> All read
                      </button>
                    )}
                    <button onClick={() => setBellOpen(false)} className="text-gray-500 hover:text-white transition-colors p-0.5">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto scrollbar-hide divide-y divide-white/5">
                  {notifs.length === 0 ? (
                    <div className="py-10 text-center text-gray-600 text-sm">No notifications yet</div>
                  ) : (
                    notifs.map(notif => {
                      const cfg = CATEGORY_ICON[notif.category] ?? CATEGORY_ICON.general
                      return (
                        <button
                          key={notif.id}
                          onClick={() => markRead(notif.id, notif.link)}
                          className={`w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors ${!notif.is_read ? "bg-white/[0.02]" : ""}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                            <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!notif.is_read ? "text-white font-medium" : "text-gray-400"}`}>
                              {notif.title}
                            </p>
                            {notif.message && (
                              <p className="text-xs text-gray-600 mt-0.5 truncate">{notif.message}</p>
                            )}
                            <p className="text-xs text-gray-600 mt-1">{relativeTime(notif.created_at)}</p>
                          </div>
                          {!notif.is_read && (
                            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                          )}
                        </button>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-white/10">
                  <button onClick={() => { setBellOpen(false); navigate("/notifications") }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                    View all alerts →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Admin profile — with FasalSathi logo */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer border border-transparent hover:border-emerald-500/20 group">
            {/* Logo avatar */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-emerald-500/20 blur-sm group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(52,211,153,0.25)] group-hover:shadow-[0_0_18px_rgba(52,211,153,0.4)] transition-all">
                <img
                  src={logoSvg}
                  alt="Admin"
                  className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                />
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-white leading-none group-hover:text-emerald-400 transition-colors">Admin</p>
              <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold tracking-[0.12em] uppercase">System Operator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

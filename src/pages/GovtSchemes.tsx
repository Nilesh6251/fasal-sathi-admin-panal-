/**
 * GovtSchemes.tsx — Admin view of all government schemes.
 * Connected to the new /api/schemes API (from the previous session).
 * Replaces the old hardcoded local-state version.
 */
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck, Plus, ExternalLink, Search, Filter, RefreshCw,
  PlayCircle, Clock, Archive, Pencil, Trash2, Copy, Loader2, CheckCircle2
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../hooks/useApi"
import { toast } from "../components/ui/Toast"
import Skeleton from "../components/ui/Skeleton"
import EmptyState from "../components/ui/EmptyState"
import SchemeModal from "../components/schemes/SchemeModal"
import type { Scheme } from "../components/schemes/SchemeModal"

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; icon: any; pill: string; dot: string }> = {
  running:  { label: "Running",  icon: PlayCircle,    pill: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  upcoming: { label: "Upcoming", icon: Clock,         pill: "bg-blue-500/15 text-blue-400 border-blue-500/30",         dot: "bg-blue-400" },
  ended:    { label: "Ended",    icon: Archive,       pill: "bg-gray-500/15 text-gray-500 border-gray-500/20",         dot: "bg-gray-500" },
}

// ── Confirm dialog ─────────────────────────────────────────────────────────────
function Confirm({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
        <p className="text-white font-medium text-sm">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function GovtSchemes() {
  const navigate = useNavigate()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "running" | "upcoming" | "ended">("all")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [actionId, setActionId] = useState<number | null>(null)

  const fetchSchemes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status_filter", statusFilter)
      const data = await apiFetch<Scheme[]>(`/schemes/?${params}`)
      setSchemes(data)
    } catch (e: any) {
      toast.error("Failed to load schemes", e.message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchSchemes() }, [fetchSchemes])

  const filtered = schemes.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.short_description || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.state || "").toLowerCase().includes(search.toLowerCase())
  )

  // Counts by status
  const counts = schemes.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc }, {} as Record<string, number>)

  const handleDelete = async (id: number) => {
    setActionId(id)
    try {
      await apiFetch(`/schemes/${id}`, { method: "DELETE" })
      setSchemes(prev => prev.filter(s => s.id !== id))
      toast.success("Scheme deleted")
    } catch (e: any) {
      toast.error("Delete failed", e.message)
    } finally {
      setActionId(null)
      setDeleteId(null)
    }
  }

  const handleDuplicate = (scheme: Scheme) => {
    const prefill = {
      name: `${scheme.name} (Copy)`,
      short_description: scheme.short_description,
      full_description: scheme.full_description || "",
      gender: scheme.gender || "all",
      caste: scheme.caste || "all",
      state: scheme.state || "All India",
      min_age: scheme.min_age ? String(scheme.min_age) : "",
      max_age: scheme.max_age ? String(scheme.max_age) : "",
      apply_link: scheme.apply_link || "",
      status: "upcoming",
      start_date: "", last_date_to_apply: "", end_date: "",
    }
    localStorage.setItem("scheme_prefill", JSON.stringify(prefill))
    toast.info("Duplicating", "Pre-filled form opened.")
    navigate("/schemes/add")
  }

  const expiringSoon = schemes.filter(s => {
    if (s.status !== "running" || !s.end_date) return false
    const diff = new Date(s.end_date).getTime() - Date.now()
    return diff > 0 && diff < 7 * 86400 * 1000
  }).length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Government Schemes</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {schemes.length} total schemes
            {expiringSoon > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full animate-pulse">
                {expiringSoon} expiring soon
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSchemes} className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => navigate("/schemes/add")}
            className="flex items-center gap-2 bg-emerald-500 text-black font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 text-sm">
            <Plus className="w-4 h-4" /> Add Scheme
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(["all", "running", "upcoming", "ended"] as const).map(s => {
          const active = statusFilter === s
          const cfg = s !== "all" ? STATUS_CFG[s] : null
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                active
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : "border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 bg-transparent"
              }`}
            >
              {cfg && <cfg.icon className="w-3.5 h-3.5" />}
              {s === "all" ? "All Schemes" : STATUS_CFG[s].label}
              {s !== "all" && counts[s] !== undefined && (
                <span className="px-1.5 py-0.5 bg-white/10 rounded-full text-xs">{counts[s] || 0}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, description, state..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton.Card key={i} lines={4} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={search ? "No schemes match your search" : `No ${statusFilter === "all" ? "" : statusFilter} schemes`}
          description={search ? "Try different keywords" : "Add a new scheme to get started"}
          action={!search ? { label: "Add Scheme", onClick: () => navigate("/schemes/add") } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((scheme, i) => {
              const cfg = STATUS_CFG[scheme.status] ?? STATUS_CFG.ended
              const isExpiring = scheme.status === "running" && scheme.end_date &&
                (new Date(scheme.end_date).getTime() - Date.now()) < 7 * 86400 * 1000

              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className={`glass-panel rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group ${
                    isExpiring ? "border-amber-500/20 hover:border-amber-500/40" : "border-white/5 hover:border-emerald-500/20"
                  }`}
                >
                  {/* Banner */}
                  <div className="relative h-28 overflow-hidden">
                    {scheme.banner_image ? (
                      <img src={`http://localhost:5000/${scheme.banner_image}`} alt={scheme.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-950/40 via-black to-purple-950/20 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-emerald-500/20" />
                      </div>
                    )}
                    {/* Expiring warning overlay */}
                    {isExpiring && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500/30 backdrop-blur border border-amber-500/40 rounded-lg text-[10px] font-bold text-amber-400">
                        ⚠ Expiring Soon
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur ${cfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    {/* State badge */}
                    {scheme.state && (
                      <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-lg">{scheme.state}</span>
                    )}

                    <div>
                      <h3 className="font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">{scheme.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scheme.short_description}</p>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between text-[10px] text-gray-600 pt-1 border-t border-white/5">
                      <span>Apply by: <span className="text-gray-400 font-medium">{scheme.last_date_to_apply || "—"}</span></span>
                      <span>Ends: <span className="text-gray-400 font-medium">{scheme.end_date || "—"}</span></span>
                    </div>

                    {/* Eligibility pills */}
                    {(scheme.gender && scheme.gender !== "all") || (scheme.caste && scheme.caste !== "all") || scheme.min_age ? (
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.gender && scheme.gender !== "all" && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 capitalize">{scheme.gender}</span>
                        )}
                        {scheme.caste && scheme.caste !== "all" && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 uppercase">{scheme.caste}</span>
                        )}
                        {scheme.min_age && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400">
                            Age {scheme.min_age}–{scheme.max_age || "∞"}
                          </span>
                        )}
                      </div>
                    ) : null}

                    {/* Action bar */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => { setSelectedScheme(scheme); setModalMode("view") }}
                        className="flex-1 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                        View
                      </button>
                      <button onClick={() => { setSelectedScheme(scheme); setModalMode("edit") }}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDuplicate(scheme)}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                        title="Duplicate">
                        <Copy className="w-3 h-3" />
                      </button>
                      {scheme.apply_link && (
                        <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-400 hover:text-purple-400 hover:border-purple-500/30 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button onClick={() => setDeleteId(scheme.id)} disabled={actionId === scheme.id}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                        {actionId === scheme.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          mode={modalMode}
          onClose={() => setSelectedScheme(null)}
          onSaved={(updated) => {
            setSchemes(prev => prev.map(s => s.id === updated.id ? updated : s))
          }}
        />
      )}
      <AnimatePresence>
        {deleteId && (
          <Confirm
            message="Delete this scheme permanently? This cannot be undone."
            onConfirm={() => handleDelete(deleteId)}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

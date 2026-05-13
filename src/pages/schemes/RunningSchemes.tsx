import { useState, useEffect, useCallback } from "react"
import { Search, Pencil, Trash2, CheckCircle2, Filter, RefreshCw, Plus, Loader2, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../hooks/useApi"
import { toast } from "../../components/ui/Toast"
import SchemeModal, { type Scheme } from "../../components/schemes/SchemeModal"

const STATUS_PILL = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
        <p className="text-white font-medium">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors font-medium">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Confirm</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function RunningSchemes() {
  const navigate = useNavigate()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("All")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [confirmEnd, setConfirmEnd] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchSchemes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch<Scheme[]>("/schemes/?status_filter=running")
      setSchemes(data)
    } catch (e: any) {
      toast.error("Failed to load schemes", e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSchemes() }, [fetchSchemes])

  const filtered = schemes.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.short_description.toLowerCase().includes(search.toLowerCase())
    const matchState = stateFilter === "All" || s.state === stateFilter
    return matchSearch && matchState
  })

  const uniqueStates = ["All", ...new Set(schemes.map(s => s.state || "All India").filter(Boolean))]

  const handleDelete = async (id: number) => {
    setActionLoading(id)
    try {
      await apiFetch(`/schemes/${id}`, { method: "DELETE" })
      setSchemes(prev => prev.filter(s => s.id !== id))
      toast.success("Scheme deleted")
    } catch (e: any) {
      toast.error("Delete failed", e.message)
    } finally {
      setActionLoading(null)
      setConfirmDelete(null)
    }
  }

  const handleMarkEnded = async (id: number) => {
    setActionLoading(id)
    try {
      const updated = await apiFetch<Scheme>(`/schemes/${id}/end`, { method: "PATCH" })
      setSchemes(prev => prev.filter(s => s.id !== id))
      toast.success("Scheme marked as ended", `"${updated.name}" has been closed.`)
    } catch (e: any) {
      toast.error("Failed", e.message)
    } finally {
      setActionLoading(null)
      setConfirmEnd(null)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Running Schemes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{schemes.length} active scheme{schemes.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSchemes} className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => navigate("/schemes/add")}
            className="flex items-center gap-2 bg-emerald-500 text-black font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 text-sm">
            <Plus className="w-4 h-4" /> Add Scheme
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemes..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none min-w-[160px]">
            {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-600">
          <ShieldCheck className="w-10 h-10" />
          <p className="text-sm">No running schemes found</p>
          <button onClick={() => navigate("/schemes/add")} className="text-emerald-400 text-sm hover:underline">Add one now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((scheme, i) => (
              <motion.div key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all duration-300 group overflow-hidden"
              >
                {/* Banner */}
                {scheme.banner_image ? (
                  <div className="h-32 overflow-hidden">
                    <img src={`http://localhost:5000/${scheme.banner_image}`} alt={scheme.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-emerald-950/40 to-black flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-500/40" />
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {/* Status badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_PILL}`}>● Running</span>
                    {scheme.state && (
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{scheme.state}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">{scheme.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scheme.short_description}</p>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Apply by: <span className="text-gray-400 font-medium">{scheme.last_date_to_apply || "—"}</span></span>
                    <span>Ends: <span className="text-gray-400 font-medium">{scheme.end_date || "—"}</span></span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => { setSelectedScheme(scheme); setModalMode("view") }}
                      className="flex-1 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                      View
                    </button>
                    <button onClick={() => { setSelectedScheme(scheme); setModalMode("edit") }}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => setConfirmEnd(scheme.id)} disabled={actionLoading === scheme.id}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50">
                      {actionLoading === scheme.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <button onClick={() => setConfirmDelete(scheme.id)} disabled={actionLoading === scheme.id}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                      {actionLoading === scheme.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      {selectedScheme && (
        <SchemeModal scheme={selectedScheme} mode={modalMode} onClose={() => setSelectedScheme(null)}
          onSaved={(updated) => {
            setSchemes(prev => prev.map(s => s.id === updated.id ? updated : s))
            if (updated.status !== "running") setSchemes(prev => prev.filter(s => s.id !== updated.id))
          }} />
      )}

      <AnimatePresence>
        {confirmDelete && (
          <ConfirmDialog
            message="Delete this scheme permanently? This cannot be undone."
            onConfirm={() => handleDelete(confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
        {confirmEnd && (
          <ConfirmDialog
            message="Mark this scheme as ended? It will move to Previous Schemes."
            onConfirm={() => handleMarkEnded(confirmEnd)}
            onCancel={() => setConfirmEnd(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

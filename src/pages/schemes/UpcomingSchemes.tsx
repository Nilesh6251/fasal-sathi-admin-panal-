import { useState, useEffect, useCallback } from "react"
import { Search, CalendarDays, Zap, RefreshCw, Plus, Loader2, Clock, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../hooks/useApi"
import { toast } from "../../components/ui/Toast"
import SchemeModal, { type Scheme } from "../../components/schemes/SchemeModal"

export default function UpcomingSchemes() {
  const navigate = useNavigate()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [publishingId, setPublishingId] = useState<number | null>(null)

  const fetchSchemes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch<Scheme[]>("/schemes/?status_filter=upcoming")
      setSchemes(data)
    } catch (e: any) {
      toast.error("Failed to load schemes", e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSchemes() }, [fetchSchemes])

  const filtered = schemes.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.short_description.toLowerCase().includes(search.toLowerCase())
  )

  const handlePublish = async (scheme: Scheme) => {
    setPublishingId(scheme.id)
    try {
      const updated = await apiFetch<Scheme>(`/schemes/${scheme.id}/publish`, { method: "PATCH" })
      setSchemes(prev => prev.filter(s => s.id !== scheme.id))
      toast.success("Scheme published!", `"${updated.name}" is now running.`)
    } catch (e: any) {
      toast.error("Publish failed", e.message)
    } finally {
      setPublishingId(null)
    }
  }

  const daysUntil = (dateStr?: string): number | null => {
    if (!dateStr) return null
    const diff = new Date(dateStr).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Upcoming Schemes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{schemes.length} scheme{schemes.length !== 1 ? "s" : ""} scheduled</p>
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search upcoming schemes..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-600">
          <Clock className="w-10 h-10" />
          <p className="text-sm">No upcoming schemes</p>
          <button onClick={() => navigate("/schemes/add")} className="text-blue-400 text-sm hover:underline">Schedule one now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((scheme, i) => {
              const days = daysUntil(scheme.start_date)
              return (
                <motion.div key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all duration-300 group overflow-hidden"
                >
                  {/* Banner / countdown */}
                  <div className="relative h-32 bg-gradient-to-br from-blue-950/40 via-purple-950/20 to-black overflow-hidden flex items-center justify-center">
                    {scheme.banner_image ? (
                      <img src={`http://localhost:5000/${scheme.banner_image}`} alt={scheme.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    ) : null}
                    <div className="relative text-center">
                      {days !== null ? (
                        <>
                          <p className="text-4xl font-bold text-white">{days}</p>
                          <p className="text-xs text-blue-400">days until launch</p>
                        </>
                      ) : (
                        <ShieldCheck className="w-8 h-8 text-blue-500/40" />
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-500/15 text-blue-400 border-blue-500/30">⏳ Upcoming</span>
                      {scheme.state && <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{scheme.state}</span>}
                    </div>

                    <div>
                      <h3 className="font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{scheme.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scheme.short_description}</p>
                    </div>

                    {/* Dates */}
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3 h-3" />
                        <span>Starts: <span className="text-gray-400 font-medium">{scheme.start_date || "TBD"}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3 h-3" />
                        <span>Apply by: <span className="text-gray-400 font-medium">{scheme.last_date_to_apply || "TBD"}</span></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => { setSelectedScheme(scheme); setModalMode("edit") }}
                        className="flex-1 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                        Edit Dates
                      </button>
                      <button onClick={() => handlePublish(scheme)} disabled={publishingId === scheme.id}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">
                        {publishingId === scheme.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        Publish Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {selectedScheme && (
        <SchemeModal scheme={selectedScheme} mode={modalMode} onClose={() => setSelectedScheme(null)}
          onSaved={(updated) => {
            setSchemes(prev => prev.map(s => s.id === updated.id ? updated : s))
            if (updated.status !== "upcoming") setSchemes(prev => prev.filter(s => s.id !== updated.id))
          }} />
      )}
    </motion.div>
  )
}

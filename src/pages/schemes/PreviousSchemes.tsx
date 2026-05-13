import { useState, useEffect, useCallback } from "react"
import { Search, Eye, Copy, RefreshCw, Plus, Archive, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../hooks/useApi"
import { toast } from "../../components/ui/Toast"
import SchemeModal, { type Scheme } from "../../components/schemes/SchemeModal"

export default function PreviousSchemes() {
  const navigate = useNavigate()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)

  const fetchSchemes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch<Scheme[]>("/schemes/?status_filter=ended")
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
    (s.state || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleDuplicate = async (scheme: Scheme) => {
    // Navigate to AddScheme with pre-filled state via localStorage
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
    toast.info("Duplicating scheme", "Pre-filling the Add Scheme form...")
    navigate("/schemes/add")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Previous Schemes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{schemes.length} ended scheme{schemes.length !== 1 ? "s" : ""}</p>
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
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search previous schemes..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500/50 transition-all" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-t-2 border-gray-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-r-2 border-gray-600 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-600">
          <Archive className="w-10 h-10" />
          <p className="text-sm">No previous schemes found</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-gray-500 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Scheme</th>
                  <th className="px-6 py-4 font-medium">State</th>
                  <th className="px-6 py-4 font-medium">Eligibility</th>
                  <th className="px-6 py-4 font-medium">Ended</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filtered.map((scheme) => (
                    <motion.tr key={scheme.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {scheme.banner_image ? (
                            <img src={`http://localhost:5000/${scheme.banner_image}`} alt="" className="w-10 h-10 rounded-lg object-cover opacity-60" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                              <ShieldCheck className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">{scheme.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{scheme.short_description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-xs bg-white/5 px-2 py-1 rounded-lg">{scheme.state || "All India"}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 space-y-0.5">
                        {scheme.gender && scheme.gender !== "all" && <div className="capitalize">👤 {scheme.gender}</div>}
                        {scheme.caste && scheme.caste !== "all" && <div className="uppercase">📋 {scheme.caste}</div>}
                        {scheme.min_age && <div>Age: {scheme.min_age}–{scheme.max_age || "∞"}</div>}
                        {!scheme.gender && !scheme.caste && !scheme.min_age && <span className="text-gray-600">All eligible</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500">
                          {scheme.end_date || scheme.updated_at?.split("T")[0] || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedScheme(scheme)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                            <Eye className="w-3 h-3" /> View
                          </button>
                          <button onClick={() => handleDuplicate(scheme)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                            <Copy className="w-3 h-3" /> Duplicate
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedScheme && (
        <SchemeModal scheme={selectedScheme} mode="view" onClose={() => setSelectedScheme(null)} />
      )}
    </motion.div>
  )
}

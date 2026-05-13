import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutGrid, Search, RefreshCw, Filter, MapPin, ChevronLeft, ChevronRight,
  Sprout, ShieldCheck, CheckCircle2, Loader2, Phone, Wheat
} from "lucide-react"
import { apiFetch } from "../hooks/useApi"
import { toast } from "../components/ui/Toast"
import Skeleton from "../components/ui/Skeleton"
import EmptyState from "../components/ui/EmptyState"

interface Farm {
  id: number
  farm_name: string
  owner_name: string
  owner_phone: string | null
  location: string | null
  state: string | null
  district: string | null
  area_acres: number | null
  primary_crop: string | null
  soil_type: string | null
  is_verified: boolean
  registered_at: string
}
interface FarmsResponse { total: number; page: number; pages: number; data: Farm[] }
interface FarmStats {
  total: number
  verified: number
  by_state: { state: string; count: number }[]
  top_crops: { crop: string; count: number }[]
}

const SOIL_COLORS: Record<string, string> = {
  loam:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
  clay:  "text-orange-400 bg-orange-500/10 border-orange-500/20",
  sandy: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  silt:  "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
}

export default function FarmManagement() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [stats, setStats] = useState<FarmStats | null>(null)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState<"" | "true" | "false">("")
  const [actionId, setActionId] = useState<number | null>(null)
  const [view, setView] = useState<"table" | "grid">("table")
  const PAGE_SIZE = 15

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiFetch<FarmStats>("/farms/stats")
      setStats(data)
    } catch { /* silent */ }
  }, [])

  const fetchFarms = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page), page_size: String(PAGE_SIZE),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(stateFilter && { state: stateFilter }),
        ...(verifiedFilter && { is_verified: verifiedFilter }),
      })
      const data = await apiFetch<FarmsResponse>(`/farms/?${params}`)
      setFarms(data.data)
      setTotal(data.total)
      setPages(data.pages)
    } catch (e: any) {
      toast.error("Failed to load farms", e.message)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, stateFilter, verifiedFilter])

  useEffect(() => { fetchStats(); fetchFarms() }, [fetchStats, fetchFarms])

  const verifyFarm = async (farm: Farm) => {
    setActionId(farm.id)
    try {
      await apiFetch(`/farms/${farm.id}/verify`, { method: "PATCH" })
      setFarms(prev => prev.map(f => f.id === farm.id ? { ...f, is_verified: true } : f))
      if (stats) setStats(prev => prev ? { ...prev, verified: prev.verified + 1 } : prev)
      toast.success("Farm verified!", `${farm.farm_name} is now verified.`)
    } catch (e: any) {
      toast.error("Verification failed", e.message)
    } finally {
      setActionId(null)
    }
  }

  const uniqueStates = stats?.by_state.map(b => b.state) ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Farm Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} registered farms on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex border border-white/10 rounded-xl overflow-hidden">
            <button onClick={() => setView("table")} className={`px-3 py-2 text-xs font-medium transition-colors ${view === "table" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-500 hover:text-white"}`}>Table</button>
            <button onClick={() => setView("grid")} className={`px-3 py-2 text-xs font-medium transition-colors ${view === "grid" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-500 hover:text-white"}`}>Grid</button>
          </div>
          <button onClick={() => { fetchFarms(); fetchStats() }} className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Farms",    value: stats?.total ?? "—",    color: "text-white",         icon: LayoutGrid },
          { label: "Verified",       value: stats?.verified ?? "—", color: "text-emerald-400",   icon: CheckCircle2 },
          { label: "Top Crop",       value: stats?.top_crops[0]?.crop ?? "—", color: "text-amber-400", icon: Wheat },
          { label: "States Covered", value: stats?.by_state.length ?? "—",   color: "text-blue-400",  icon: MapPin },
        ].map(stat => (
          <div key={stat.label} className="glass-panel rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top crops breakdown */}
      {stats && stats.top_crops.length > 0 && (
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Top Crops by Farm Count</h3>
          <div className="space-y-3">
            {stats.top_crops.map((c, i) => {
              const max = stats.top_crops[0]?.count ?? 1
              const pct = Math.round((c.count / max) * 100)
              const colors = ["bg-amber-400", "bg-emerald-400", "bg-blue-400", "bg-purple-400", "bg-rose-400"]
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-20 truncate">{c.crop}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, type: "spring" }}
                      className={`h-full rounded-full ${colors[i % colors.length]}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-400 w-8 text-right">{c.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search farm name, owner, location..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1) }}
            className="pl-9 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none min-w-[160px]">
            <option value="">All States</option>
            {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <select value={verifiedFilter} onChange={e => { setVerifiedFilter(e.target.value as any); setPage(1) }}
            className="pl-9 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none min-w-[140px]">
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-gray-500 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Farm</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Crop / Area</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <Skeleton.TableRow key={i} cols={6} />)
                ) : farms.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState icon={LayoutGrid} title="No farms found" description="Farms registered via the farmer app will appear here" />
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {farms.map(farm => (
                      <motion.tr key={farm.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                              <Sprout className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="font-medium text-white">{farm.farm_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-300">{farm.owner_name}</p>
                          {farm.owner_phone && (
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5" /> {farm.owner_phone}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {farm.state && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                              {farm.district ? `${farm.district}, ` : ""}{farm.state}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 space-y-0.5">
                          {farm.primary_crop && <div className="text-gray-300">{farm.primary_crop}</div>}
                          {farm.area_acres && <div>{farm.area_acres} acres</div>}
                          {farm.soil_type && (
                            <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${SOIL_COLORS[farm.soil_type] ?? "text-gray-400 bg-white/5 border-white/10"}`}>
                              {farm.soil_type}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {farm.is_verified ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!farm.is_verified && (
                            <button onClick={() => verifyFarm(farm)} disabled={actionId === farm.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 ml-auto bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 transition-colors">
                              {actionId === farm.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                              Verify
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <p className="text-xs text-gray-500">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, pages - 4)) + i
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === p ? "bg-emerald-500 text-black" : "border border-white/10 text-gray-400 hover:text-white"}`}>
                      {p}
                    </button>
                  )
                })}
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton.Card key={i} lines={4} />)}
          </div>
        ) : farms.length === 0 ? (
          <EmptyState icon={LayoutGrid} title="No farms found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {farms.map((farm, i) => (
                <motion.div key={farm.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                  className="glass-panel rounded-2xl border border-white/5 hover:border-emerald-500/20 p-5 space-y-4 transition-all duration-300 hover:-translate-y-0.5 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Sprout className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-sm">{farm.farm_name}</h3>
                        <p className="text-xs text-gray-500">{farm.owner_name}</p>
                      </div>
                    </div>
                    {farm.is_verified ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/30">✓ Verified</span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/30">Unverified</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    {farm.state && <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-purple-400" />{farm.state}</div>}
                    {farm.primary_crop && <div className="flex items-center gap-1"><Sprout className="w-3 h-3 text-emerald-400" />{farm.primary_crop}</div>}
                    {farm.area_acres && <div>{farm.area_acres} acres</div>}
                    {farm.owner_phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{farm.owner_phone}</div>}
                  </div>

                  {!farm.is_verified && (
                    <button onClick={() => verifyFarm(farm)} disabled={actionId === farm.id}
                      className="w-full py-2 text-xs font-bold rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                      {actionId === farm.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                      Verify Farm
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      )}
    </motion.div>
  )
}

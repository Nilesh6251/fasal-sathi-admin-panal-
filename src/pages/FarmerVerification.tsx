import { useState, useEffect, useCallback } from "react"
import { CheckCircle2, XCircle, Eye, RefreshCw, Shield, Search, Filter, Phone, Mail, MapPin, UserCheck, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "../hooks/useApi"
import { toast } from "../components/ui/Toast"

interface FarmerRecord {
  id: number
  farmer_name: string
  phone?: string
  email?: string
  location?: string
  farmer_id_image?: string
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  reviewed_at?: string
}

const STATUS_CONFIG: Record<string, { label: string; pill: string; icon: JSX.Element }> = {
  pending: { label: "Pending", pill: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: <Shield className="w-3.5 h-3.5" /> },
  approved: { label: "Approved", pill: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", pill: "bg-red-500/15 text-red-400 border-red-500/30", icon: <XCircle className="w-3.5 h-3.5" /> },
}

function IDImageModal({ record, onClose }: { record: FarmerRecord; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">{record.farmer_name} — Farmer ID</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {record.farmer_id_image ? (
          <img src={`http://localhost:5000/${record.farmer_id_image}`} alt="Farmer ID"
            className="w-full rounded-xl border border-white/10 object-contain max-h-64" />
        ) : (
          <div className="h-48 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-600 text-sm">
            No ID image uploaded
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {record.phone && (
            <div className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4 text-emerald-400" /> {record.phone}</div>
          )}
          {record.email && (
            <div className="flex items-center gap-2 text-gray-400"><Mail className="w-4 h-4 text-blue-400" /> {record.email}</div>
          )}
          {record.location && (
            <div className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4 text-purple-400" /> {record.location}</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function FarmerVerification() {
  const [records, setRecords] = useState<FarmerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [viewRecord, setViewRecord] = useState<FarmerRecord | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const path = statusFilter === "all" ? "/farmers/" : `/farmers/?status_filter=${statusFilter}`
      const data = await apiFetch<FarmerRecord[]>(path)
      setRecords(data)
    } catch (e: any) {
      toast.error("Failed to load records", e.message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const filtered = records.filter(r =>
    r.farmer_name.toLowerCase().includes(search.toLowerCase()) ||
    (r.phone || "").includes(search) ||
    (r.location || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (id: number) => {
    setActionLoading(id)
    try {
      const updated = await apiFetch<FarmerRecord>(`/farmers/${id}/approve`, { method: "PATCH" })
      setRecords(prev => prev.map(r => r.id === id ? updated : r))
      toast.success("Farmer approved!", `${updated.farmer_name} is now verified.`)
    } catch (e: any) {
      toast.error("Approve failed", e.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: number) => {
    setActionLoading(id)
    try {
      const updated = await apiFetch<FarmerRecord>(`/farmers/${id}/reject`, { method: "PATCH" })
      setRecords(prev => prev.map(r => r.id === id ? updated : r))
      toast.warning("Farmer rejected", `${updated.farmer_name}'s verification was rejected.`)
    } catch (e: any) {
      toast.error("Reject failed", e.message)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingCount = records.filter(r => r.status === "pending").length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">Farmer Verification</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full animate-pulse">
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-0.5">Review and verify farmer identity documents</p>
        </div>
        <button onClick={fetchRecords} className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {(["pending", "approved", "rejected"] as const).map(s => {
          const count = records.filter(r => r.status === s).length
          const cfg = STATUS_CONFIG[s]
          return (
            <button key={s} onClick={() => setStatusFilter(prev => prev === s ? "all" : s)}
              className={`glass-panel rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                statusFilter === s ? `border-current ${cfg.pill.split(" ")[1]}` : "border-white/5 hover:border-white/10"
              }`}>
              <p className={`text-2xl font-bold ${cfg.pill.split(" ")[1]}`}>{count}</p>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">{s}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, location..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
            className="pl-9 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none min-w-[140px]">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-gray-500 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Farmer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Submitted</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-600">
                      <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>No records found</p>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filtered.map(record => (
                      <motion.tr key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                              {record.farmer_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-white">{record.farmer_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs space-y-1">
                          {record.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {record.phone}</div>}
                          {record.email && <div className="flex items-center gap-1 truncate max-w-[160px]"><Mail className="w-3 h-3" /> {record.email}</div>}
                        </td>
                        <td className="px-6 py-4">
                          {record.location ? (
                            <div className="flex items-center gap-1 text-gray-400 text-sm"><MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" /> {record.location}</div>
                          ) : <span className="text-gray-600">—</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(record.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[record.status].pill}`}>
                            {STATUS_CONFIG[record.status].icon}
                            {STATUS_CONFIG[record.status].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {/* View ID */}
                            <button onClick={() => setViewRecord(record)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                              <Eye className="w-3 h-3" /> ID
                            </button>
                            {/* Approve / Reject — only for pending */}
                            {record.status === "pending" && (
                              <>
                                <button onClick={() => handleApprove(record.id)} disabled={actionLoading === record.id}
                                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50">
                                  {actionLoading === record.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                  Approve
                                </button>
                                <button onClick={() => handleReject(record.id)} disabled={actionLoading === record.id}
                                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                                  {actionLoading === record.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ID Image Modal */}
      <AnimatePresence>
        {viewRecord && <IDImageModal record={viewRecord} onClose={() => setViewRecord(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}

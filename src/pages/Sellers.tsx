import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Store, CheckCircle2, Clock, RefreshCw, Search, Loader2, ShieldCheck, X } from "lucide-react"
import { apiFetch } from "../hooks/useApi"
import { toast } from "../components/ui/Toast"
import Skeleton from "../components/ui/Skeleton"
import EmptyState from "../components/ui/EmptyState"

interface Seller {
  id: string
  businessName: string
  gstNumber: string | null
  isApproved: boolean
  user?: { name: string; phone: string; email?: string }
}

interface ApiResponse { success: boolean; data: Seller[] }

export default function Sellers() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const fetchSellers = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("http://localhost:5000/api/sellers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: ApiResponse = await res.json()
      if (data.success) setSellers(data.data)
    } catch { toast.error("Failed to load sellers") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchSellers() }, [fetchSellers])

  const handleApprove = async (id: string, approve: boolean) => {
    setActionLoading(id)
    try {
      const token = localStorage.getItem("admin_token")
      await fetch(`http://localhost:5000/api/sellers/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approve }),
      })
      setSellers(prev => prev.map(s => s.id === id ? { ...s, isApproved: approve } : s))
      toast.success(approve ? "Seller approved" : "Seller access revoked")
    } catch { toast.error("Action failed") }
    finally { setActionLoading(null) }
  }

  const filtered = sellers.filter(s =>
    s.businessName.toLowerCase().includes(search.toLowerCase()) ||
    (s.user?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.gstNumber ?? "").includes(search)
  )

  const approved = sellers.filter(s => s.isApproved).length
  const pending = sellers.filter(s => !s.isApproved).length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Seller Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage marketplace sellers and verify their businesses</p>
        </div>
        <button onClick={fetchSellers} className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Sellers", value: sellers.length, color: "text-white" },
          { label: "Verified",      value: approved,       color: "text-emerald-400" },
          { label: "Pending",       value: pending,        color: "text-amber-400" },
        ].map(stat => (
          <div key={stat.label} className="glass-panel rounded-xl p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search sellers, GST, owner..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Business</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">GST Number</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton.TableRow key={i} cols={5} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Store}
                      title="No sellers found"
                      description={search ? "Try a different search term" : "Sellers registered on the mobile app will appear here"}
                    />
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map(seller => (
                    <motion.tr
                      key={seller.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Store className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="font-medium text-white">{seller.businessName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300 font-medium">{seller.user?.name ?? "—"}</p>
                        <p className="text-xs text-gray-600">{seller.user?.phone ?? ""}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {seller.gstNumber ?? "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {seller.isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!seller.isApproved ? (
                          <button
                            onClick={() => handleApprove(seller.id, true)}
                            disabled={actionLoading === seller.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 ml-auto"
                          >
                            {actionLoading === seller.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(seller.id, false)}
                            disabled={actionLoading === seller.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg hover:bg-rose-500/20 transition-colors disabled:opacity-50 ml-auto"
                          >
                            {actionLoading === seller.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                            Revoke
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
      </div>
    </motion.div>
  )
}

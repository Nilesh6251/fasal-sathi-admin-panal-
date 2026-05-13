import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Search, RefreshCw, ChevronLeft, ChevronRight,
  UserCheck, UserX, Trash2, Loader2, Filter, ShieldCheck
} from "lucide-react"
import { apiFetch } from "../hooks/useApi"
import { toast } from "../components/ui/Toast"
import Skeleton from "../components/ui/Skeleton"
import EmptyState from "../components/ui/EmptyState"

interface User {
  id: number
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}
interface UsersResponse {
  total: number; page: number; pages: number; page_size: number; data: User[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [actionId, setActionId] = useState<number | null>(null)
  const PAGE_SIZE = 15

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleFilter && { role: roleFilter }),
      })
      const data = await apiFetch<UsersResponse>(`/users/?${params}`)
      setUsers(data.data)
      setTotal(data.total)
      setPages(data.pages)
    } catch (e: any) {
      toast.error("Failed to load users", e.message)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, roleFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const toggleActive = async (user: User) => {
    setActionId(user.id)
    try {
      const updated = await apiFetch<{ id: number; is_active: boolean }>(`/users/${user.id}/toggle-active`, { method: "PATCH" })
      setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, is_active: updated.is_active } : u))
      toast.success(updated.is_active ? "User activated" : "User deactivated")
    } catch (e: any) {
      toast.error("Action failed", e.message)
    } finally {
      setActionId(null)
    }
  }

  const deleteUser = async (user: User) => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
    setActionId(user.id)
    try {
      await apiFetch(`/users/${user.id}`, { method: "DELETE" })
      setUsers(prev => prev.filter(u => u.id !== user.id))
      setTotal(t => t - 1)
      toast.success("User deleted")
    } catch (e: any) {
      toast.error("Delete failed", e.message)
    } finally {
      setActionId(null)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total registered users</p>
        </div>
        <button onClick={fetchUsers} className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
            className="pl-9 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none min-w-[140px]">
            <option value="">All Roles</option>
            <option value="user">Farmers</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <Skeleton.TableRow key={i} cols={5} />)
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Users} title="No users found"
                      description={debouncedSearch ? "Try a different search" : "Users registered via the app will appear here"} />
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {users.map(user => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-sm flex-shrink-0">
                            {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${
                          user.role === "admin"  ? "bg-purple-500/15 text-purple-400 border-purple-500/30" :
                          user.role === "seller" ? "bg-blue-500/15 text-blue-400 border-blue-500/30" :
                          "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        }`}>
                          {user.role === "user" ? "Farmer" : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          user.is_active
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-gray-500/15 text-gray-500 border-gray-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-400" : "bg-gray-500"}`} />
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toggleActive(user)} disabled={actionId === user.id}
                            title={user.is_active ? "Deactivate" : "Activate"}
                            className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
                              user.is_active
                                ? "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                                : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                            }`}>
                            {actionId === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                              user.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                          {user.role !== "admin" && (
                            <button onClick={() => deleteUser(user)} disabled={actionId === user.id}
                              className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                              {actionId === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
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

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, pages - 4)) + i
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      page === p ? "bg-emerald-500 text-black" : "border border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

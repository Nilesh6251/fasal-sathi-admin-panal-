import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Users, UserCheck, LayoutGrid, Sprout, ShieldCheck, Clock, AlertTriangle, TrendingUp,
  RefreshCw, ArrowRight, CheckCircle2, XCircle, MessageSquare, UserPlus, Shield
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { apiFetch } from "../hooks/useApi"
import Skeleton from "../components/ui/Skeleton"

// ---------- types ----------
interface Stats {
  total_users: number
  active_users: number
  verified_farmers: number
  pending_verifications: number
  total_farms: number
  total_crops: number
  running_schemes: number
  upcoming_schemes: number
  expiring_soon: number
  new_users_this_week: number
}
interface ChartPoint { month: string; users: number }
interface SchemePoint { status: string; count: number }
interface VerifPoint { pending: number; approved: number; rejected: number }
interface ActivityItem { type: string; title: string; time: string; category: string }

const SCHEME_COLORS = ["#60a5fa", "#34d399", "#9ca3af"]
const VERIF_COLORS = ["#fbbf24", "#34d399", "#f87171"]

// ---------- tooltip ----------
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111]/90 backdrop-blur border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
      {label && <p className="text-gray-400 mb-1 font-medium">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.stroke || p.fill || "#fff" }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

// ---------- stat card ----------
function StatCard({
  title, value, icon: Icon, color, subtitle, delay, linkTo
}: {
  title: string; value: string | number; icon: any; color: string; subtitle?: string; delay?: number; linkTo?: string
}) {
  const navigate = useNavigate()
  const colorMap: Record<string, { text: string; bg: string; glow: string; border: string }> = {
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", glow: "shadow-emerald-500/10", border: "hover:border-emerald-500/20" },
    blue:    { text: "text-blue-400",    bg: "bg-blue-500/10",    glow: "shadow-blue-500/10",    border: "hover:border-blue-500/20" },
    purple:  { text: "text-purple-400",  bg: "bg-purple-500/10",  glow: "shadow-purple-500/10",  border: "hover:border-purple-500/20" },
    rose:    { text: "text-rose-400",    bg: "bg-rose-500/10",    glow: "shadow-rose-500/10",    border: "hover:border-rose-500/20" },
    amber:   { text: "text-amber-400",   bg: "bg-amber-500/10",   glow: "shadow-amber-500/10",   border: "hover:border-amber-500/20" },
    cyan:    { text: "text-cyan-400",    bg: "bg-cyan-500/10",    glow: "shadow-cyan-500/10",    border: "hover:border-cyan-500/20" },
  }
  const s = colorMap[color] ?? colorMap.emerald
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (delay ?? 0) * 0.08 }}
      onClick={() => linkTo && navigate(linkTo)}
      className={`glass-card p-5 group cursor-pointer border border-white/[0.06] hover:border-opacity-100 ${s.border} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${s.glow} ${linkTo ? "cursor-pointer" : ""}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-1.5">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${s.bg} border border-white/5 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${s.text}`} />
        </div>
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          {subtitle}
          {linkTo && <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </p>
      )}
    </motion.div>
  )
}

// ---------- activity icon ----------
function ActivityIcon({ category }: { category: string }) {
  const map: Record<string, { icon: any; color: string; bg: string }> = {
    user:         { icon: UserPlus,     color: "text-blue-400",   bg: "bg-blue-500/10" },
    verification: { icon: Shield,       color: "text-amber-400",  bg: "bg-amber-500/10" },
    scheme:       { icon: ShieldCheck,  color: "text-emerald-400",bg: "bg-emerald-500/10" },
    general:      { icon: MessageSquare,color: "text-purple-400", bg: "bg-purple-500/10" },
  }
  const cfg = map[category] ?? map.general
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
      <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
    </div>
  )
}

// ---------- main dashboard ----------
export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [userGrowth, setUserGrowth] = useState<ChartPoint[]>([])
  const [schemeActivity, setSchemeActivity] = useState<SchemePoint[]>([])
  const [verifStats, setVerifStats] = useState<VerifPoint | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s, ug, sa, vs, ra] = await Promise.all([
        apiFetch<Stats>("/dashboard/stats"),
        apiFetch<ChartPoint[]>("/dashboard/user-growth"),
        apiFetch<SchemePoint[]>("/dashboard/scheme-activity"),
        apiFetch<VerifPoint>("/dashboard/verification-stats"),
        apiFetch<ActivityItem[]>("/dashboard/recent-activity"),
      ])
      setStats(s)
      setUserGrowth(ug)
      setSchemeActivity(sa)
      setVerifStats(vs)
      setRecentActivity(ra)
    } catch { /* errors handled gracefully */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const verifPieData = verifStats ? [
    { name: "Pending", value: verifStats.pending },
    { name: "Approved", value: verifStats.approved },
    { name: "Rejected", value: verifStats.rejected },
  ] : []

  return (
    <div className="space-y-7 pb-12">
      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-emerald-950/30 via-[#0A0A0A] to-purple-950/20 p-6 lg:p-8"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/8 rounded-full blur-[100px]" />
          <div className="absolute left-40 bottom-0 w-56 h-56 bg-purple-500/8 rounded-full blur-[80px]" />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Admin 👋</span>
            </h1>
            <p className="text-gray-400 mt-1.5 text-sm lg:text-base">
              {stats?.pending_verifications
                ? `${stats.pending_verifications} farmer verification${stats.pending_verifications > 1 ? "s" : ""} pending review.`
                : "System is operating normally. All services online."}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-300">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">Fasal Sathi Admin Panel</p>
            </div>
            <button
              onClick={fetchAll}
              className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              title="Refresh dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── 8 Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton.StatCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users"       value={stats?.total_users ?? 0}          icon={Users}       color="blue"    subtitle="All registered farmers & sellers" delay={0} linkTo="/users" />
          <StatCard title="Active Users"      value={stats?.active_users ?? 0}         icon={TrendingUp}  color="emerald" subtitle={`+${stats?.new_users_this_week ?? 0} this week`} delay={1} />
          <StatCard title="Verified Farmers"  value={stats?.verified_farmers ?? 0}     icon={UserCheck}   color="cyan"    subtitle="ID verified & approved" delay={2} linkTo="/farmer-verification" />
          <StatCard title="Pending Reviews"   value={stats?.pending_verifications ?? 0}icon={AlertTriangle}color="amber"  subtitle="Awaiting verification" delay={3} linkTo="/farmer-verification" />
          <StatCard title="Total Farms"       value={stats?.total_farms ?? 0}          icon={LayoutGrid}  color="purple"  subtitle="Registered farm plots" delay={4} linkTo="/farms" />
          <StatCard title="Total Crops"       value={stats?.total_crops ?? 0}          icon={Sprout}      color="emerald" subtitle="Crops tracked on platform" delay={5} linkTo="/farms" />
          <StatCard title="Running Schemes"   value={stats?.running_schemes ?? 0}      icon={ShieldCheck} color="blue"    subtitle={stats?.expiring_soon ? `${stats.expiring_soon} expiring soon` : "Active govt schemes"} delay={6} linkTo="/schemes/running" />
          <StatCard title="Upcoming Schemes"  value={stats?.upcoming_schemes ?? 0}     icon={Clock}       color="purple"  subtitle="Scheduled to start" delay={7} linkTo="/schemes/upcoming" />
        </div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth — Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">User Growth</h2>
              <p className="text-xs text-gray-500 mt-0.5">Monthly registrations — last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">Registrations</span>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dx={-8} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="users" name="Users" stroke="#34d399" strokeWidth={2.5} fill="url(#gUsers)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Scheme Activity — Pie/Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-1">Scheme Status</h2>
          <p className="text-xs text-gray-500 mb-6">Breakdown by current status</p>
          {loading ? (
            <Skeleton className="h-48 w-full rounded-full mx-auto" style={{ maxWidth: "200px" }} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={schemeActivity} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {schemeActivity.map((_, i) => (
                      <Cell key={i} fill={SCHEME_COLORS[i % SCHEME_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-2">
                {schemeActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SCHEME_COLORS[i] }} />
                      <span className="text-gray-400">{item.status}</span>
                    </div>
                    <span className="font-semibold text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-1">Farmer Verifications</h2>
          <p className="text-xs text-gray-500 mb-5">Approval status breakdown</p>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={verifPieData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                  {verifPieData.map((_, i) => (
                    <Cell key={i} fill={VERIF_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest platform events</p>
            </div>
            <button onClick={() => navigate("/farmer-verification")} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-600 text-sm">No recent activity yet</div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide pr-1">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.04 }}
                  className="flex items-center gap-3 group"
                >
                  <ActivityIcon category={item.category} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">{item.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {new Date(item.time).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="glass-panel rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Scheme", icon: ShieldCheck, color: "emerald", path: "/schemes/add" },
            { label: "Verify Farmers", icon: UserCheck, color: "amber", path: "/farmer-verification" },
            { label: "View Farms", icon: LayoutGrid, color: "blue", path: "/farms" },
            { label: "Send Alert", icon: AlertTriangle, color: "rose", path: "/notifications" },
          ].map(({ label, icon: Icon, color, path }) => {
            const c: Record<string, string> = {
              emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
              amber:   "bg-amber-500/10  border-amber-500/20  text-amber-400  hover:bg-amber-500/20",
              blue:    "bg-blue-500/10   border-blue-500/20   text-blue-400   hover:bg-blue-500/20",
              rose:    "bg-rose-500/10   border-rose-500/20   text-rose-400   hover:bg-rose-500/20",
            }
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border transition-all duration-200 group hover:-translate-y-0.5 ${c[color]}`}
              >
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">{label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

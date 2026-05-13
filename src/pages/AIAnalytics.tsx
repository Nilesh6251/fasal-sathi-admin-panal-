import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  BrainCircuit, Activity, Clock, HelpCircle, MessageSquare,
  TrendingUp, RefreshCw, Leaf, Bug, CloudRain, BookOpen
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts"
import { apiFetch } from "../hooks/useApi"
import Skeleton from "../components/ui/Skeleton"

// Static AI stats — these could be wired to a real AI analytics endpoint later
const STATS = [
  { title: "Accuracy Rate",     value: "94.2%",  icon: Activity,     color: "emerald" },
  { title: "Avg. Response",     value: "1.2s",   icon: Clock,        color: "blue"    },
  { title: "Queries Today",     value: "842",    icon: MessageSquare,color: "purple"  },
  { title: "Unanswered",        value: "12",     icon: HelpCircle,   color: "rose"    },
]

const COLOR_MAP: Record<string, { text: string; bg: string; hex: string }> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", hex: "#34d399" },
  blue:    { text: "text-blue-400",    bg: "bg-blue-500/10",    hex: "#60a5fa" },
  purple:  { text: "text-purple-400",  bg: "bg-purple-500/10",  hex: "#c084fc" },
  rose:    { text: "text-rose-400",    bg: "bg-rose-500/10",    hex: "#fb7185" },
  amber:   { text: "text-amber-400",   bg: "bg-amber-500/10",   hex: "#fbbf24" },
}

const DAILY_DATA = [
  { time: "00:00", queries: 120 },
  { time: "04:00", queries: 85  },
  { time: "08:00", queries: 450 },
  { time: "12:00", queries: 820 },
  { time: "16:00", queries: 630 },
  { time: "20:00", queries: 310 },
  { time: "23:59", queries: 150 },
]

const TOPICS = [
  { topic: "Fertilizer Recommendations", count: 342, pct: 100, icon: Leaf,    color: "emerald" },
  { topic: "Weather Forecasting",         count: 215, pct: 63,  icon: CloudRain,color: "blue"   },
  { topic: "Crop Disease Diagnosis",      count: 184, pct: 54,  icon: Bug,      color: "rose"   },
  { topic: "Government Scheme Info",      count: 130, pct: 38,  icon: BookOpen, color: "purple" },
  { topic: "Market Price Inquiry",        count: 98,  pct: 29,  icon: TrendingUp,color:"amber"  },
]

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111]/90 backdrop-blur border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.stroke || p.fill || "#fff" }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

// Weekly trend from user-growth endpoint
export default function AIAnalytics() {
  const [weeklyData, setWeeklyData] = useState<{ month: string; users: number }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch<{ month: string; users: number }[]>("/dashboard/user-growth")
      setWeeklyData(data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">AI Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Platform intelligence and usage insights</p>
        </div>
        <button onClick={fetchData} className="p-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const c = COLOR_MAP[stat.color]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card p-5 group hover:border-current transition-all hover:-translate-y-0.5`}
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{stat.title}</p>
                <div className={`p-2 rounded-xl ${c.bg} border border-white/5 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-4 h-4 ${c.text}`} />
                </div>
              </div>
              <h3 className={`text-3xl font-bold ${c.text}`}>{stat.value}</h3>
            </motion.div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily AI Query volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Daily Query Volume</h2>
            <p className="text-xs text-gray-500 mt-0.5">Hourly AI interactions — today</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={DAILY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dy={8} />
              <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dx={-8} />
              <Tooltip content={<DarkTooltip />} />
              <Area type="monotone" dataKey="queries" name="Queries" stroke="#34d399" strokeWidth={2.5} fill="url(#gQueries)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly user growth from real API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-panel rounded-2xl p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Monthly User Growth</h2>
            <p className="text-xs text-gray-500 mt-0.5">New registrations — last 6 months</p>
          </div>
          {loading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dx={-8} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="users" name="Registrations" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((_, i) => (
                    <Cell key={i} fill={`rgba(52,211,153,${0.4 + (i / weeklyData.length) * 0.6})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Most asked topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-panel rounded-2xl p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">Most Asked Topics</h2>
          <p className="text-xs text-gray-500 mt-0.5">Top AI query categories from farmers</p>
        </div>
        <div className="space-y-5">
          {TOPICS.map((topic, i) => {
            const c = COLOR_MAP[topic.color]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-4"
              >
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <topic.icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-300">{topic.topic}</span>
                    <span className={`text-xs font-bold ${c.text}`}>{topic.count} queries</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.pct}%` }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.8, type: "spring" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* AI Performance metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Disease Detections", value: "3,241", sub: "this month", color: "rose" },
          { label: "Scheme Queries Answered", value: "1,892", sub: "this month", color: "blue" },
          { label: "Weather Alerts Served", value: "876", sub: "this month", color: "amber" },
        ].map((m, i) => {
          const c = COLOR_MAP[m.color]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="glass-panel rounded-xl p-5"
            >
              <p className={`text-3xl font-bold ${c.text}`}>{m.value}</p>
              <p className="text-sm text-gray-300 font-medium mt-1">{m.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{m.sub}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

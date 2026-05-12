import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { ResponsiveContainer, LineChart, Line } from "recharts"

interface StatCardProps {
  title: string
  value: string | number
  icon: any
  trend: number
  color: "emerald" | "blue" | "purple" | "rose" | "amber" | "cyan"
  data: any[]
  delay?: number
}

const colorMap = {
  emerald: { border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]", text: "text-emerald-400", hex: "#34d399", bg: "bg-emerald-500/10" },
  blue: { border: "border-blue-500/20", glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]", text: "text-blue-400", hex: "#60a5fa", bg: "bg-blue-500/10" },
  purple: { border: "border-purple-500/20", glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]", text: "text-purple-400", hex: "#c084fc", bg: "bg-purple-500/10" },
  rose: { border: "border-rose-500/20", glow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]", text: "text-rose-400", hex: "#fb7185", bg: "bg-rose-500/10" },
  amber: { border: "border-amber-500/20", glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]", text: "text-amber-400", hex: "#fbbf24", bg: "bg-amber-500/10" },
  cyan: { border: "border-cyan-500/20", glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]", text: "text-cyan-400", hex: "#22d3ee", bg: "bg-cyan-500/10" },
}

export default function StatCard({ title, value, icon: Icon, trend, color, data, delay = 0 }: StatCardProps) {
  const styles = colorMap[color]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={`glass-card p-5 group hover:${styles.border} hover:${styles.glow}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-2 rounded-xl ${styles.bg} border border-white/5`}>
          <Icon className={`w-5 h-5 ${styles.text}`} />
        </div>
      </div>
      
      <div className="flex items-end justify-between gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
          <span className="text-[10px] text-gray-500 font-medium">vs last week</span>
        </div>
        
        <div className="h-10 w-24 opacity-60 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="value" stroke={styles.hex} strokeWidth={2} dot={false} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

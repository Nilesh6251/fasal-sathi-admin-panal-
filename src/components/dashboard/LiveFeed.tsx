import { motion } from "framer-motion"
import { MessageSquare, UserPlus, ShieldAlert, CloudRain } from "lucide-react"

const activities = [
  { id: 1, type: "chat", message: "Ramesh asked about Wheat Disease", time: "Just now", icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: 2, type: "weather", message: "Suresh checked weather report for Pune", time: "2m ago", icon: CloudRain, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: 3, type: "alert", message: "System detected anomaly in soil data", time: "15m ago", icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-500/10" },
  { id: 4, type: "user", message: "New farmer registered from MP", time: "1h ago", icon: UserPlus, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: 5, type: "chat", message: "Mohan requested Govt Scheme details", time: "2h ago", icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
]

export default function LiveFeed() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel rounded-2xl p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          Live Feed
          <span className="relative flex h-2 w-2 ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </h3>
        <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300">View All</button>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide pr-2">
        {activities.map((activity, i) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="flex gap-4 group"
          >
            <div className="relative flex flex-col items-center">
              <div className={`p-2.5 rounded-full ${activity.bg} border border-white/5 ring-4 ring-[#0A0A0A] relative z-10 group-hover:scale-110 transition-transform`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              {i !== activities.length - 1 && (
                <div className="absolute top-10 bottom-[-16px] w-px bg-gradient-to-b from-white/10 to-transparent" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm text-gray-200 group-hover:text-white transition-colors">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

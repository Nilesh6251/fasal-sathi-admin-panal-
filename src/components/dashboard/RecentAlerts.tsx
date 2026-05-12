import { motion } from "framer-motion"
import { AlertTriangle, CloudLightning, Bug } from "lucide-react"

const alerts = [
  { id: 1, title: "Tomato blight spreading", location: "Madhya Pradesh", type: "disease", severity: "high", icon: Bug, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: 2, title: "Heavy rainfall expected", location: "Maharashtra", type: "weather", severity: "medium", icon: CloudLightning, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: 3, title: "Low soil moisture alert", location: "Rajasthan", type: "system", severity: "low", icon: AlertTriangle, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
]

export default function RecentAlerts() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-panel rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Alerts</h3>
        <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium text-gray-300">
          {alerts.length} Active
        </span>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + (i * 0.1) }}
            className={`p-4 rounded-xl border ${alert.border} bg-white/[0.02] flex items-start gap-4 group hover:bg-white/[0.04] transition-colors cursor-pointer`}
          >
            <div className={`p-2.5 rounded-lg ${alert.bg} mt-0.5`}>
              <alert.icon className={`w-5 h-5 ${alert.color}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{alert.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{alert.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

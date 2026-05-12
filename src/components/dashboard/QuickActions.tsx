import { motion } from "framer-motion"
import { PlusCircle, BellRing, BrainCircuit, UserPlus } from "lucide-react"

const actions = [
  { name: "Add Scheme", icon: PlusCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/30" },
  { name: "Send Alert", icon: BellRing, color: "text-rose-400", bg: "bg-rose-500/10", border: "hover:border-rose-500/30" },
  { name: "Train AI", icon: BrainCircuit, color: "text-purple-400", bg: "bg-purple-500/10", border: "hover:border-purple-500/30" },
  { name: "Add Farmer", icon: UserPlus, color: "text-blue-400", bg: "bg-blue-500/10", border: "hover:border-blue-500/30" },
]

export default function QuickActions() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-panel rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <button 
            key={i}
            className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 group ${action.border} hover:bg-white/[0.05]`}
          >
            <div className={`p-3 rounded-xl ${action.bg} mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
              {action.name}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

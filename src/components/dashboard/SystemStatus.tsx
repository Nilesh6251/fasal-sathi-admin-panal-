import { motion } from "framer-motion"
import { Server, Activity, Clock, Cpu } from "lucide-react"

export default function SystemStatus() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white mb-6">System Health</h3>
      
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-200">AI Server</p>
              <p className="text-xs text-emerald-400">Online & Active</p>
            </div>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-200">Response Time</p>
              <p className="text-xs text-gray-400">Average latency</p>
            </div>
          </div>
          <span className="text-sm font-bold text-blue-400">124ms</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-200">Accuracy Rate</p>
              <p className="text-xs text-gray-400">Disease Detection</p>
            </div>
          </div>
          <span className="text-sm font-bold text-purple-400">98.5%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-200">CPU Load</p>
              <p className="text-xs text-gray-400">Inference cluster</p>
            </div>
          </div>
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-[45%] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

import { Cloud, Sun, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export default function WelcomeSection() {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-20 bottom-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
          Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Nilesh 👋</span>
        </h1>
        <p className="text-gray-400 text-sm lg:text-base">
          Here's what's happening in Fasal Sathi today. System is operating at peak efficiency.
        </p>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-300">{date}</p>
          <div className="flex items-center justify-end gap-1.5 mt-1 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>Indore, MP</span>
          </div>
        </div>
        
        <div className="h-12 w-px bg-white/10 hidden sm:block" />
        
        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl p-3">
          <div className="relative">
            <Sun className="w-8 h-8 text-amber-400 absolute opacity-50 blur-sm" />
            <Sun className="w-8 h-8 text-amber-400 relative z-10" />
            <Cloud className="w-5 h-5 text-gray-300 absolute -bottom-1 -right-2 z-20 drop-shadow-md" />
          </div>
          <div>
            <p className="text-xl font-bold text-white leading-none">32°C</p>
            <p className="text-xs text-emerald-400 mt-1 font-medium">Partly Cloudy</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

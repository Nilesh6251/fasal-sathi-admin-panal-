import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: 'Mon', queries: 4000, users: 2400 },
  { name: 'Tue', queries: 3000, users: 1398 },
  { name: 'Wed', queries: 5000, users: 4800 },
  { name: 'Thu', queries: 2780, users: 3908 },
  { name: 'Fri', queries: 6890, users: 4800 },
  { name: 'Sat', queries: 2390, users: 3800 },
  { name: 'Sun', queries: 3490, users: 4300 },
];

export default function MainChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel rounded-2xl p-6 lg:p-8 h-full flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Interactions & Growth</h2>
          <p className="text-sm text-gray-400 mt-1">Daily system analytics and farmer queries</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-medium text-gray-300">Queries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <span className="text-xs font-medium text-gray-300">Active Users</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="queries" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
            <Area type="monotone" dataKey="users" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

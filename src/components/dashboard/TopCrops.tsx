import { motion } from "framer-motion"

const crops = [
  { name: "Wheat", percentage: 45, color: "bg-amber-400", bg: "bg-amber-500/10" },
  { name: "Rice", percentage: 30, color: "bg-blue-400", bg: "bg-blue-500/10" },
  { name: "Soyabean", percentage: 15, color: "bg-emerald-400", bg: "bg-emerald-500/10" },
  { name: "Tomato", percentage: 10, color: "bg-rose-400", bg: "bg-rose-500/10" },
]

export default function TopCrops() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel rounded-2xl p-6 h-full flex flex-col"
    >
      <h3 className="text-lg font-bold text-white mb-6">Top Asked Crops</h3>
      
      <div className="space-y-5 flex-1">
        {crops.map((crop, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-200">{crop.name}</span>
              <span className="text-xs font-bold text-gray-400">{crop.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${crop.percentage}%` }}
                transition={{ delay: 0.8 + (i * 0.1), duration: 1, type: "spring" }}
                className={`h-full ${crop.color} rounded-full shadow-[0_0_10px_currentColor]`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

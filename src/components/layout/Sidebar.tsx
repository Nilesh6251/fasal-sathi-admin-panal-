import { useState } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, MessageSquare, ShieldCheck, TrendingUp, ChevronLeft, ChevronRight, BrainCircuit, BellRing, Sprout } from "lucide-react"
import { motion } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "AI Chat Monitor", href: "/chat-history", icon: MessageSquare },
  { name: "Govt Schemes", href: "/govt-schemes", icon: ShieldCheck },
  { name: "Mandi Bhav", href: "/mandi-bhav", icon: TrendingUp },
  { name: "AI Analytics", href: "/analytics", icon: BrainCircuit },
  { name: "Notifications", href: "/notifications", icon: BellRing },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.div 
      initial={{ width: 260 }}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex h-full flex-col bg-white border-r border-gray-100 relative z-20 shadow-sm"
    >
      {/* Collapse toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30 hover:scale-110 transition-transform flex items-center justify-center z-30"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center px-5 gap-3 border-b border-gray-100 overflow-hidden whitespace-nowrap">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-lg font-bold tracking-tight text-gray-800"
          >
            FasalSathi
          </motion.span>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-transparent"
                } ${isCollapsed ? "justify-center" : "justify-start"}`
              }
              title={isCollapsed ? item.name : ""}
            >
              <item.icon
                className={`h-[18px] w-[18px] flex-shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? "mr-0" : "mr-3"}`}
                aria-hidden="true"
              />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom version */}
      {!isCollapsed && (
        <div className="px-5 py-3 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-gray-300 font-medium">Admin Panel v2.0</p>
        </div>
      )}
    </motion.div>
  )
}

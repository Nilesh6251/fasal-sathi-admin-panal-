import { useState } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, MessageSquare, ShieldCheck, TrendingUp, ChevronLeft, ChevronRight, BrainCircuit, BellRing, Sprout, Store, Activity, Settings, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BrainCircuit },
  { name: "Farmers", href: "/users", icon: Users },
  { name: "Sellers", href: "/sellers", icon: Store },
  { name: "AI Chats", href: "/chat-history", icon: MessageSquare },
  { name: "Disease Alerts", href: "/disease-analysis", icon: Activity },
  { name: "Weather", href: "/mandi-bhav", icon: TrendingUp }, // Temporary use of mandi-bhav for weather
  { name: "Notifications", href: "/notifications", icon: BellRing },
  { name: "Govt Schemes", href: "/govt-schemes", icon: ShieldCheck },
  { name: "Settings", href: "/ai-config", icon: Settings },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { logout } = useAuth()

  return (
    <motion.div 
      initial={{ width: 260 }}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex h-screen flex-col bg-[#0A0A0A] border-r border-white/10 relative z-20 shadow-2xl"
    >
      {/* Collapse toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-7 w-7 h-7 bg-[#1A1A1A] border border-white/10 text-white rounded-full shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:scale-110 hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center z-30"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo */}
      <div className="flex h-20 items-center px-5 gap-3 border-b border-white/5 overflow-hidden whitespace-nowrap">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
          <Sprout className="w-6 h-6 text-black" strokeWidth={2.5} />
        </div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold tracking-tight text-white"
            >
              Fasal<span className="text-emerald-400">Sathi</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 overflow-x-hidden scrollbar-hide">
        <nav className="space-y-1.5 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "text-emerald-400 bg-white/[0.05] border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                    : "text-gray-400 hover:bg-white/[0.02] hover:text-gray-200"
                } ${isCollapsed ? "justify-center" : "justify-start"}`
              }
              title={isCollapsed ? item.name : ""}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={`h-[1.1rem] w-[1.1rem] flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : ""
                    } ${isCollapsed ? "mr-0" : "mr-3"}`}
                    aria-hidden="true"
                  />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={logout}
          className={`w-full group flex items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 ${isCollapsed ? "justify-center" : "justify-start"}`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className={`h-[1.1rem] w-[1.1rem] flex-shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? "mr-0" : "mr-3"}`} />
          {!isCollapsed && (
            <span className="truncate">Logout</span>
          )}
        </button>
      </div>
    </motion.div>
  )
}

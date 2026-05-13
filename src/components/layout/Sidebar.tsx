import { useState, useEffect } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, Users, MessageSquare, ShieldCheck, TrendingUp,
  ChevronLeft, ChevronRight, BrainCircuit, BellRing, Store,
  Activity, Settings, LogOut, Plus, PlayCircle, Clock, Archive,
  UserCheck, ChevronDown, LayoutGrid
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import logoSvg from "../../assets/Logo.svg"

// ── Nav config ─────────────────────────────────────────────────────────────────
interface NavItem { name: string; href: string; icon: any; badge?: number }

const navigation: NavItem[] = [
  { name: "Dashboard",       href: "/",                icon: LayoutDashboard },
  { name: "AI Analytics",    href: "/analytics",       icon: BrainCircuit    },
  { name: "Farmers",         href: "/users",           icon: Users           },
  { name: "Sellers",         href: "/sellers",         icon: Store           },
  { name: "Farms",           href: "/farms",           icon: LayoutGrid      },
  { name: "AI Chats",        href: "/chat-history",    icon: MessageSquare   },
  { name: "Disease Alerts",  href: "/disease-analysis",icon: Activity        },
  { name: "Weather",         href: "/mandi-bhav",      icon: TrendingUp      },
  { name: "Notifications",   href: "/notifications",   icon: BellRing        },
  { name: "Govt Schemes",    href: "/govt-schemes",    icon: ShieldCheck     },
  { name: "AI Config",       href: "/ai-config",       icon: Settings        },
]

const schemesNav: NavItem[] = [
  { name: "Add Scheme",  href: "/schemes/add",      icon: Plus       },
  { name: "Running",     href: "/schemes/running",  icon: PlayCircle },
  { name: "Upcoming",    href: "/schemes/upcoming", icon: Clock      },
  { name: "Previous",    href: "/schemes/previous", icon: Archive    },
]

// ── Single nav link ─────────────────────────────────────────────────────────────
function NavItem({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === "/"}
      title={isCollapsed ? item.name : ""}
      className={({ isActive }) =>
        `group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 overflow-hidden ${
          isActive
            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.1)]"
            : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent"
        } ${isCollapsed ? "justify-center" : "gap-3"}`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left bar */}
          {isActive && (
            <motion.div
              layoutId="active-pill"
              className="absolute left-0 top-2 bottom-2 w-[3px] bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
          <item.icon
            className={`flex-shrink-0 transition-all duration-200 ${
              isActive
                ? "w-[1.1rem] h-[1.1rem] text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                : "w-[1.1rem] h-[1.1rem] group-hover:scale-110"
            }`}
          />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="truncate leading-none"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
          {item.badge !== undefined && item.badge > 0 && !isCollapsed && (
            <span className="ml-auto px-1.5 py-0.5 min-w-[20px] text-center text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

// ── Section label ───────────────────────────────────────────────────────────────
function SectionLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  if (isCollapsed) return <div className="my-2 mx-3 h-px bg-white/5" />
  return (
    <p className="px-4 pt-5 pb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-gray-700 select-none">{label}</p>
  )
}

// ── Main sidebar ─────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [schemesOpen, setSchemesOpen] = useState(false)
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const isSchemesActive = location.pathname.startsWith("/schemes")

  // Auto-open schemes group when on a schemes route
  useEffect(() => {
    if (isSchemesActive) setSchemesOpen(true)
  }, [isSchemesActive])

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="relative flex h-screen flex-col overflow-hidden z-20"
      style={{ flexShrink: 0 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#090909] border-r border-white/[0.06]" />
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      {/* Subtle side glow */}
      <div className="absolute top-20 left-2 w-24 h-48 bg-emerald-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* Collapse toggle button */}
      <button
        onClick={() => setIsCollapsed(v => !v)}
        className="absolute -right-3.5 top-[4.5rem] z-30 w-7 h-7 flex items-center justify-center rounded-full bg-[#141414] border border-white/10 text-gray-500 hover:text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all duration-200 shadow-lg"
      >
        {isCollapsed
          ? <ChevronRight className="w-3.5 h-3.5" />
          : <ChevronLeft  className="w-3.5 h-3.5" />}
      </button>

      {/* ── Logo Header ── */}
      <div className="relative flex h-[70px] items-center overflow-hidden px-4 gap-3 border-b border-white/[0.06]">
        {/* Logo icon */}
        <button
          onClick={() => navigate("/")}
          className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:scale-105 transition-all duration-200 group"
          title="FasalSathi Dashboard"
        >
          {/* Glowing background */}
          <div className="absolute inset-0 rounded-xl bg-emerald-500/20 border border-emerald-500/30 shadow-[0_0_16px_rgba(52,211,153,0.25)] group-hover:shadow-[0_0_24px_rgba(52,211,153,0.4)] group-hover:bg-emerald-500/30 transition-all" />
          <img
            src={logoSvg}
            alt="FasalSathi"
            className="relative z-10 w-5 h-5 object-contain drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          />
        </button>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-[15px] font-bold tracking-tight text-white leading-none whitespace-nowrap">
                Fasal<span className="text-emerald-400">Sathi</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[0.18em] text-gray-600 uppercase mt-0.5">Admin Console</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-3">
        <nav className="space-y-0.5 px-2.5">

          {/* Main */}
          <SectionLabel label="Main" isCollapsed={isCollapsed} />
          {navigation.slice(0, 2).map(item => (
            <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}

          {/* Users */}
          <SectionLabel label="Users" isCollapsed={isCollapsed} />
          {navigation.slice(2, 5).map(item => (
            <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}

          {/* Platform */}
          <SectionLabel label="Platform" isCollapsed={isCollapsed} />
          {navigation.slice(5, 9).map(item => (
            <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}

          {/* Farmer Verification */}
          <NavLink
            to="/farmer-verification"
            title={isCollapsed ? "Farmer Verification" : ""}
            className={({ isActive }) =>
              `group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 overflow-hidden ${
                isActive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent"
              } ${isCollapsed ? "justify-center" : "gap-3"}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-pill-fv"
                    className="absolute left-0 top-2 bottom-2 w-[3px] bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <UserCheck className={`flex-shrink-0 w-[1.1rem] h-[1.1rem] transition-all duration-200 ${isActive ? "text-emerald-400" : "group-hover:scale-110"}`} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="truncate"
                    >
                      Farmer Verify
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>

          {/* Schemes — Collapsible group */}
          <SectionLabel label="Schemes" isCollapsed={isCollapsed} />

          <button
            onClick={() => !isCollapsed && setSchemesOpen(v => !v)}
            title={isCollapsed ? "Schemes" : ""}
            className={`w-full group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 overflow-hidden ${
              isSchemesActive
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent"
            } ${isCollapsed ? "justify-center" : "justify-between"}`}
          >
            <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
              {isSchemesActive && (
                <motion.div
                  layoutId="active-pill-sc"
                  className="absolute left-0 top-2 bottom-2 w-[3px] bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <ShieldCheck className={`flex-shrink-0 w-[1.1rem] h-[1.1rem] transition-all duration-200 ${isSchemesActive ? "text-emerald-400" : "group-hover:scale-110"}`} />
              {!isCollapsed && <span className="truncate">Schemes</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 flex-shrink-0 ${schemesOpen || isSchemesActive ? "rotate-180" : ""}`} />
            )}
          </button>

          {/* Schemes sub-links */}
          <AnimatePresence initial={false}>
            {(schemesOpen || isSchemesActive) && !isCollapsed && (
              <motion.div
                key="schemes-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-6 border-l border-white/[0.07] ml-4 mt-1 space-y-0.5">
                  {schemesNav.map(item => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? "text-emerald-400 bg-emerald-500/10"
                            : "text-gray-600 hover:text-gray-200 hover:bg-white/[0.03]"
                        }`
                      }
                    >
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
            {isCollapsed && isSchemesActive && (
              <motion.div
                key="schemes-icons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-0.5 space-y-0.5"
              >
                {schemesNav.map(item => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    title={item.name}
                    className={({ isActive }) =>
                      `flex justify-center rounded-xl py-2 transition-all ${
                        isActive ? "text-emerald-400 bg-white/[0.05]" : "text-gray-600 hover:text-gray-300"
                      }`
                    }
                  >
                    <item.icon className="w-3.5 h-3.5" />
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Admin */}
          <SectionLabel label="Admin" isCollapsed={isCollapsed} />
          {navigation.slice(9).map(item => (
            <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>

      {/* ── Footer / Logout ── */}
      <div className="relative px-2.5 py-3 border-t border-white/[0.06]">
        {/* Admin avatar row */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
          >
            {/* Logo avatar */}
            <div className="relative flex-shrink-0 w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-emerald-500/20 blur-sm" />
              <div className="relative w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center p-1.5 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                <img
                  src={logoSvg}
                  alt="Admin"
                  className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white leading-none truncate">Admin</p>
              <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold tracking-wide">SYSTEM OPERATOR</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={logout}
          title={isCollapsed ? "Logout" : ""}
          className={`w-full group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-500/8 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all duration-200 ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          <LogOut className={`flex-shrink-0 w-[1.1rem] h-[1.1rem] group-hover:scale-110 transition-transform`} />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="truncate"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}

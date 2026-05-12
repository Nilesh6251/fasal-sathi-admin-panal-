import { Bell, Search, UserCircle, LogOut } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function TopHeader() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex h-20 flex-shrink-0 items-center gap-x-4 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-2xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-500" />
          <input
            type="search"
            className="h-12 w-full max-w-lg bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            placeholder="Search dashboard, users, alerts..."
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-x-4">
          <button type="button" className="relative p-2.5 text-gray-400 hover:text-emerald-400 transition-colors rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </button>
          
          <div className="h-8 w-px bg-white/10" />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer border border-transparent hover:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                <UserCircle className="h-6 w-6 text-black" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-200 leading-none">Admin</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-medium tracking-wide">SYSTEM OP</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

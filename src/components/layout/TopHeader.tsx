import { Bell, Search, UserCircle, LogOut } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function TopHeader() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex h-14 flex-shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="search"
            className="h-9 w-full max-w-md bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            placeholder="Search..."
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-x-3">
          <button type="button" className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>
          
          <div className="h-6 w-px bg-gray-200" />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                <UserCircle className="h-5 w-5 text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-700 leading-none">Admin</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Super Admin</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

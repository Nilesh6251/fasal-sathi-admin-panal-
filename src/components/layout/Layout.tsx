import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopHeader from "./TopHeader"

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

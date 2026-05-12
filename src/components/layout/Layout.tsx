import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopHeader from "./TopHeader"

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopHeader from "./TopHeader"
import ToastContainer from "../ui/Toast"

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080808" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Subtle ambient gradient behind content */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-emerald-500/[0.025] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 w-[400px] h-[200px] bg-purple-500/[0.02] rounded-full blur-[100px]" />
        </div>

        <TopHeader />

        <main className="relative flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Content padding */}
          <div className="p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

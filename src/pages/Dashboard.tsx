import { useState, useEffect } from "react"
import { Users, UserPlus, MessageSquare, ShieldAlert, Activity, Target } from "lucide-react"
import WelcomeSection from "../components/dashboard/WelcomeSection"
import StatCard from "../components/dashboard/StatCard"
import MainChart from "../components/dashboard/MainChart"
import LiveFeed from "../components/dashboard/LiveFeed"
import TopCrops from "../components/dashboard/TopCrops"
import SystemStatus from "../components/dashboard/SystemStatus"
import QuickActions from "../components/dashboard/QuickActions"
import RecentAlerts from "../components/dashboard/RecentAlerts"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data with a small delay for smooth entry animation
    setTimeout(() => {
      setStats({
        totalFarmers: 12450,
        activeUsers: 8230,
        totalChats: 45210,
        totalDiseaseReports: 840,
        cropQueriesToday: 1250,
        aiAccuracy: 98.5
      })
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-4 rounded-full border-b-2 border-purple-500 animate-spin" />
        </div>
      </div>
    )
  }

  // Dummy sparkline data
  const sparklineData = Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 100) }))

  const topCards = [
    { title: "Total Farmers", value: stats.totalFarmers.toLocaleString(), icon: Users, trend: 12.5, color: "emerald" as const, data: sparklineData },
    { title: "AI Chats", value: stats.totalChats.toLocaleString(), icon: MessageSquare, trend: 24.8, color: "purple" as const, data: sparklineData },
    { title: "Crop Queries Today", value: stats.cropQueriesToday.toLocaleString(), icon: Activity, trend: 8.2, color: "cyan" as const, data: sparklineData },
    { title: "Disease Alerts", value: stats.totalDiseaseReports.toLocaleString(), icon: ShieldAlert, trend: -5.4, color: "rose" as const, data: sparklineData },
    { title: "Active Users", value: stats.activeUsers.toLocaleString(), icon: UserPlus, trend: 18.2, color: "blue" as const, data: sparklineData },
    { title: "AI Accuracy", value: `${stats.aiAccuracy}%`, icon: Target, trend: 1.2, color: "amber" as const, data: sparklineData },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12 max-w-[1600px] mx-auto"
    >
      <WelcomeSection />

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topCards.map((card, i) => (
          <StatCard key={i} {...card} delay={i + 1} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="h-[400px]">
            <MainChart />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
            <TopCrops />
            <SystemStatus />
          </div>
        </div>

        {/* Right Sidebar Section */}
        <div className="flex flex-col gap-6">
          <div className="h-[350px]">
            <LiveFeed />
          </div>
          <QuickActions />
          <RecentAlerts />
        </div>
      </div>
    </motion.div>
  )
}

import { Users, UserPlus, FileText, ShoppingBag, AlertTriangle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { name: "Total Users", value: "12,456", icon: Users, change: "+12%", changeType: "positive" },
  { name: "Active Farmers", value: "8,234", icon: UserPlus, change: "+5.4%", changeType: "positive" },
  { name: "Total Orders", value: "3,456", icon: ShoppingBag, change: "-2%", changeType: "negative" },
  { name: "Govt Schemes", value: "45", icon: FileText, change: "+3 new", changeType: "positive" },
]

const data = [
  { name: 'Mon', users: 4000, revenue: 2400 },
  { name: 'Tue', users: 3000, revenue: 1398 },
  { name: 'Wed', users: 2000, revenue: 9800 },
  { name: 'Thu', users: 2780, revenue: 3908 },
  { name: 'Fri', users: 1890, revenue: 4800 },
  { name: 'Sat', users: 2390, revenue: 3800 },
  { name: 'Sun', users: 3490, revenue: 4300 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-24 h-24 text-primary" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-primary/20 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                  <span className={`text-xs font-semibold ${stat.changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl min-h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Revenue & User Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Alerts</h3>
            <span className="bg-destructive/20 text-destructive text-xs font-bold px-2 py-1 rounded-full">3 New</span>
          </div>

          <div className="space-y-3">
            {[
              { title: "Heavy Rainfall Alert", desc: "Maharashtra Region", time: "10 mins ago", type: "warning" },
              { title: "Mandi Price Drop", desc: "Wheat prices dropped 5%", time: "1 hr ago", type: "info" },
              { title: "New Seller Approval", desc: "3 pending requests", time: "2 hrs ago", type: "action" },
            ].map((alert, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-background/40 hover:bg-background/60 transition-colors border border-border/50">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${alert.type === 'warning' ? 'text-destructive' : 'text-primary'}`} />
                <div>
                  <h4 className="text-sm font-semibold">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground">{alert.desc}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

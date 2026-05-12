import { BrainCircuit, Activity, Clock, HelpCircle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', queries: 120 },
  { time: '04:00', queries: 85 },
  { time: '08:00', queries: 450 },
  { time: '12:00', queries: 820 },
  { time: '16:00', queries: 630 },
  { time: '20:00', queries: 310 },
  { time: '23:59', queries: 150 },
];

export default function AIAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Analytics</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Accuracy Rate", value: "94.2%", icon: Activity, text: "text-emerald-500" },
          { title: "Avg. Response Time", value: "1.2s", icon: Clock, text: "text-primary" },
          { title: "Total Queries (Today)", value: "842", icon: BrainCircuit, text: "text-primary" },
          { title: "Unanswered Queries", value: "12", icon: HelpCircle, text: "text-red-500" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className={`p-3 bg-primary/10 rounded-xl ${stat.text}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl min-h-[350px] border border-border/50">
          <h3 className="text-lg font-semibold mb-6">Daily Usage Graph</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="queries" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl min-h-[350px] border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Most Asked Topics</h3>
          <div className="space-y-4">
            {[
              { topic: "Fertilizer Recommendations", count: 342, percentage: 65 },
              { topic: "Weather Forecasting", count: 215, percentage: 45 },
              { topic: "Crop Disease Diagnosis", count: 184, percentage: 35 },
              { topic: "Mandi Price Inquiry", count: 98, percentage: 20 },
            ].map((topic, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{topic.topic}</span>
                  <span className="text-muted-foreground">{topic.count} queries</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${topic.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

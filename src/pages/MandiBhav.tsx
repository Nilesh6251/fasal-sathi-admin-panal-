import { TrendingUp, MapPin, ArrowUpRight, ArrowDownRight, Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mandiData = [
  { id: 1, crop: "Wheat", district: "Pune", price: "₹2,450/q", change: "+₹50", trend: "up" },
  { id: 2, crop: "Soyabean", district: "Indore", price: "₹4,200/q", change: "-₹120", trend: "down" },
  { id: 3, crop: "Cotton", district: "Nagpur", price: "₹7,100/q", change: "+₹200", trend: "up" },
  { id: 4, crop: "Onion", district: "Nashik", price: "₹1,800/q", change: "-₹50", trend: "down" },
]

const graphData = [
  { name: 'Wheat', price: 2450 },
  { name: 'Soyabean', price: 4200 },
  { name: 'Cotton', price: 7100 },
  { name: 'Onion', price: 1800 },
];

export default function MandiBhav() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mandi Bhav</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Live Market Rates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-primary/5 text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Crop</th>
                  <th className="px-4 py-3 font-medium">District</th>
                  <th className="px-4 py-3 font-medium">Price (per quintal)</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {mandiData.map((item) => (
                  <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-4 font-medium">{item.crop}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.district}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-primary">{item.price}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-medium ${item.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/50 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Market Analytics</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--secondary))', opacity: 0.4}}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="price" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button className="w-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium py-2.5 rounded-xl border border-primary/20 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  )
}

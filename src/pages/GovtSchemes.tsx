import { ShieldCheck, Plus, ExternalLink, CalendarDays, Eye, EyeOff, Filter } from "lucide-react"
import { useState } from "react"

const initialSchemes = [
  { id: 1, title: "PM Kisan Samman Nidhi", state: "All India", budget: "₹6,000/year", category: "Financial", status: "Active", expiry: "2026-12-31", isPublished: true },
  { id: 2, title: "Pradhan Mantri Fasal Bima Yojana", state: "All India", budget: "Varies", category: "Insurance", status: "Active", expiry: "2025-06-30", isPublished: true },
  { id: 3, title: "Maharashtra Agribusiness Network", state: "Maharashtra", budget: "₹500 Cr", category: "Infrastructure", status: "Ending Soon", expiry: "2024-03-31", isPublished: false },
]

export default function GovtSchemes() {
  const [schemes, setSchemes] = useState(initialSchemes)

  const togglePublish = (id: number) => {
    setSchemes(schemes.map(s => s.id === id ? { ...s, isPublished: !s.isPublished } : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Government Schemes</h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-border/50 rounded-xl hover:bg-secondary/50 transition-colors flex-1 sm:flex-none">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Category Filter</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20 flex-1 sm:flex-none">
            <Plus className="w-4 h-4" />
            Add Scheme
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <div key={scheme.id} className={`glass-panel p-6 rounded-2xl border hover:-translate-y-1 transition-all duration-300 group ${!scheme.isPublished ? 'opacity-70 border-border/30' : 'border-border/50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  scheme.status === 'Active' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {scheme.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {scheme.category}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-1">{scheme.title}</h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium">{scheme.state}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Benefit:</span>
                <span className="font-medium text-emerald-500">{scheme.budget}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" /> Expiry:
                </span>
                <span className={`font-medium ${new Date(scheme.expiry) < new Date('2025-01-01') ? 'text-destructive' : ''}`}>
                  {scheme.expiry}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => togglePublish(scheme.id)}
                className={`flex-1 py-2 flex items-center justify-center gap-2 border rounded-xl text-sm font-medium transition-colors ${
                  scheme.isPublished 
                    ? 'bg-background border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-muted-foreground' 
                    : 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                }`}
              >
                {scheme.isPublished ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}
              </button>
              <button className="px-3 py-2 flex items-center justify-center bg-background/50 hover:bg-background border border-border/50 rounded-xl text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

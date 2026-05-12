import { MessageSquare, ThumbsUp, ThumbsDown, Filter, Search, AlertTriangle } from "lucide-react"

const chats = [
  { id: 1, user: "Ramesh Kumar", query: "Wheat disease in roots?", ai_response: "Use Fungicide X...", feedback: "up", time: "10 mins ago", isToxic: false },
  { id: 2, user: "Amit Singh", query: "Best fertilizer for sugarcane?", ai_response: "NPK 10:26:26 is recommended...", feedback: "up", time: "1 hr ago", isToxic: false },
  { id: 3, user: "Unknown", query: "Why is the govt scheme so bad and useless!", ai_response: "I cannot assist with frustrated complaints. Please contact support...", feedback: "down", time: "2 hrs ago", isToxic: true },
]

export default function ChatHistory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Chat Monitoring</h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-background/50 border border-border/50 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>
          <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors border border-primary/20 font-medium">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter Logs</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {chats.map((chat) => (
          <div key={chat.id} className={`glass-panel p-5 rounded-2xl border transition-colors ${chat.isToxic ? 'border-destructive/50 bg-destructive/5 hover:border-destructive' : 'border-border/50 hover:border-primary/30'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${chat.isToxic ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  <MessageSquare className={`w-4 h-4 ${chat.isToxic ? 'text-destructive' : 'text-primary'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {chat.user}
                    {chat.isToxic && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Toxic Detected
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">{chat.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {chat.feedback === 'up' 
                  ? <ThumbsUp className="w-4 h-4 text-emerald-500" /> 
                  : <ThumbsDown className="w-4 h-4 text-red-500" />
                }
              </div>
            </div>
            
            <div className="pl-10 space-y-3">
              <div className="bg-background/40 p-3 rounded-xl border border-border/30">
                <p className="text-sm font-medium"><span className="text-muted-foreground mr-2">Q:</span>{chat.query}</p>
              </div>
              <div className={`p-3 rounded-xl border ${chat.isToxic ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-primary/5 border-primary/10 text-primary/90'}`}>
                <p className="text-sm"><span className="font-semibold mr-2">AI:</span>{chat.ai_response}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

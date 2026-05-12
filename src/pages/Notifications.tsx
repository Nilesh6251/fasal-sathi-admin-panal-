import { BellRing, Send, Clock, AlertTriangle, ShieldCheck } from "lucide-react"

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Notification Center</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <div className="glass-panel p-6 rounded-2xl border border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send New Alert
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Alert Type</label>
              <select className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>General Announcement</option>
                <option>Weather Warning</option>
                <option>Government Scheme Update</option>
                <option>Emergency Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Target Audience</label>
              <select className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>All Users</option>
                <option>Farmers Only</option>
                <option>Sellers Only</option>
                <option>Specific Region</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Message Title</label>
              <input type="text" placeholder="Enter alert title" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Message Content</label>
              <textarea rows={4} placeholder="Type your message here..." className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button type="button" className="w-full bg-primary text-primary-foreground font-semibold rounded-xl py-3 transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              <BellRing className="w-5 h-5" />
              Broadcast Notification
            </button>
          </form>
        </div>

        {/* Recent & Scheduled Notifications */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Scheduled Alerts
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 rounded-xl bg-background/40 border border-border/50">
                <ShieldCheck className="w-5 h-5 mt-0.5 text-emerald-500" />
                <div>
                  <h4 className="text-sm font-semibold">New Fertilizer Subsidy Launch</h4>
                  <p className="text-xs text-muted-foreground">Target: All Farmers</p>
                  <p className="text-[10px] font-medium text-primary mt-1">Scheduled for: Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Recent Broadcasts
            </h3>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-background/40 border border-border/50 opacity-70 hover:opacity-100 transition-opacity">
                  <BellRing className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-semibold line-through decoration-muted-foreground">Heavy Rainfall Warning - Vidarbha</h4>
                    <p className="text-xs text-muted-foreground">Sent to: Regional Users</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Delivered: 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

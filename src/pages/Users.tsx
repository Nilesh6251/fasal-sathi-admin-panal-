import { Search, Shield, User as UserIcon, ShieldAlert, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

const users = [
  { id: 1, name: "Ramesh Kumar", role: "Farmer", status: "Active", location: "Maharashtra", joined: "Oct 24, 2023" },
  { id: 2, name: "Suresh Agro Traders", role: "Seller", status: "Active", location: "Punjab", joined: "Nov 02, 2023" },
  { id: 3, name: "Amit Singh", role: "Moderator", status: "Active", location: "UP", joined: "Dec 15, 2023" },
  { id: 4, name: "Fake User 99", role: "Farmer", status: "Blocked", location: "Unknown", joined: "Jan 10, 2024" },
]

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-9 pr-4 py-2 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary/5 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {user.role === 'Moderator' && <Shield className="w-4 h-4 text-emerald-500" />}
                      {user.role === 'Farmer' && <UserIcon className="w-4 h-4" />}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-background/50 rounded-lg hover:bg-background" title="View Profile">
                        <UserIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-background/50 rounded-lg hover:bg-background" title="Ban User">
                        <ShieldAlert className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-background/50 rounded-lg hover:bg-background" title="Delete User">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-4 border border-border/50 rounded-xl flex items-center justify-between bg-background/40 glass-panel">
        <span className="text-sm text-muted-foreground">Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">4</span> of <span className="font-medium text-foreground">1,234</span> results</span>
        <div className="flex gap-2">
          <button className="p-2 border border-border/50 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="p-2 border border-border/50 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

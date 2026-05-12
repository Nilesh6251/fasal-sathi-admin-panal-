import { useState } from "react"
import { BellRing, Send, AlertTriangle, Info, AlertOctagon } from "lucide-react"

export default function Notifications() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'low',
    targetRole: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('http://localhost:5000/api/notifications/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Notification broadcasted successfully!')
        setFormData({ title: '', message: '', type: 'general', priority: 'low', targetRole: '' })
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      console.error('Failed to send notification', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Alert System</h1>
          <p className="text-sm text-slate-500 mt-1">Broadcast high-priority alerts and notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-500" />
            Send New Alert
          </h3>
          
          <form onSubmit={handleSend} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Priority Level</label>
                <select 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                >
                  <option value="low">Low (General Info)</option>
                  <option value="medium">Medium (Important)</option>
                  <option value="high">High (Warning)</option>
                  <option value="emergency">EMERGENCY (Immediate Action)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Alert Category</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                >
                  <option value="general">General</option>
                  <option value="weather">Weather Alert</option>
                  <option value="scheme">Government Scheme</option>
                  <option value="disease">Disease Outbreak</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
              <select 
                value={formData.targetRole}
                onChange={e => setFormData({...formData, targetRole: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="">All Users</option>
                <option value="Farmer">Farmers Only</option>
                <option value="Seller">Sellers Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Alert Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Heavy Rainfall Expected Tomorrow" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message Content</label>
              <textarea 
                rows={4} 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Type your emergency alert or notification here..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none resize-none" 
              />
            </div>

            {success && <p className="text-emerald-600 text-sm font-medium">{success}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold rounded-xl py-3 transition-all flex items-center justify-center gap-2 ${
                formData.priority === 'emergency' 
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-white shadow-lg shadow-slate-500/20'
              }`}
            >
              <BellRing className="w-5 h-5" />
              {loading ? 'Sending...' : 'Broadcast Alert'}
            </button>
          </form>
        </div>

        {/* Priority Guidelines */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Priority Guidelines</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
                <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-rose-800">EMERGENCY</h4>
                  <p className="text-xs text-rose-600 mt-1">Triggers full-screen popup and loud sound on farmer's mobile app. Use ONLY for severe weather, cyclones, or critical disease outbreaks.</p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800">High Priority</h4>
                  <p className="text-xs text-amber-600 mt-1">Triggers standard push notification with vibration. Use for important market changes or heavy rain warnings.</p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <Info className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-800">Low / Medium</h4>
                  <p className="text-xs text-blue-600 mt-1">Silent notification delivered to the app's notification tray. Used for general news and scheme updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

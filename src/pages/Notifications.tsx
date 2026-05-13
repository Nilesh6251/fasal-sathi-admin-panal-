import { useState } from "react"
import { motion } from "framer-motion"
import { BellRing, Send, AlertOctagon, AlertTriangle, Info, Users, Store, Globe, Loader2 } from "lucide-react"
import { apiFetch } from "../hooks/useApi"
import { toast } from "../components/ui/Toast"

const PRIORITIES = [
  { value: "low",       label: "Low — General Info",     color: "text-blue-400",   border: "border-blue-500/30",   bg: "bg-blue-500/10"   },
  { value: "medium",    label: "Medium — Important",      color: "text-amber-400",  border: "border-amber-500/30",  bg: "bg-amber-500/10"  },
  { value: "high",      label: "High — Warning",          color: "text-rose-400",   border: "border-rose-500/30",   bg: "bg-rose-500/10"   },
  { value: "emergency", label: "EMERGENCY — Act Now",     color: "text-red-400",    border: "border-red-500/30",    bg: "bg-red-500/10"    },
]
const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "weather", label: "Weather Alert" },
  { value: "scheme",  label: "Government Scheme" },
  { value: "disease", label: "Disease Outbreak" },
]
const TARGETS = [
  { value: "",       label: "All Users",    icon: Globe },
  { value: "Farmer", label: "Farmers Only", icon: Users },
  { value: "Seller", label: "Sellers Only", icon: Store },
]

const inputCls = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"

export default function Notifications() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    priority: "medium",
    targetRole: "",
  })
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiFetch<{ success: boolean }>("/notifications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.success !== false) {
        toast.success("Alert broadcasted!", `Notification sent to ${form.targetRole || "all users"}.`)
        setForm({ title: "", message: "", type: "general", priority: "medium", targetRole: "" })
      }
    } catch (e: any) {
      toast.error("Broadcast failed", e.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedPriority = PRIORITIES.find(p => p.value === form.priority) ?? PRIORITIES[1]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Alert System</h1>
        <p className="text-sm text-gray-500 mt-1">Broadcast high-priority alerts and push notifications to farmers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-3 glass-panel rounded-2xl p-6 space-y-5"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" /> Send New Alert
          </h2>

          <form onSubmit={handleSend} className="space-y-5">
            {/* Priority + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Priority</label>
                <div className="flex flex-col gap-2">
                  {PRIORITIES.map(p => (
                    <label key={p.value} className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${form.priority === p.value ? `${p.border} ${p.bg}` : "border-white/10 hover:bg-white/[0.02]"}`}>
                      <input type="radio" name="priority" value={p.value} checked={form.priority === p.value} onChange={() => set("priority", p.value)} className="hidden" />
                      <div className={`w-2 h-2 rounded-full ${p.color.replace("text-", "bg-")}`} />
                      <span className={`text-xs font-medium ${form.priority === p.value ? p.color : "text-gray-400"}`}>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                <select value={form.type} onChange={e => set("type", e.target.value)}
                  className={inputCls + " bg-[#111] appearance-none"}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>

                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mt-4">Target Audience</label>
                <div className="space-y-2">
                  {TARGETS.map(t => (
                    <label key={t.value} className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${form.targetRole === t.value ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 hover:bg-white/[0.02]"}`}>
                      <input type="radio" name="target" value={t.value} checked={form.targetRole === t.value} onChange={() => set("targetRole", t.value)} className="hidden" />
                      <t.icon className={`w-3.5 h-3.5 ${form.targetRole === t.value ? "text-emerald-400" : "text-gray-500"}`} />
                      <span className={`text-xs font-medium ${form.targetRole === t.value ? "text-emerald-400" : "text-gray-400"}`}>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alert Title</label>
              <input
                type="text" required value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="e.g. Heavy Rainfall Expected Tomorrow"
                className={inputCls}
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</label>
              <textarea
                rows={4} required value={form.message}
                onChange={e => set("message", e.target.value)}
                placeholder="Full notification message..."
                className={inputCls + " resize-none"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className={`w-full font-bold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 ${
                form.priority === "emergency"
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                  : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BellRing className="w-5 h-5" />}
              {loading ? "Broadcasting..." : "Broadcast Alert"}
            </button>
          </form>
        </motion.div>

        {/* Priority guide */}
        <motion.div
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Priority Guide</h3>

            {[
              { icon: AlertOctagon, color: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/20",   label: "EMERGENCY",  desc: "Full-screen popup + loud alarm on farmer app. Use ONLY for cyclones, severe floods, or critical disease outbreaks." },
              { icon: AlertTriangle,color: "text-rose-400",  bg: "bg-rose-500/10",  border: "border-rose-500/20",  label: "High",       desc: "Push notification with vibration. Use for important market changes or heavy rain warnings." },
              { icon: AlertTriangle,color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Medium",     desc: "Standard notification. Use for scheme updates or upcoming pest risk." },
              { icon: Info,         color: "text-blue-400",  bg: "bg-blue-500/10",  border: "border-blue-500/20",  label: "Low",        desc: "Silent notification in the app tray. General info and non-urgent updates." },
            ].map((item, i) => (
              <div key={i} className={`flex gap-3 p-4 rounded-xl border ${item.border} ${item.bg}`}>
                <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className={`text-sm font-bold ${item.color}`}>{item.label}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Preview card */}
          <div className={`glass-panel rounded-2xl p-5 border ${selectedPriority.border}`}>
            <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Live Preview</p>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl ${selectedPriority.bg} flex items-center justify-center`}>
                <BellRing className={`w-4 h-4 ${selectedPriority.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{form.title || "Your alert title"}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.message || "Your alert message will appear here..."}</p>
                <p className="text-xs text-gray-600 mt-1.5">Just now · {form.targetRole || "All users"}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

import { useState, useEffect } from "react"
import { X, Pencil, CalendarDays, MapPin, Users, LinkIcon, ChevronDown, Save, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "../../hooks/useApi"
import { toast } from "../ui/Toast"

export interface Scheme {
  id: number
  name: string
  short_description: string
  full_description?: string
  banner_image?: string
  start_date?: string
  last_date_to_apply?: string
  end_date?: string
  min_age?: number
  max_age?: number
  gender?: string
  caste?: string
  state?: string
  apply_link?: string
  status: "upcoming" | "running" | "ended"
  created_at: string
  updated_at?: string
}

interface SchemeModalProps {
  scheme: Scheme | null
  mode: "view" | "edit"
  onClose: () => void
  onSaved?: (updated: Scheme) => void
}

const STATUS_COLORS: Record<string, string> = {
  running: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ended: "bg-gray-500/15 text-gray-400 border-gray-500/30",
}

const STATES = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
]

export default function SchemeModal({ scheme, mode, onClose, onSaved }: SchemeModalProps) {
  const [isEdit, setIsEdit] = useState(mode === "edit")
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Scheme>>({})
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  useEffect(() => {
    if (scheme) {
      setForm({ ...scheme })
      setBannerPreview(scheme.banner_image ? `http://localhost:5000/${scheme.banner_image}` : null)
    }
    setIsEdit(mode === "edit")
  }, [scheme, mode])

  if (!scheme) return null

  const set = (key: keyof Scheme, value: any) =>
    setForm((p) => ({ ...p, [key]: value }))

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    if (!scheme) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null && k !== "id" && k !== "banner_image" && k !== "created_at" && k !== "updated_at") {
          if (k === "status") fd.append("scheme_status", String(v))
          else fd.append(k, String(v))
        }
      })
      if (bannerFile) fd.append("banner", bannerFile)

      const updated = await apiFetch<Scheme>(`/schemes/${scheme.id}`, {
        method: "PUT",
        body: fd,
      })
      toast.success("Scheme updated!", `"${updated.name}" saved successfully.`)
      onSaved?.(updated)
      onClose()
    } catch (e: any) {
      toast.error("Update failed", e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border border-white/10 rounded-3xl shadow-2xl scrollbar-hide"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0D0D0D]">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[form.status || scheme.status]}`}>
                {(form.status || scheme.status).charAt(0).toUpperCase() + (form.status || scheme.status).slice(1)}
              </span>
              {isEdit && <span className="flex items-center gap-1 text-xs text-emerald-400"><Pencil className="w-3 h-3" /> Editing</span>}
            </div>
            <div className="flex items-center gap-2">
              {mode !== "view" && (
                <button
                  onClick={() => setIsEdit((v) => !v)}
                  className="px-3 py-1.5 text-xs font-medium border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  {isEdit ? "Cancel edit" : "Edit"}
                </button>
              )}
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="relative h-44 bg-gradient-to-br from-emerald-900/30 to-black overflow-hidden">
            {bannerPreview ? (
              <img src={bannerPreview} alt="banner" className="w-full h-full object-cover opacity-70" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Banner</div>
            )}
            {isEdit && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer hover:bg-black/60 transition-colors">
                <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white font-medium backdrop-blur-sm">Change Banner</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleBanner} />
              </label>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Name */}
            {isEdit ? (
              <input
                value={form.name || ""}
                onChange={(e) => set("name", e.target.value)}
                className="w-full text-2xl font-bold bg-transparent border-b border-white/10 focus:border-emerald-500/50 outline-none pb-1 text-white transition-colors"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white">{scheme.name}</h2>
            )}

            {/* Short description */}
            {isEdit ? (
              <input
                value={form.short_description || ""}
                onChange={(e) => set("short_description", e.target.value)}
                className="w-full text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 focus:outline-none focus:border-emerald-500/50"
                placeholder="Short description"
              />
            ) : (
              <p className="text-gray-400 text-sm">{scheme.short_description}</p>
            )}

            {/* Dates row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["start_date", "last_date_to_apply", "end_date"] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <label className="flex items-center gap-1 text-xs text-gray-500 uppercase font-medium">
                    <CalendarDays className="w-3 h-3" />
                    {field === "start_date" ? "Start Date" : field === "last_date_to_apply" ? "Last Apply" : "End Date"}
                  </label>
                  {isEdit ? (
                    <input
                      type="date"
                      value={form[field] || ""}
                      onChange={(e) => set(field, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  ) : (
                    <span className="text-sm text-white font-medium">{scheme[field] || "—"}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Eligibility */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                <Users className="w-4 h-4 text-emerald-400" /> Eligibility
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Age */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Min Age</label>
                  {isEdit ? (
                    <input type="number" value={form.min_age || ""} onChange={(e) => set("min_age", e.target.value ? Number(e.target.value) : null)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                  ) : <span className="block text-sm text-white font-medium">{scheme.min_age ?? "—"}</span>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Max Age</label>
                  {isEdit ? (
                    <input type="number" value={form.max_age || ""} onChange={(e) => set("max_age", e.target.value ? Number(e.target.value) : null)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                  ) : <span className="block text-sm text-white font-medium">{scheme.max_age ?? "—"}</span>}
                </div>
                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Gender</label>
                  {isEdit ? (
                    <select value={form.gender || "all"} onChange={(e) => set("gender", e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                      {["all", "male", "female", "other"].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  ) : <span className="block text-sm text-white font-medium capitalize">{scheme.gender || "—"}</span>}
                </div>
                {/* Caste */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Caste</label>
                  {isEdit ? (
                    <select value={form.caste || "all"} onChange={(e) => set("caste", e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                      {["all", "general", "obc", "sc", "st"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                  ) : <span className="block text-sm text-white font-medium uppercase">{scheme.caste || "—"}</span>}
                </div>
              </div>
              {/* State */}
              <div className="mt-3 space-y-1">
                <label className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" /> State</label>
                {isEdit ? (
                  <div className="relative">
                    <select value={form.state || "All India"} onChange={(e) => set("state", e.target.value)} className="w-full appearance-none bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 pr-8">
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                ) : <span className="block text-sm text-white font-medium">{scheme.state || "—"}</span>}
              </div>
            </div>

            {/* Status (edit only) */}
            {isEdit && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase font-medium">Status</label>
                <div className="flex gap-2">
                  {["upcoming", "running", "ended"].map((s) => (
                    <button key={s} onClick={() => set("status", s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
                        form.status === s ? STATUS_COLORS[s] : "border-white/10 text-gray-500 hover:border-white/20"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Apply link */}
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs text-gray-500"><LinkIcon className="w-3 h-3" /> Apply Link</label>
              {isEdit ? (
                <input value={form.apply_link || ""} onChange={(e) => set("apply_link", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="https://" />
              ) : scheme.apply_link ? (
                <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:underline break-all">{scheme.apply_link}</a>
              ) : <span className="text-sm text-gray-600">No link provided</span>}
            </div>

            {/* Full description */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase font-medium">Full Description</label>
              {isEdit ? (
                <textarea value={form.full_description || ""} onChange={(e) => set("full_description", e.target.value)} rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 resize-none" />
              ) : (
                <p className="text-sm text-gray-400 leading-relaxed">{scheme.full_description || "No full description provided."}</p>
              )}
            </div>

            {/* Save button */}
            {isEdit && (
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

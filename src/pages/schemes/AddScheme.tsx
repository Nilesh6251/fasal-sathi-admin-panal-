import { useState, useRef } from "react"
import {
  ShieldCheck, Plus, Upload, CalendarDays, MapPin, Users,
  LinkIcon, ChevronDown, Loader2, X, ImageIcon, ArrowLeft
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../hooks/useApi"
import { toast } from "../../components/ui/Toast"
import type { Scheme } from "../../components/schemes/SchemeModal"

const STATES = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
]

interface FormData {
  name: string
  short_description: string
  full_description: string
  start_date: string
  last_date_to_apply: string
  end_date: string
  min_age: string
  max_age: string
  gender: string
  caste: string
  state: string
  apply_link: string
  status: string
}

const defaultForm: FormData = {
  name: "", short_description: "", full_description: "",
  start_date: "", last_date_to_apply: "", end_date: "",
  min_age: "", max_age: "", gender: "all", caste: "all",
  state: "All India", apply_link: "", status: "upcoming",
}

function InputField({ label, icon: Icon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
        {Icon && <Icon className="w-3.5 h-3.5 text-emerald-500" />}
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
      />
    </div>
  )
}

function SelectField({ label, icon: Icon, children, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
        {Icon && <Icon className="w-3.5 h-3.5 text-emerald-500" />}
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all pr-8"
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  )
}

export default function AddScheme() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(() => {
    try {
      const prefill = localStorage.getItem("scheme_prefill")
      if (prefill) {
        localStorage.removeItem("scheme_prefill")
        return { ...defaultForm, ...JSON.parse(prefill) }
      }
    } catch { /* ignore */ }
    return defaultForm
  })
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const validate = (): boolean => {
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = "Scheme name is required"
    if (!form.short_description.trim()) errs.short_description = "Short description is required"
    if (form.min_age && form.max_age && Number(form.min_age) > Number(form.max_age))
      errs.max_age = "Max age must be ≥ min age"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error("Validation failed", "Please fix the highlighted fields.")
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("name", form.name)
      fd.append("short_description", form.short_description)
      if (form.full_description) fd.append("full_description", form.full_description)
      if (form.start_date) fd.append("start_date", form.start_date)
      if (form.last_date_to_apply) fd.append("last_date_to_apply", form.last_date_to_apply)
      if (form.end_date) fd.append("end_date", form.end_date)
      if (form.min_age) fd.append("min_age", form.min_age)
      if (form.max_age) fd.append("max_age", form.max_age)
      fd.append("gender", form.gender)
      fd.append("caste", form.caste)
      fd.append("state", form.state)
      if (form.apply_link) fd.append("apply_link", form.apply_link)
      fd.append("scheme_status", form.status)
      if (bannerFile) fd.append("banner", bannerFile)

      await apiFetch<Scheme>("/schemes/", { method: "POST", body: fd })
      toast.success("Scheme created!", `"${form.name}" has been added successfully.`)
      navigate("/schemes/running")
    } catch (err: any) {
      toast.error("Failed to create scheme", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(defaultForm)
    setBannerFile(null)
    setBannerPreview(null)
    setErrors({})
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Add New Scheme</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create a government scheme for farmers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Upload */}
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div
            className="relative h-52 bg-gradient-to-br from-emerald-950/40 to-black cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            {bannerPreview ? (
              <>
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setBannerFile(null); setBannerPreview(null) }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/60 border border-white/20 rounded-full text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600 group-hover:text-gray-400 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Click to upload banner image</span>
                <span className="text-xs">PNG, JPG up to 10MB</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
          </div>
        </div>

        {/* Basic Info */}
        <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Basic Information
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Scheme Name *</label>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. PM Kisan Samman Nidhi"
              className={`w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all ${
                errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-emerald-500/50 focus:bg-white/[0.05]"
              }`}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Short Description *</label>
            <input
              value={form.short_description}
              onChange={set("short_description")}
              placeholder="Brief summary shown in cards"
              className={`w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all ${
                errors.short_description ? "border-red-500/50" : "border-white/10 focus:border-emerald-500/50 focus:bg-white/[0.05]"
              }`}
            />
            {errors.short_description && <p className="text-xs text-red-400">{errors.short_description}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Full Description</label>
            <textarea
              value={form.full_description}
              onChange={set("full_description")}
              rows={4}
              placeholder="Detailed scheme description, benefits, how to apply..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <InputField label="Apply Link" icon={LinkIcon} type="url" value={form.apply_link} onChange={set("apply_link")} placeholder="https://scheme.gov.in/apply" />
          </div>
        </div>

        {/* Dates */}
        <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
            <CalendarDays className="w-4 h-4 text-emerald-400" /> Important Dates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Start Date" icon={CalendarDays} type="date" value={form.start_date} onChange={set("start_date")} />
            <InputField label="Last Date to Apply" icon={CalendarDays} type="date" value={form.last_date_to_apply} onChange={set("last_date_to_apply")} />
            <InputField label="End Date" icon={CalendarDays} type="date" value={form.end_date} onChange={set("end_date")} />
          </div>
        </div>

        {/* Eligibility */}
        <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-400" /> Eligibility Criteria
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase">Min Age</label>
              <input type="number" min={0} max={120} value={form.min_age} onChange={set("min_age")} placeholder="e.g. 18"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase">Max Age</label>
              <input type="number" min={0} max={120} value={form.max_age} onChange={set("max_age")} placeholder="e.g. 60"
                className={`w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all ${errors.max_age ? "border-red-500/50" : "border-white/10 focus:border-emerald-500/50"}`} />
              {errors.max_age && <p className="text-xs text-red-400">{errors.max_age}</p>}
            </div>
            <SelectField label="Gender" icon={Users} value={form.gender} onChange={set("gender")}>
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </SelectField>
            <SelectField label="Caste" value={form.caste} onChange={set("caste")}>
              <option value="all">All</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
            </SelectField>
          </div>
          <div className="relative">
            <label className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> State
            </label>
            <div className="relative">
              <select value={form.state} onChange={set("state")}
                className="w-full appearance-none bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all pr-8">
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Scheme Status</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { value: "upcoming", label: "Upcoming", color: "border-blue-500/50 bg-blue-500/10 text-blue-400" },
              { value: "running", label: "Running", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" },
              { value: "ended", label: "Ended", color: "border-gray-500/50 bg-gray-500/10 text-gray-400" },
            ].map(({ value, label, color }) => (
              <button key={value} type="button" onClick={() => setForm(p => ({ ...p, status: value }))}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  form.status === value ? color : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                }`}>{label}</button>
            ))}
          </div>
          <p className="text-xs text-gray-600">Status auto-updates based on dates. Manual override allowed.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-60 shadow-lg shadow-emerald-500/20">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Creating..." : "Create Scheme"}
          </button>
          <button type="button" onClick={handleReset}
            className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors font-medium">
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  )
}

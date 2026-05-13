import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck, Wheat, Sun, Leaf, CloudRain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import logoSvg from "../assets/Logo.svg"

const FEATURE_PILLS = [
  { icon: Wheat,     label: "Crop Analytics" },
  { icon: Sun,       label: "Weather Alerts" },
  { icon: CloudRain, label: "Mandi Prices"   },
  { icon: Leaf,      label: "AI Powered"     },
]

const STATS = [
  { value: "12,456", label: "Active Farmers" },
  { value: "8,234",  label: "Verified IDs"   },
  { value: "45+",    label: "Live Schemes"   },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail]       = useState("admin@fasalsathi.com")
  const [password, setPassword] = useState("admin123")
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.access_token) {
        login(data.access_token)
        navigate("/")
      } else {
        setError(data.message || "Invalid credentials. Please try again.")
      }
    } catch {
      setError("Cannot connect to backend. Please ensure the server is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#080808] overflow-hidden">

      {/* ── Left panel — full branding ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f0a] via-[#050d05] to-[#0a0a14]" />
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-5%]  w-[500px] h-[500px] bg-emerald-500/8  rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-lime-500/6    rounded-full blur-[100px]" />
        <div className="absolute top-[40%]  right-[15%]  w-[200px] h-[200px] bg-cyan-500/5     rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(52,211,153,1) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Top — Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur p-1.5 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
            <img src={logoSvg} alt="FasalSathi Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Fasal<span className="text-emerald-400">Sathi</span>
          </span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 tracking-widest">ADMIN</span>
        </motion.div>

        {/* Center — Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10 max-w-xl"
        >
          {/* Big logo display */}
          <div className="mb-10 relative w-36 h-36">
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-2xl" />
            <div className="relative w-36 h-36 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur flex items-center justify-center p-5 shadow-[0_0_40px_rgba(52,211,153,0.15)]">
              <img src={logoSvg} alt="FasalSathi" className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
            </div>
          </div>

          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Smart{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400">
              Agriculture
            </span>
            <br />Management.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Monitor farmers, manage government schemes, track mandi prices, and analyze AI performance — all in one powerful admin console.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2.5 mt-8">
            {FEATURE_PILLS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 10 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-2 bg-white/[0.04] backdrop-blur border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default"
              >
                <item.icon className="w-3.5 h-3.5 text-emerald-400" />
                {item.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom — Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="group">
                <p className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-0.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-gray-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Secured with JWT Authentication · TLS Encrypted
          </div>
        </motion.div>
      </div>

      {/* ── Vertical divider glow ──────────────────────────────────────── */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />

      {/* ── Right panel — login form ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-[#080808]">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-[150px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 30 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center">
              <img src={logoSvg} alt="FasalSathi" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-white">
              Fasal<span className="text-emerald-400">Sathi</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-1.5 text-sm">Sign in to access the admin dashboard</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@fasalsathi.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(52,211,153,0.1)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs text-emerald-500 hover:text-emerald-400 font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(52,211,153,0.1)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-5 h-5 rounded-md border border-white/10 bg-white/[0.03] peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                  <svg className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 transition-all group-hover:from-emerald-400 group-hover:to-lime-400" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {/* Glow */}
              <div className="absolute inset-0 shadow-[0_0_30px_rgba(52,211,153,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  "Sign In to Dashboard"
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-700 mt-8">
            Protected area &middot; Authorized personnel only &middot;{" "}
            <span className="text-emerald-700">FasalSathi Admin</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

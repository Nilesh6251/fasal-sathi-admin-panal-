import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Sprout, Lock, Mail, Leaf, Sun, CloudRain, Wheat } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login("mock_jwt_token_12345")
    navigate("/")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[350px] h-[350px] bg-white/5 rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] bg-white/3 rounded-full" />

        {/* Top logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FasalSathi</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Smart Agriculture<br />Management Platform
          </h2>
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            Monitor farmers, track mandi prices, manage government schemes, and analyze AI chatbot performance — all from one powerful dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: Wheat, label: "Crop Analytics" },
              { icon: Sun, label: "Weather Alerts" },
              { icon: CloudRain, label: "Mandi Prices" },
              { icon: Leaf, label: "AI Powered" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 text-sm text-white/90">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: "12,456", label: "Active Users" },
            { value: "8,234", label: "Farmers" },
            { value: "45", label: "Schemes" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-emerald-200/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 sm:p-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo — only shows on small screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 mb-3 shadow-lg shadow-emerald-500/25">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">FasalSathi</h1>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-gray-500 mt-1 text-sm">Enter your credentials to access the admin panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm shadow-sm"
                  placeholder="admin@fasalsathi.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-emerald-600 cursor-pointer" />
              <span className="text-sm text-gray-500">Keep me signed in</span>
            </label>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl py-3 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Protected area · Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from "react"
import { Activity, MapPin, AlertCircle, TrendingUp } from "lucide-react"

export default function DiseaseAnalysis() {
  const [reports, setReports] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const headers = { 'Authorization': `Bearer ${token}` }
        
        const [reportsRes, analyticsRes] = await Promise.all([
          fetch('http://localhost:5000/api/disease', { headers }),
          fetch('http://localhost:5000/api/disease/analytics', { headers })
        ])
        
        const reportsData = await reportsRes.json()
        const analyticsData = await analyticsRes.json()
        
        if (reportsData.success) setReports(reportsData.data)
        if (analyticsData.success) setAnalytics(analyticsData.data)
      } catch (error) {
        console.error('Failed to fetch disease data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading disease data...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">Disease Analysis</h1>
          <p className="text-base text-slate-500 mt-2">AI-powered crop disease monitoring across regions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-4">
        <div className="bg-white/70 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-500/10 rounded-xl">
              <Activity className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Reports</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{analytics?.totalReports || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-rose-500/10 rounded-xl">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Critical Outbreaks</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{analytics?.criticalReports || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">AI Accuracy</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">94.2%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm overflow-hidden mt-2">
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-xl font-bold text-slate-800">Recent Disease Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base text-left">
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-8 py-5 font-semibold">Crop</th>
                <th className="px-8 py-5 font-semibold">Disease</th>
                <th className="px-8 py-5 font-semibold">Severity</th>
                <th className="px-8 py-5 font-semibold">Location</th>
                <th className="px-8 py-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-medium text-slate-800">{report.cropName}</td>
                  <td className="px-8 py-5 text-slate-600">{report.diseaseName}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      report.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      report.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      {report.district}, {report.state}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${report.isResolved ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                      {report.isResolved ? 'Resolved' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-slate-500 text-lg">No disease reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

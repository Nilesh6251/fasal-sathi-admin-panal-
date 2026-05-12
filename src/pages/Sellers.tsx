import { useState, useEffect } from "react"
import { Store, CheckCircle, Clock } from "lucide-react"

export default function Sellers() {
  const [sellers, setSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const response = await fetch('http://localhost:5000/api/sellers', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        if (data.success) {
          setSellers(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch sellers', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [])

  const handleApprove = async (id: string, status: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      await fetch(`http://localhost:5000/api/sellers/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isApproved: status })
      })
      // Update local state
      setSellers(sellers.map(s => s.id === id ? { ...s, isApproved: status } : s))
    } catch (error) {
      console.error('Failed to update seller', error)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading sellers...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">Seller Management</h1>
          <p className="text-base text-slate-500 mt-2">Manage marketplace sellers and verify their businesses</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base text-left">
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-8 py-5 font-semibold">Business Name</th>
                <th className="px-8 py-5 font-semibold">User details</th>
                <th className="px-8 py-5 font-semibold">GST Number</th>
                <th className="px-8 py-5 font-semibold">Status</th>
                <th className="px-8 py-5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-medium text-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                        <Store className="w-6 h-6 text-indigo-500" />
                      </div>
                      <span className="text-lg">{seller.businessName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-slate-800 font-medium">{seller.user?.name}</p>
                    <p className="text-sm text-slate-500">{seller.user?.phone}</p>
                  </td>
                  <td className="px-8 py-5 text-slate-600 font-mono text-sm">{seller.gstNumber || 'N/A'}</td>
                  <td className="px-8 py-5">
                    {seller.isApproved ? (
                      <span className="flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full w-fit text-sm">
                        <CheckCircle className="w-5 h-5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-amber-600 font-medium bg-amber-50 px-3 py-1.5 rounded-full w-fit text-sm">
                        <Clock className="w-5 h-5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {!seller.isApproved ? (
                      <button 
                        onClick={() => handleApprove(seller.id, true)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-semibold transition-colors shadow-sm shadow-emerald-500/20"
                      >
                        Approve
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApprove(seller.id, false)}
                        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 text-sm font-semibold transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {sellers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-slate-500 text-lg">No sellers registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

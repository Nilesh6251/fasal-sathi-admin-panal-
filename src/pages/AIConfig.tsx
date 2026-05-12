import { useState, useEffect } from "react"
import { Save, Zap, AlertTriangle } from "lucide-react"

export default function AIConfig() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('http://localhost:5000/api/ai-config', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setConfig(data.data)
    } catch (error) {
      console.error('Failed to fetch AI config', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccessMsg('')
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('http://localhost:5000/api/ai-config', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })
      const data = await res.json()
      if (data.success) {
        setSuccessMsg('Configuration saved successfully!')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (error) {
      console.error('Failed to update config', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !config) return <div className="p-8 text-center">Loading AI Config...</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">AI Configuration</h1>
          <p className="text-base text-slate-500 mt-2">Manage Groq Llama Master Prompt and Chatbot settings</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-sm space-y-8 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${config.isEnabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              <Zap className={`w-7 h-7 ${config.isEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Master Switch</h3>
              <p className="text-base text-slate-500">Enable or disable the AI Chatbot globally</p>
            </div>
          </div>
          <button 
            onClick={() => setConfig({ ...config, isEnabled: !config.isEnabled })}
            className={`px-5 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              config.isEnabled ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {config.isEnabled ? 'Disable Chatbot' : 'Enable Chatbot'}
          </button>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-6">
          <div>
            <label className="block text-base font-bold text-slate-700 mb-2">Master System Prompt</label>
            <p className="text-sm text-slate-500 mb-3">This prompt tells the AI how to behave and what to answer.</p>
            <textarea 
              value={config.masterPrompt}
              onChange={(e) => setConfig({ ...config, masterPrompt: e.target.value })}
              className="w-full h-48 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none font-mono text-base leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">AI Model Name</label>
              <input 
                type="text"
                value={config.modelName}
                onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
                className="w-full px-5 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">Temperature (0.0 - 1.0)</label>
              <input 
                type="number"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full px-5 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-slate-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> 
              Bad Words Filter (Comma separated)
            </label>
            <input 
              type="text"
              value={config.badWords || ''}
              onChange={(e) => setConfig({ ...config, badWords: e.target.value })}
              className="w-full px-5 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600"
              placeholder="e.g. abuse, scam, spam"
            />
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-slate-100">
          <span className="text-emerald-600 font-medium text-base">{successMsg}</span>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 text-base font-semibold shadow-md shadow-slate-800/20"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  )
}

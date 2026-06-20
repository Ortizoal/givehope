import { useEffect, useState } from 'react'
import { getAdminDashboard } from '../../services/api'
import { DollarSign, Heart, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboard().then(res => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" /></div>

  const stats = [
    { label: 'Total Raised', value: `$${Number(data.total_raised).toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-green-500' },
    { label: 'Donations', value: data.total_donations, icon: <TrendingUp className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Active Causes', value: data.active_causes, icon: <Heart className="w-6 h-6" />, color: 'bg-primary-600' },
    { label: 'Total Users', value: data.total_users, icon: <Users className="w-6 h-6" />, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="card p-6">
            <div className={`${s.color} text-white rounded-lg p-3 w-fit mb-4`}>{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Donations</h2>
        <div className="space-y-3">
          {data.recent_donations?.map(d => (
            <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900 text-sm">{d.user?.name}</p>
                <p className="text-xs text-gray-500">{d.cause?.title}</p>
              </div>
              <span className="font-bold text-gray-900">${Number(d.amount).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

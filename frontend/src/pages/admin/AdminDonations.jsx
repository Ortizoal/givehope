import { useEffect, useState } from 'react'
import { getAdminDonations } from '../../services/api'

export default function AdminDonations() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDonations().then(res => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Donations</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>{['Donor', 'Cause', 'Amount', 'Status', 'Date'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.data?.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{d.user?.name}<p className="text-xs text-gray-400">{d.user?.email}</p></td>
                <td className="px-4 py-3 text-gray-600">{d.cause?.title}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">${Number(d.amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.status === 'completed' ? 'bg-green-100 text-green-700' : d.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

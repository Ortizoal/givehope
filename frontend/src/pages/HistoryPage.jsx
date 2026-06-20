import { useEffect, useState } from 'react'
import { getDonationHistory } from '../services/api'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

const statusIcon = { completed: <CheckCircle className="w-5 h-5 text-green-500" />, pending: <Clock className="w-5 h-5 text-yellow-500" />, failed: <XCircle className="w-5 h-5 text-red-500" /> }

export default function HistoryPage() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDonationHistory().then(res => setDonations(res.data)).finally(() => setLoading(false))
  }, [])

  const total = donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + Number(d.amount), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
        {donations.length > 0 && (
          <p className="text-gray-500 mt-2">Total donated: <span className="font-semibold text-primary-600">${total.toLocaleString()}</span></p>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" /></div>
      ) : donations.length === 0 ? (
        <div className="text-center py-20 card p-12">
          <p className="text-gray-400 text-lg mb-4">No donations yet</p>
          <a href="/causes" className="btn-primary">Browse Causes</a>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map(d => (
            <div key={d.id} className="card p-5 flex items-center gap-4">
              {statusIcon[d.status] || statusIcon.pending}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{d.cause?.title ?? 'Unknown Cause'}</p>
                <p className="text-sm text-gray-500">{new Date(d.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {d.message && <p className="text-sm text-gray-400 italic mt-1">"{d.message}"</p>}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">${Number(d.amount).toLocaleString()}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.status === 'completed' ? 'bg-green-100 text-green-700' : d.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCause, createCheckout } from '../services/api'
import toast from 'react-hot-toast'

export default function DonatePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [cause, setCause] = useState(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const presets = [100, 500, 1000, 2500, 5000]

  useEffect(() => {
    getCause(slug).then(res => setCause(res.data)).catch(() => navigate('/causes'))
  }, [slug])

  const handleDonate = async (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount) || Number(amount) < 100) {
      toast.error('Please enter a valid amount (min ₦100)')
      return
    }
    setLoading(true)
    try {
      const res = await createCheckout({ cause_id: cause.id, amount: Number(amount), message })
      window.location.href = res.data.checkout_url
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create checkout session')
      setLoading(false)
    }
  }

  if (!cause) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" /></div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Donate to</h1>
        <p className="text-primary-600 font-semibold text-lg mb-6">{cause.title}</p>

        <form onSubmit={handleDonate} className="space-y-5">
          <div>
            <label className="label">Select Amount (₦)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {presets.map(p => (
                <button
                  key={p} type="button"
                  onClick={() => setAmount(p.toString())}
                  className={`py-2 rounded-lg text-sm font-semibold border transition
                    ${amount == p ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'}`}>
                  ₦{p.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number" placeholder="Or enter custom amount (₦)"
              value={amount} onChange={e => setAmount(e.target.value)}
              min="100" className="input"
            />
          </div>

          <div>
            <label className="label">Message (optional)</label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Leave a message of support..."
              rows={3} className="input resize-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Redirecting to Paystack...' : `Donate ₦${Number(amount || 0).toLocaleString()}`}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">Secured by Paystack. Your card details are never stored.</p>
      </div>
    </div>
  )
}


import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { verifyPayment } from '../services/api'

export default function DonateSuccessPage() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference') || searchParams.get('trxref')
  const [status, setStatus] = useState(reference ? 'verifying' : 'success')
  const [donation, setDonation] = useState(null)

  useEffect(() => {
    if (!reference) return
    verifyPayment(reference)
      .then(res => {
        setStatus(res.data.status === 'success' ? 'success' : 'pending')
        setDonation(res.data.donation)
      })
      .catch(() => setStatus('error'))
  }, [reference])

  if (status === 'verifying') return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <Loader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
      <p className="text-gray-600 text-lg">Verifying your payment...</p>
    </div>
  )

  if (status === 'error' || status === 'pending') return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <XCircle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Pending</h1>
      <p className="text-gray-600 mb-8">We couldn't confirm your payment yet. It may take a few minutes.</p>
      <Link to="/history" className="btn-primary">Check Donation History</Link>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>
      <p className="text-gray-600 text-lg mb-2">Your donation was successful.</p>
      {donation && (
        <p className="text-primary-600 font-semibold mb-2">
          ₦{Number(donation.amount).toLocaleString()} donated to {donation.cause?.title}
        </p>
      )}
      <p className="text-gray-500 mb-8">A confirmation email has been sent to your inbox.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/history" className="btn-primary">View My Donations</Link>
        <Link to="/causes" className="btn-secondary">Browse More Causes</Link>
      </div>
    </div>
  )
}


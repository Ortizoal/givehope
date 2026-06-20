import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCause } from '../services/api'
import ProgressBar from '../components/ProgressBar'
import { useAuth } from '../contexts/AuthContext'
import { Heart } from 'lucide-react'

export default function CauseDetailPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [cause, setCause] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCause(slug).then(res => setCause(res.data)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" /></div>
  if (!cause) return <p className="text-center py-20 text-gray-500">Cause not found.</p>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card overflow-hidden">
        {cause.image_url && (
          <img src={cause.image_url} alt={cause.title} className="w-full h-72 object-cover" />
        )}
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{cause.title}</h1>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full
              ${cause.status === 'active' ? 'bg-green-100 text-green-700' :
                cause.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {cause.status}
            </span>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">{cause.description}</p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-2xl font-bold text-primary-600">${Number(cause.raised_amount).toLocaleString()}</span>
              <span className="text-gray-500">of ${Number(cause.goal_amount).toLocaleString()} goal</span>
            </div>
            <ProgressBar percent={cause.progress_percent} className="mb-2" />
            <div className="text-sm text-gray-500 text-right">{cause.progress_percent}% funded</div>
          </div>

          {cause.status === 'active' && (
            user ? (
              <Link to={`/donate/${cause.slug}`} className="btn-primary flex items-center justify-center gap-2 text-base py-3 w-full">
                <Heart className="w-5 h-5" /> Donate Now
              </Link>
            ) : (
              <Link to="/login" className="btn-primary flex items-center justify-center gap-2 text-base py-3 w-full">
                Login to Donate
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'

export default function CauseCard({ cause }) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {cause.image_url ? (
          <img src={cause.image_url} alt={cause.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">💙</div>
        )}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full
          ${cause.status === 'active' ? 'bg-green-100 text-green-700' :
            cause.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{cause.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{cause.description}</p>
        <ProgressBar percent={cause.progress_percent} />
        <div className="flex justify-between text-sm mt-2 mb-4">
          <span className="text-primary-600 font-semibold">${Number(cause.raised_amount).toLocaleString()} raised</span>
          <span className="text-gray-500">of ${Number(cause.goal_amount).toLocaleString()}</span>
        </div>
        <Link to={`/causes/${cause.slug}`} className="btn-primary w-full block text-center text-sm">
          Learn More
        </Link>
      </div>
    </div>
  )
}

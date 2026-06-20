import { useEffect, useState } from 'react'
import { getCauses } from '../services/api'
import CauseCard from '../components/CauseCard'
import { Search } from 'lucide-react'

export default function CausesPage() {
  const [causes, setCauses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCauses().then(res => setCauses(res.data)).finally(() => setLoading(false))
  }, [])

  const filtered = causes.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Causes</h1>
        <p className="text-gray-500 text-lg">Find a cause you're passionate about and make a difference</p>
        <div className="relative mt-6 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search causes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No causes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cause => <CauseCard key={cause.id} cause={cause} />)}
        </div>
      )}
    </div>
  )
}

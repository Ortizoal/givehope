import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCauses } from '../services/api'
import CauseCard from '../components/CauseCard'
import { Heart, Users, Globe, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [causes, setCauses] = useState([])

  useEffect(() => {
    getCauses().then(res => setCauses(res.data.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Make a Difference<br />One Donation at a Time
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of donors supporting life-changing causes around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/causes" className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition">
              Browse Causes
            </Link>
            <Link to="/register" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Heart className="w-8 h-8 text-primary-600 mx-auto mb-3" />, value: '$2M+', label: 'Total Raised' },
              { icon: <Users className="w-8 h-8 text-primary-600 mx-auto mb-3" />, value: '10,000+', label: 'Donors' },
              { icon: <Globe className="w-8 h-8 text-primary-600 mx-auto mb-3" />, value: '50+', label: 'Active Causes' },
            ].map((s, i) => (
              <div key={i} className="p-6">
                {s.icon}
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Causes</h2>
              <p className="text-gray-500 mt-2">Support the causes that matter most</p>
            </div>
            <Link to="/causes" className="flex items-center gap-1 text-primary-600 font-medium hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {causes.map(cause => <CauseCard key={cause.id} cause={cause} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16 sm:py-20 text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
        <p className="text-primary-100 mb-8 text-lg">Create your free account and start donating today.</p>
        <Link to="/register" className="bg-white text-primary-600 font-bold px-10 py-4 rounded-lg hover:bg-primary-50 transition text-lg">
          Join GiveHope
        </Link>
      </section>
    </div>
  )
}

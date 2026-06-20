export default function ProgressBar({ percent, className = '' }) {
  const pct = Math.min(100, Math.max(0, percent || 0))
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

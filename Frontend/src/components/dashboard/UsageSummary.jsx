import { memo } from 'react'
import { BarChart3 } from 'lucide-react'
import { getUsageSummary } from '../../utils/analytics'

function UsageSummary() {
  const metrics = getUsageSummary()

  const items = [
    { label: 'Projects', value: metrics.projectsCreated },
    { label: 'Blocks Added', value: metrics.blocksAdded },
    { label: 'Exports', value: metrics.exports },
    { label: 'Saves', value: metrics.saveCount },
    { label: 'Session Time', value: `${Math.round((metrics.sessionTime || 0) / 60)}m` },
  ]

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold font-display">Usage Summary</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-2xl font-bold text-primary-600">{item.value}</p>
            <p className="text-xs text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(UsageSummary)

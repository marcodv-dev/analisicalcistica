import { useMatches } from '../hooks/useMatches'
import { useStats } from '../hooks/useStats'
import { useTags } from '../hooks/useTags'
import DashboardView from '../components/dashboard/DashboardView'

export default function DashboardPage() {
  const { matches, loading } = useMatches()
  const { tags } = useTags()
  const stats = useStats(matches)

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Home</h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {stats.totalMatches} partite
        </span>
      </div>
      <div className="page-content">
        <DashboardView matches={matches} stats={stats} tags={tags} />
      </div>
    </>
  )
}

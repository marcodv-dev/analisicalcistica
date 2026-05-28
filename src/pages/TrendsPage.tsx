import { useMemo } from 'react'
import { useMatches } from '../hooks/useMatches'
import { useStats, useHomeAwayStats, useStarterSubStats } from '../hooks/useStats'
import TrendsView from '../components/trends/TrendsView'
import trend from '../assets/trend.png'

export default function TrendsPage() {
  const { matches, loading } = useMatches()
  const stats = useStats(matches)
  const homeAway = useHomeAwayStats(matches)
  const starterSub = useStarterSubStats(matches)

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title"><img className='icon-img' src={trend} alt="" />Trend</h1>
      </div>
      <div className="page-content">
        <TrendsView matches={matches} stats={stats} homeAway={homeAway} starterSub={starterSub} />
      </div>
    </>
  )
}

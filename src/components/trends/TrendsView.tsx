import { useMemo } from 'react'
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ArcElement, PieController } from 'chart.js'
import type { Match, AggregatedStats } from '../../types'
import RatingLineChart from './RatingLineChart'
import PieChart from './PieChart'
import graph2 from '../../assets/statistic.png'
import home from '../../assets/house.png'
import plane from '../../assets/plane.png'
import start from '../../assets/play.png'
import sub from '../../assets/two-arrows.png'
import goal from '../../assets/goal.png'
import doc from '../../assets/clipboard.png'

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ArcElement, PieController)

interface Props {
  matches: Match[]
  stats: AggregatedStats
  homeAway: { home: AggregatedStats | null; away: AggregatedStats | null }
  starterSub: { starter: AggregatedStats | null; substitute: AggregatedStats | null }
}

export default function TrendsView({ matches, stats, homeAway, starterSub }: Props) {
  const sortedMatches = useMemo(() =>
    [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [matches]
  )

  const goalContributionPct = useMemo(() => {
    if (matches.length === 0) return 0
    const totalGoals = matches.reduce((s, m) => s + m.teamScore, 0)
    if (totalGoals === 0) return 0
    const contributions = matches.reduce((s, m) => s + m.goals + m.assists, 0)
    return Math.round((contributions / totalGoals) * 100)
  }, [matches])

  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Nessun dato</div>
        <div className="empty-state-text">Aggiungi partite per vedere i trend</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Rating Timeline */}
      <div className="card">
        <span className="card-title" style={{ display: 'block', marginBottom: 12 }}>
          <img className='icon-img' src={graph2} alt="" /> Andamento Voti
        </span>
        <RatingLineChart matches={sortedMatches} />
      </div>

      {/* Casa vs Fuori */}
      <div className="card">
        <span className="card-title" style={{ display: 'flex', marginBottom: 12, gap:5 }}>
          <img className='icon-img' src={home} alt="" /> Casa vs <img className='icon-img' src={plane} alt="" /> Fuori
        </span>
        <div className="grid-2">
          <div className="stat-card">
            <div className="stat-label">Media voto Casa</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              {homeAway.home?.avgSelfRating || '—'}
            </div>
            <div className="stat-label">{homeAway.home?.totalMatches || 0} partite</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Media voto Fuori</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              {homeAway.away?.avgSelfRating || '—'}
            </div>
            <div className="stat-label">{homeAway.away?.totalMatches || 0} partite</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }} className="grid-2">
          <div className="stat-card">
            <div className="stat-label">Gol Casa</div>
            <div className="stat-value">{homeAway.home?.totalGoals || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Gol Fuori</div>
            <div className="stat-value">{homeAway.away?.totalGoals || 0}</div>
          </div>
        </div>
      </div>

      {/* Titolare vs Subentrato */}
      <div className="card">
        <span className="card-title" style={{ display: 'flex', marginBottom: 12, gap:5, justifyContent:'space-between' }}>
          <div style={{ display: 'flex', gap:5}}><img className='icon-img' src={start} alt="" /> Titolare</div>
          vs
          <div style={{ display: 'flex', gap:5}}><img className='icon-img' src={sub} alt="" /> Subentrato</div>
        </span>
        <div className="grid-2">
          <div className="stat-card" style={{ borderLeft: '3px solid var(--success)' }}>
            <div className="stat-label">Da titolare</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {starterSub.starter?.avgSelfRating || '—'}
            </div>
            <div className="stat-label">{starterSub.starter?.totalMatches || 0} partite</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--warning)' }}>
            <div className="stat-label">Da subentrato</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              {starterSub.substitute?.avgSelfRating || '—'}
            </div>
            <div className="stat-label">{starterSub.substitute?.totalMatches || 0} partite</div>
          </div>
        </div>
      </div>

      {/* Goal Contribution */}
      <div className="card">
        <span className="card-title" style={{ display: 'flex', marginBottom: 12, gap:5 }}>
          <img className='icon-img' src={goal} alt="" /> Goal Contribution
        </span>
        <PieChart
          label="Contributo gol"
          value={goalContributionPct}
          total={100}
          color="var(--primary)"
          bgColor="var(--border)"
        />
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
            {goalContributionPct}%
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: 8 }}>
            dei gol della squadra
          </span>
        </div>
      </div>

      {/* Performance per mese */}
      <div className="card">
        <span className="card-title" style={{ display: 'flex', marginBottom: 12, gap:5 }}>
          <img className='icon-img' src={doc} alt="" /> Statistiche Chiave
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Media dribbling/partita</span>
            <span style={{ fontWeight: 700 }}>
              {matches.length > 0 ? (matches.reduce((s, m) => s + m.dribblesSuccessful, 0) / matches.length).toFixed(1) : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Media cross/partita</span>
            <span style={{ fontWeight: 700 }}>
              {matches.length > 0 ? (matches.reduce((s, m) => s + m.crossesSuccessful, 0) / matches.length).toFixed(1) : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Precisione tiro</span>
            <span style={{ fontWeight: 700 }}>{stats.shotAccuracy}%</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Recuperi/partita</span>
            <span style={{ fontWeight: 700 }}>{stats.avgBallsRecovered}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

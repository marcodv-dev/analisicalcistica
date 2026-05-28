import { useMemo } from 'react'
import type { Match, AggregatedStats, Tag } from '../../types'
import RadarChart from '../common/RadarChart'
import FormStreak from '../common/FormStreak'
import GoalProgress from '../common/GoalProgress'
import graph from '../../assets/graph.png'
import graph2 from '../../assets/statistic.png'
import avg from '../../assets/average.png'
import target from '../../assets/bullseye.png'

interface Props {
  matches: Match[]
  stats: AggregatedStats
  tags: Tag[]
}

export default function DashboardView({ matches, stats, tags }: Props) {
  const radarData = useMemo(() => ({
    dribbleSuccess: stats.dribbleSuccessRate,
    crossSuccess: stats.crossSuccessRate,
    shotAccuracy: stats.shotAccuracy,
    avgRating: stats.avgSelfRating * 10, // normalize to percentage
    recoveryPerMatch: Math.min(100, (stats.avgBallsRecovered / 10) * 100),
  }), [stats])

  const recentMatches = useMemo(() =>
    [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [matches]
  )

  const goalPct = useMemo(() => {
    if (stats.totalMinutes === 0 || stats.totalGoals === 0) return 0
    return 0 // placeholder - will be proper
  }, [stats])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* General Stats */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{display:'flex', gap:5}}><img className='icon-img' src={graph} alt="" /> Numeri Stagionali</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {stats.totalMatches} presenze
          </span>
        </div>
        <div className="grid-4" style={{ marginBottom: 12 }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.totalGoals}</div>
            <div className="stat-label">Gol</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats.totalAssists}</div>
            <div className="stat-label">Assist</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.starterMatches}</div>
            <div className="stat-label">Titolare</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.substituteMatches}</div>
            <div className="stat-label">Panchina</div>
          </div>
        </div>
        <div className="grid-3">
          <div>
            <div className="stat-label">Minuti totali</div>
            <div style={{ fontWeight: 700 }}>{stats.totalMinutes}</div>
          </div>
          <div>
            <div className="stat-label">Min/gol</div>
            <div style={{ fontWeight: 700 }}>{stats.minutesPerGoal > 0 ? stats.minutesPerGoal : '—'}</div>
          </div>
          <div>
            <div className="stat-label">Min/assist</div>
            <div style={{ fontWeight: 700 }}>{stats.minutesPerAssist > 0 ? stats.minutesPerAssist : '—'}</div>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="card">
        <span className="card-title" style={{ display: 'flex', marginBottom: 12, gap:5 }}><img className='icon-img' src={avg} alt="" /> Medie Voto</span>
        <div className="grid-3">
          <div className="stat-card">
            <div className="stat-value" style={{ color: stats.avgSelfRating >= 6 ? 'var(--success)' : stats.avgSelfRating >= 5 ? 'var(--warning)' : 'var(--danger)' }}>
              {stats.avgSelfRating}
            </div>
            <div className="stat-label">Personale</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: stats.avgSelfRating >= 6 ? 'var(--success)' : stats.avgSelfRating >= 5 ? 'var(--warning)' : 'var(--danger)' }}>
              {stats.avgMisterRating || '—'}
            </div>
            <div className="stat-label">Mister</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: stats.avgSelfRating >= 6 ? 'var(--success)' : stats.avgSelfRating >= 5 ? 'var(--warning)' : 'var(--danger)' }}>
              {stats.avgAutoRating || '—'}
            </div>
            <div className="stat-label">Auto</div>
          </div>
        </div>
      </div>

      {/* Winger Radar */}
      {stats.totalMatches > 0 && (
        <div className="card">
          <span className="card-title" style={{ display: 'flex', marginBottom: 12, gap:5 }}><img className='icon-img' src={target} alt="" /> Winger Radar</span>
          <RadarChart data={radarData} />
        </div>
      )}

      {/* Form Streak */}
      <div className="card">
        <span className="card-title"  style={{ display: 'flex', marginBottom: 12, gap:5 }}><img className='icon-img' src={graph2} alt="" /> Striscia di Forma</span>
        <FormStreak results={stats.last5Results} ratings={stats.last5Ratings} matches={recentMatches} />
      </div>

      {/* Top stats cards */}
      <div className="grid-2">
        <div className="card">
          <div className="stat-label">Dribbling riusciti</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: stats.dribbleSuccessRate >= 60 ? 'var(--success)' : 'black' }}>
            {stats.dribbleSuccessRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {matches.reduce((s, m) => s + m.dribblesSuccessful, 0)}/{stats.totalDribbles}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">Cross riusciti</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: stats.dribbleSuccessRate >= 60 ? 'var(--success)' : 'black' }}>
            {stats.crossSuccessRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {matches.reduce((s, m) => s + m.crossesSuccessful, 0)}/{stats.totalCrosses}
          </div>
        </div>
      </div>

      {/* Win / Draw / Loss */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Risultati Squadra</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {stats.winRate}% vittorie
          </span>
        </div>
        <div className="grid-3">
          <div className="stat-card" style={{ borderBottom: '2px solid var(--success)',borderRadius:0 }}>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.wins}</div>
            <div className="stat-label">Vittorie</div>
          </div>
          <div className="stat-card" style={{ borderBottom: '2px solid var(--warning)',borderRadius:0 }}>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.draws}</div>
            <div className="stat-label">Pareggi</div>
          </div>
          <div className="stat-card" style={{ borderBottom: '2px solid var(--danger)',borderRadius:0 }}>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.losses}</div>
            <div className="stat-label">Sconfitte</div>
          </div>
        </div>
      </div>
    </div>
  )
}

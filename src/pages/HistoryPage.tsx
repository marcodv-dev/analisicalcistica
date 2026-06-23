import { useState, useMemo } from 'react'
import { useMatches } from '../hooks/useMatches'
import { useSeasons } from '../hooks/useSeasons'
import { useToast } from '../components/ui/Toast'
import MatchList from '../components/history/MatchList'
import MatchDetail from '../components/history/MatchDetail'
import type { Match } from '../types'
import history from '../assets/history.png'
import ball from '../assets/ball.png'
import assist from '../assets/running-sportive-shoe-for-soccer-players.png'
import bench from '../assets/bench.png'
import start from '../assets/play.png'
import star from '../assets/star.png'

type FilterType = 'all' | 'goals' | 'assists' | 'starter' | 'substitute' | 'highRating'

export default function HistoryPage() {
  const { matches, loading, removeMatch } = useMatches()
  const { seasons } = useSeasons()
  const { toast } = useToast()
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const years = useMemo(() => {
    const set = new Set<string>()
    for (const m of matches) set.add(String(new Date(m.date).getFullYear()))
    return Array.from(set).sort().reverse()
  }, [matches])

  const months = useMemo(() => {
    const all = ['', 'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
    return all.filter((_, i) => i === 0 || i <= currentMonth)
  }, [currentMonth])

  const filtered = useMemo(() => {
    let result = matches
    if (filter === 'goals') result = result.filter(m => m.goals > 0)
    else if (filter === 'assists') result = result.filter(m => m.assists > 0)
    else if (filter === 'starter') result = result.filter(m => m.lineupStatus === 'starter')
    else if (filter === 'substitute') result = result.filter(m => m.lineupStatus === 'substitute')
    else if (filter === 'highRating') result = result.filter(m => (m.selfRating || 0) >= 7)
    if (selectedMonth || selectedYear) {
      result = result.filter(m => {
        const d = new Date(m.date)
        const mMonth = d.getMonth() + 1
        const mYear = d.getFullYear()
        const monthMatch = !selectedMonth || mMonth === +selectedMonth
        const year = selectedYear || String(currentYear)
        const yearMatch = mYear === +year
        return monthMatch && yearMatch
      })
    }
    if (selectedSeason) {
      if (selectedSeason === 'friendly') {
        result = result.filter(m => m.competition === 'friendly' || !m.seasonId)
      } else {
        result = result.filter(m => m.seasonId === selectedSeason)
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(m => m.opponent.toLowerCase().includes(q) || m.notes?.toLowerCase().includes(q))
    }
    return result
  }, [matches, filter, search, selectedMonth, selectedYear, selectedSeason, currentYear])

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Eliminare questa partita?')) return
    await removeMatch(id)
    setSelectedMatch(null)
    toast('Partita eliminata', 'success')
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title"><img className='icon-img' src={history} alt="" /> Storico</h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {matches.length} partite
        </span>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          placeholder="Cerca per avversario o note..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)', fontSize: '0.85rem' }}
          >
            <option value="">Mese</option>
            {months.map((m, i) => i === 0 ? null : (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)', fontSize: '0.85rem' }}
          >
            <option value="">Anno</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <select
          value={selectedSeason}
          onChange={e => setSelectedSeason(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)', fontSize: '0.85rem' }}
        >
          <option value="">Stagione</option>
          <option value="friendly">Amichevoli</option>
          {seasons.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-bar">
        {[
          { key: 'all', label: 'Tutte' },
          { key: 'goals', icon: ball, label: 'Gol' },
          { key: 'assists', icon: assist, label: 'Assist' },
          { key: 'starter', icon: start, label: 'Titolare' },
          { key: 'substitute', icon: bench, label: 'Panchina' },
          { key: 'highRating', icon: star, label: 'Top' },
        ].map(f => (
          <button
            key={f.key}
            className={`filter-chip${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key as FilterType)}
            style={{display:'flex',gap:5, alignItems:'center'}}
          >
            {f?.icon? <img className='icon-img' src={f.icon} alt="" /> :null}
            {f.label}
          </button>
        ))}
      </div>

      <div className="page-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">Nessuna partita trovata</div>
            <div className="empty-state-text">Prova a cambiare filtro o aggiungi una nuova partita</div>
          </div>
        ) : (
          <MatchList matches={filtered} onSelect={setSelectedMatch} />
        )}
      </div>

      {selectedMatch && (
        <MatchDetail
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}

import { useState } from 'react'
import { useSeasons, useSeasonGoals } from '../../hooks/useSeasons'
import { useMatches } from '../../hooks/useMatches'
import { aggregateStats } from '../../utils/stats'
import target from '../../assets/bullseye.png'
import del from '../../assets/delete.png'

function isInRange(startDate: string, endDate: string): boolean {
  const now = new Date()
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T23:59:59')
  return now >= start && now <= end
}

export default function SeasonsManager() {
  const { seasons, activeSeason, loading, addSeason, editSeason, removeSeason } = useSeasons()
  const { matches } = useMatches()
  const { goals, addGoal, removeGoal } = useSeasonGoals(activeSeason?.id || null)

  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')
  const [newGoalType, setNewGoalType] = useState<'goals' | 'assists' | 'appearances' | 'custom'>('goals')
  const [newGoalTarget, setNewGoalTarget] = useState('')
  const [newGoalLabel, setNewGoalLabel] = useState('')

  const stats = activeSeason ? aggregateStats(matches) : null

  if (loading) return <div className="loading"><div className="spinner" /></div>

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const handleAddSeason = async () => {
    if (!newName || !newStart) return
    await addSeason({
      name: capitalize(newName),
      startDate: newStart,
      endDate: newEnd || newStart,
      isActive: false,
    })
    setNewName('')
    setNewStart('')
    setNewEnd('')
    setShowNew(false)
  }

  const handleAddGoal = async () => {
    if (!activeSeason || !newGoalTarget) return
    const target = Number(newGoalTarget)
    if (target <= 0) return
    await addGoal({
      seasonId: activeSeason.id,
      type: newGoalType,
      target,
      current: 0,
      customLabel: newGoalLabel || undefined,
      customUnit: undefined,
    })
    setNewGoalTarget('')
  }

  const currentValue = (type: string): number => {
    if (!stats) return 0
    switch (type) {
      case 'goals': return stats.totalGoals
      case 'assists': return stats.totalAssists
      case 'appearances': return stats.totalMatches
      default: return 0
    }
  }

  return (
    <div>

      {/* New season */}
      {showNew ? (
        <div className="card" style={{ marginBottom: 12 }}>
          <span className="card-title" style={{ display: 'block', marginBottom: 12 }}>➕ Nuova Stagione</span>
          <div className="form-group">
            <label>Nome stagione</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="es. 2025/2026" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Inizio</label>
              <input type="date" value={newStart} onChange={e => setNewStart(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fine</label>
              <input type="date" value={newEnd} onChange={e => setNewEnd(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowNew(false)}>Annulla</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddSeason}>Crea</button>
          </div>
        </div>
      ) : (
        <button className="btn-secondary w-full" onClick={() => setShowNew(true)}>
          + Aggiungi Stagione
        </button>
      )}

      {/* Season list */}
      {seasons.map(season => {
        const active = isInRange(season.startDate, season.endDate)
        return (
        <div
          key={season.id}
          className="card"
          style={{ marginTop: 12, borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent' }}
        >
          <div className="card-header">
            <div>
              <span className="card-title">{season.name}</span>
              {season.teamName && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 8 }}>
                  {season.teamName}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {active && (
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                  In corso
                </span>
              )}
              {!active&& <button className="btn-icon" onClick={() => {
                  if (window.confirm(`Eliminare la stagione "${season.name}"? Verranno rimossi anche gli obiettivi associati.`))
                    removeSeason(season.id)
                }}>x</button>
              }
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {season.startDate} → {season.endDate}
          </div>

          {/* Goals for active season */}
          {active && (
            <div style={{ marginTop: 12 }}>
              {goals.map(goal => {
                const cur = currentValue(goal.type)
                const pct = goal.target > 0 ? Math.min(100, (cur / goal.target) * 100) : 0
                const color = pct >= 100 ? 'var(--success)' : pct >= 50 ? 'var(--primary)' : 'var(--warning)'

                return (
                  <div style={{display:'flex', width:'100%'}}>
                    <div key={goal.id} style={{ marginBottom: 15, flex:1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>{goal.customLabel || goal.type}</span>
                        <span style={{ fontWeight: 700, color: pct >= 100? 'var(--success)':'' }}>
                          {cur}/{goal.target}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                    <button
                      className="btn-icon"
                      style={{ }}
                      onClick={() => removeGoal(goal.id)}
                    >
                      x
                    </button>
                  </div>
                )
              })}

              {/* Add goal form */}
              <div className="card" style={{ marginTop: 8, padding: 12 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, display:'flex', alignItems:'center', gap:5 }}><img className='icon-img' src={target} alt=""/> Nuovo obiettivo</div>
                <div style={{ display: 'flex',flexDirection:'column', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{display:'flex', gap:8}}>
                    <select value={newGoalType} onChange={e => setNewGoalType(e.target.value as any)} style={{ flex: 1, minWidth: 100 }}>
                      <option value="goals">Gol</option>
                      <option value="assists">Assist</option>
                      <option value="appearances">Presenze</option>
                      <option value="custom">Personalizzato</option>
                    </select>
                    {newGoalType === 'custom' && (
                      <input
                        placeholder="Etichetta"
                        value={newGoalLabel}
                        onChange={e => setNewGoalLabel(e.target.value)}
                        style={{ flex: 1 }}
                      />
                    )}
                    <input
                      type="number" min="1"
                      placeholder="0"
                      value={newGoalTarget}
                      onChange={e => setNewGoalTarget(e.target.value)}
                      style={{ width: 50, padding: 0, textAlign:'center' }}
                    />
                  </div>
                  <button className="btn-primary btn-sm" onClick={handleAddGoal} style={{display:'flex',alignItems:'center'}}>Aggiungi</button>
                </div>
              </div>
              <button className="btn-danger" style={{ width:'100%', marginTop:12, display:'flex', justifyContent:'center', gap:5, alignItems:'center' }} onClick={() => {
                if (window.confirm(`Eliminare la stagione "${season.name}"? Verranno rimossi anche gli obiettivi associati.`))
                  removeSeason(season.id)
              }}><img className='icon-img' style={{filter:'invert(1)'}} src={del} alt="" /> Elimina</button>
            </div>
          )}
        </div>
        )
      })}

      {seasons.length === 0 && !showNew && (
        <div className="empty-state">
          <div className="empty-state-title">Nessuna stagione</div>
          <div className="empty-state-text">Crea una stagione per iniziare a tracciare i tuoi obiettivi</div>
        </div>
      )}
    </div>
  )
}

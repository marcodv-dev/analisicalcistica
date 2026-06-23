import { useState } from 'react'
import { useSeasons } from '../../hooks/useSeasons'
import { useMatches } from '../../hooks/useMatches'
import SeasonCard from './SeasonCard'

export default function SeasonsManager() {
  const { seasons, loading, addSeason, editSeason, removeSeason } = useSeasons()
  const { matches } = useMatches()

  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')

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

  return (
    <div>
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

      {seasons.map(season => (
        <SeasonCard
          key={season.id}
          season={season}
          matches={matches}
          onEditSeason={editSeason}
          onRemoveSeason={removeSeason}
        />
      ))}

      {seasons.length === 0 && !showNew && (
        <div className="empty-state">
          <div className="empty-state-title">Nessuna stagione</div>
          <div className="empty-state-text">Crea una stagione per iniziare a tracciare i tuoi obiettivi</div>
        </div>
      )}
    </div>
  )
}

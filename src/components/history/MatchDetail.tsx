import { useNavigate } from 'react-router-dom'
import type { Match } from '../../types'
import { ROLES, WEATHER_OPTIONS, PITCH_TYPE_OPTIONS, PITCH_CONDITION_OPTIONS, MENTAL_STATE_OPTIONS } from '../../types'
import home from '../../assets/house.png'
import plane from '../../assets/plane.png'
import goal from '../../assets/goal.png'
import shield from '../../assets/shield.png'
import cards from '../../assets/football-card.png'
import graph from '../../assets/graph.png'
import meteo from '../../assets/cloudy-day.png'
import notes from '../../assets/notes.png'
import mod from '../../assets/edit-button.png'
import del from '../../assets/delete.png'

interface Props {
  match: Match
  onClose: () => void
  onDelete: (id: string) => void
}

const roleLabel = (r: string) => ROLES.find(o => o.value === r)?.label || r
const optLabel = <T,>(opts: { value: T; label: string }[], v: T) => opts.find(o => o.value === v)?.label ?? String(v)

export default function MatchDetail({ match, onClose, onDelete }: Props) {
  const navigate = useNavigate()
  const resultColor = match.teamScore > match.opponentScore
    ? 'var(--success)' : match.teamScore === match.opponentScore ? 'var(--warning)' : 'var(--danger)'

  const ratingBadge = (v?: number) => {
    if (!v || v === 0) return <span style={{ color: 'var(--text-muted)' }}>—</span>
    const cls = v >= 7 ? 'rating-high' : v >= 6 ? 'rating-mid' : 'rating-low'
    return <span className={`rating-badge ${cls}`}>{v}</span>
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{match.opponent}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {new Date(match.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: resultColor }}>
              {match.teamScore}-{match.opponentScore}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display:'flex',gap:5, alignItems:'center' }}>
              <img className='icon-img' src={match.homeAway === 'home' ? home : plane} alt="" />
              {match.homeAway === 'home' ? 'Casa' : 'Trasferta'}
            </div>
          </div>
        </div>

        {match.matchTitle && (
          <div style={{ fontStyle: 'italic', color: 'var(--primary)', marginBottom: 20, fontSize: '0.9rem' }}>
            "{match.matchTitle}"
          </div>
        )}

        {/* Info base */}
        <div className="grid-3" style={{ marginBottom: 40 }}>
          <div className="stat-card">
            <div className="stat-label">Ruolo</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{roleLabel(match.primaryRole)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Minuti</div>
            <div style={{ fontWeight: 600 }}>{match.minutesPlayed}'</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Esordio</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
              {match.lineupStatus === 'starter' ? 'Titolare' : `${match.substitutionMinute}' panchina`}
            </div>
          </div>
        </div>

        {/* Stats attacco */}
        <div style={{ marginBottom: 40 }}>
          <div className="form-section" style={{ marginTop: 0, display:'flex', gap:5 }}><img className='icon-img' src={goal} alt="" /> Attacco</div>
          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--success)', fontSize: '1.3rem' }}>{match.goals}</div>
              <div className="stat-label">Gol</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>{match.assists}</div>
              <div className="stat-label">Assist</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.3rem' }}>{match.shotsOnTarget}/{match.shotsTotal}</div>
              <div className="stat-label">Tiri</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.3rem' }}>{match.dribblesSuccessful}/{match.dribblesTotal}</div>
              <div className="stat-label">Dribbling</div>
            </div>
          </div>
          <div className="grid-3" style={{ marginTop: 8 }}>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>{match.crossesSuccessful}/{match.crossesTotal}</div>
              <div className="stat-label">Cross</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>{match.bigChancesCreated}</div>
              <div className="stat-label">Occasioni create</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.1rem', color: 'var(--danger)' }}>{match.bigChancesMissed}</div>
              <div className="stat-label">Occasioni sbagliate</div>
            </div>
          </div>
        </div>

        {/* Stats difensive */}
        <div style={{ marginBottom: 40 }}>
          <div className="form-section" style={{ display:'flex', gap:5 }}><img className='icon-img' src={shield} alt="" /> Difesa</div>
          <div className="grid-3">
            <div className="stat-card">
              <div className="stat-value">{match.ballsRecovered}</div>
              <div className="stat-label">Recuperi</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{match.tacklesSuccessful}/{match.tacklesTotal}</div>
              <div className="stat-label">Contrasti</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{match.foulsSuffered}</div>
              <div className="stat-label">Falli subiti</div>
            </div>
          </div>
        </div>

        {/* Disciplina */}
        {(match.yellowCards > 0 || match.redCards > 0 || match.decisiveErrors > 0) && (
          <div style={{ marginBottom: 40 }}>
            <div className="form-section" style={{ display:'flex', gap:5 }}><img className='icon-img' src={cards} alt="" /> Disciplina</div>
            <div className="grid-3">
              {match.yellowCards > 0 && <div className="stat-card"><div className="stat-value" style={{ color: 'var(--warning)' }}>{match.yellowCards}</div><div className="stat-label">Gialli</div></div>}
              {match.redCards > 0 && <div className="stat-card"><div className="stat-value" style={{ color: 'var(--danger)' }}>{match.redCards}</div><div className="stat-label">Rossi</div></div>}
              {match.decisiveErrors > 0 && <div className="stat-card"><div className="stat-value" style={{ color: 'var(--danger)' }}>{match.decisiveErrors}</div><div className="stat-label">Errori decisivi</div></div>}
            </div>
          </div>
        )}

        {/* Valutazioni */}
        <div style={{ marginBottom: 40 }}>
          <div className="form-section" style={{ display:'flex', gap:5 }}><img className='icon-img' src={graph} alt="" /> Valutazioni</div>
          <div className="grid-3">
            <div className="stat-card">
              <div className="stat-label">Personale</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{ratingBadge(match.selfRating)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Mister</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{ratingBadge(match.misterRating)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Automatico</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{ratingBadge(match.autoRating)}</div>
            </div>
          </div>
        </div>

        {/* Condizioni */}
        <div style={{ marginBottom: 40 }}>
          <div className="form-section" style={{ display:'flex', gap:5 }}><img className='icon-img' src={meteo} alt="" /> Condizioni</div>
          <div className="grid-2" style={{ fontSize: '0.85rem' }}>
            <div><span className="text-muted">Meteo:</span> {optLabel(WEATHER_OPTIONS, match.weather)}</div>
            <div><span className="text-muted">Campo:</span> {optLabel(PITCH_TYPE_OPTIONS, match.pitchType)} ({optLabel(PITCH_CONDITION_OPTIONS, match.pitchCondition)})</div>
            <div><span className="text-muted">Stato:</span> {optLabel(MENTAL_STATE_OPTIONS, match.mentalState)}</div>
            <div><span className="text-muted">Formazione:</span> {match.formation}</div>
          </div>
        </div>

        {/* Note */}
        {match.notes && (
          <div style={{ marginBottom: 40 }}>
            <div className="form-section" style={{ display:'flex', gap:5 }}><img className='icon-img' src={notes} alt="" /> Note</div>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
              {match.notes}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='buttons-matchDetail' style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <div style={{display:'flex', gap:16}}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Chiudi
            </button>
            <button className="btn-primary" style={{ flex: 1, display:'flex', gap:5, alignItems:'center' }} onClick={() => navigate(`/edit-match/${match.id}`)}>
               <img className='icon-img' src={mod} alt="" /> Modifica
            </button>
          </div>
          <button className="btn-danger" style={{ flex: 1, display:'flex', justifyContent:'center', gap:5, alignItems:'center' }} onClick={() => onDelete(match.id)}>
            <img className='icon-img' style={{filter:'invert(1)'}} src={del} alt="" /> Elimina
          </button>
        </div>
      </div>
    </div>
  )
}

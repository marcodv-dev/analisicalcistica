import type { Match } from '../../types'
import home from '../../assets/house.png'
import plane from '../../assets/plane.png'

interface Props {
  matches: Match[]
  onSelect: (match: Match) => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

const roleLabels: Record<string, string> = {
  rw: 'AD', lw: 'AS', rm: 'ED', lm: 'ES',
  cam: 'TQ', ss: 'SP', wf: 'AL', cf: 'PC',
  cm: 'CC', wb: 'QC',
}

export default function MatchList({ matches, onSelect }: Props) {
  return (
    <div>
      {matches.map(m => {
        const resultColor = m.teamScore > m.opponentScore
          ? 'var(--success)'
          : m.teamScore === m.opponentScore ? 'var(--warning)' : 'var(--danger)'

        const ratingColor = (m.selfRating || 0) >= 7
          ? 'var(--success)' : (m.selfRating || 0) >= 6 ? 'var(--primary)' : 'var(--text-muted)'

        return (
          <div key={m.id} className="match-item" onClick={() => onSelect(m)}>
            <div className="match-item-top">
              <div>
                <div className="match-item-opponent">{m.opponent}</div>
                <div className="match-item-meta">
                  <span>{formatDate(m.date)}</span>
                  <img className='icon-img' src={m.homeAway === 'home' ? home : plane} alt="" />
                  <span>{roleLabels[m.primaryRole] || m.primaryRole}</span>
                  <span>{m.minutesPlayed}'</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="match-item-result" style={{ color: resultColor }}>
                  {m.teamScore}-{m.opponentScore}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: ratingColor }}>
                  {m.selfRating || '—'}
                </div>
              </div>
            </div>
            {(m.goals > 0 || m.assists > 0 || m.dribblesSuccessful > 0) && (
              <div className="match-item-stats">
                {m.goals > 0 && (
                  <div className="match-item-stat">
                    <div className="match-item-stat-value" style={{ color: 'var(--success)'}}>{m.goals}</div>
                    <div className="match-item-stat-label">Gol</div>
                  </div>
                )}
                {m.assists > 0 && (
                  <div className="match-item-stat">
                    <div className="match-item-stat-value" style={{ color: 'var(--primary)' }}>{m.assists}</div>
                    <div className="match-item-stat-label">Assist</div>
                  </div>
                )}
                {m.dribblesSuccessful > 0 && (
                  <div className="match-item-stat">
                    <div className="match-item-stat-value">{m.dribblesSuccessful}</div>
                    <div className="match-item-stat-label">Dribb</div>
                  </div>
                )}
                {m.crossesSuccessful > 0 && (
                  <div className="match-item-stat">
                    <div className="match-item-stat-value">{m.crossesSuccessful}</div>
                    <div className="match-item-stat-label">Cross</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

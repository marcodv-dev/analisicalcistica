import type { Match } from '../../types'

interface Props {
  results: ('win' | 'draw' | 'loss')[]
  ratings: number[]
  matches: Match[]
}

const colors = { win: 'var(--success)', draw: 'var(--warning)', loss: 'var(--danger)' }
const labels = { win: 'V', draw: 'N', loss: 'P' }

export default function FormStreak({ results, ratings, matches }: Props) {
  if (results.length === 0) {
    return <div className="text-muted" style={{ fontSize: '0.9rem' }}>Ancora nessuna partita registrata</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: colors[r], color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8rem',
            }}
          >
            {labels[r]}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {matches.map((m, i) => {
          const rating = m.selfRating || 0
          const color = rating >= 6 ? 'var(--success)' : rating >= 5 ? 'var(--warning)' : rating > 0 ? 'var(--danger)' : 'var(--text-muted)'
          return (
            <div key={m.id} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color }}>{rating > 0 ? rating : '—'}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{m.opponent.slice(0, 6)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

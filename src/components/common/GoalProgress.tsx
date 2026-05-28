interface Props {
  current: number
  target: number
  label: string
  color?: string
}

export default function GoalProgress({ current, target, label, color = 'var(--primary)' }: Props) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700 }}>{current}/{target}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

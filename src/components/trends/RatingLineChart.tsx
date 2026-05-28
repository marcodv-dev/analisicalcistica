import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js'
import type { Match } from '../../types'

interface Props {
  matches: Match[]
}

export default function RatingLineChart({ matches }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current || matches.length === 0) return
    if (chartRef.current) chartRef.current.destroy()

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const labels = matches.map(m => {
      const d = new Date(m.date)
      return `${d.getDate()}/${d.getMonth() + 1}`
    })

    const selfRatings = matches.map(m => m.selfRating || null)
    const misterRatings = matches.map(m => m.misterRating || null)
    const autoRatings = matches.map(m => m.autoRating || null)

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Autovalutazione',
            data: selfRatings,
            borderColor: '#4ecdc4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#4ecdc4',
          },
          {
            label: 'Voto Mister',
            data: misterRatings,
            borderColor: '#ffd93d',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#ffd93d',
          },
          {
            label: 'Voto Automatico',
            data: autoRatings,
            borderColor: '#d16845',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#d16845',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 2,
            max: 10,
            ticks: { stepSize: 1, color: isDark ? '#8888aa' : '#555577' },
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' },
          },
          x: {
            ticks: { color: isDark ? '#8888aa' : '#555577', maxTicksLimit: 10 },
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: isDark ? '#e0e0e0' : '#1a1a2e', boxWidth: 12, padding: 8 },
          },
        },
      },
    })

    return () => { chartRef.current?.destroy() }
  }, [matches])

  if (matches.length === 0) {
    return <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Nessuna partita
    </div>
  }

  return <div style={{ height: 250 }}><canvas ref={canvasRef} /></div>
}

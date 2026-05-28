import { useEffect, useRef } from 'react'
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface Props {
  data: {
    dribbleSuccess: number
    crossSuccess: number
    shotAccuracy: number
    avgRating: number
    recoveryPerMatch: number
  }
}

const labels = ['Dribbling', 'Cross', 'Tiri in porta', 'Voto', 'Recuperi']

export default function RadarChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Percentuale',
          data: [data.dribbleSuccess, data.crossSuccess, data.shotAccuracy, data.avgRating, data.recoveryPerMatch],
          backgroundColor: 'rgba(78, 205, 196, 0.15)',
          borderColor: '#4ecdc4',
          borderWidth: 2,
          pointBackgroundColor: '#4ecdc4',
          pointBorderColor: isDark ? '#0f0f23' : '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false, stepSize: 20 },
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' },
            angleLines: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' },
            pointLabels: {
              color: isDark ? '#8888aa' : '#555577',
              font: { size: 11, family: 'Inter, sans-serif' },
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.r.toFixed(0)}%`
            }
          }
        }
      }
    })

    return () => { chartRef.current?.destroy() }
  }, [data])

  return <canvas ref={canvasRef} />
}

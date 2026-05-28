import { useEffect, useRef } from 'react'
import { Chart, ArcElement, PieController, Tooltip } from 'chart.js'

Chart.register(ArcElement, PieController, Tooltip)

const cssVar = (v: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(v.slice(4, -1)).trim() || v

interface Props {
  label: string
  value: number
  total: number
  color: string
  bgColor: string
}

export default function PieChart({ label, value, total, color, bgColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [label, 'Resto'],
        datasets: [{
          data: [value, total - value],
          backgroundColor: [cssVar(color), cssVar(bgColor)],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          tooltip: { enabled: true },
          legend: { display: false },
        },
      },
    })

    return () => { chartRef.current?.destroy() }
  }, [value, total, color, bgColor, label])

  return <div style={{ height: 180 }}><canvas ref={canvasRef} /></div>
}

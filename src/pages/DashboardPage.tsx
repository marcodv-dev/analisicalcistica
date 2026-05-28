import { useMatches } from '../hooks/useMatches'
import { useStats } from '../hooks/useStats'
import { useTags } from '../hooks/useTags'
import DashboardView from '../components/dashboard/DashboardView'
import logo1 from '../assets/logo6.png'
import logo2 from '../assets/logo5.png'

export default function DashboardPage() {
  const { matches, loading } = useMatches()
  const { tags } = useTags()
  const stats = useStats(matches)

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title" style={{display:'flex',gap:5,alignItems:'center'}}>
          <div className='div-logo'>
            <img src={logo1} className='icon-logo' style={{top:'-2px'}} alt="" />
            <img src={logo2} alt="" />
          </div>
          Home
          </h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {stats.totalMatches} partite
        </span>
      </div>
      <div className="page-content">
        <DashboardView matches={matches} stats={stats} tags={tags} />
      </div>
    </>
  )
}

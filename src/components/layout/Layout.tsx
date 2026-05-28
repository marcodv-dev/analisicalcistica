import { useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ToastProvider } from '../ui/Toast'
import graph from '../../assets/graph.png'
import ball from '../../assets/ball.png'
import trend from '../../assets/graph-2.png'
import history from '../../assets/history.png'
import other from '../../assets/menu.png'

const navItems = [
  { to: '/', label: 'Home', icon: graph },
  { to: '/new-match', label: 'Partita', icon: ball },
  { to: '/trends', label: 'Trend', icon: trend },
  { to: '/history', label: 'Storico', icon: history },
  { to: '/more', label: 'Altro', icon: other },
]

export default function Layout() {
  useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0)
  }, [location.pathname])
  return (
    <ToastProvider>
      <Outlet />
      <nav className="bottom-nav">
        {navItems.map(item => (
          <div
            key={item.to}
            className={`nav-item${location.pathname === item.to ? ' active' : ''}`}
            onPointerDown={(e) => { e.preventDefault(); navigate(item.to) }}
          >
            <img className='icon-img' src={item.icon} alt="" />
            <span style={{fontSize:12, fontWeight:500}}>{item.label}</span>
          </div>
        ))}
      </nav>
    </ToastProvider>
  )
}

import { NavLink, Outlet } from 'react-router-dom'
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
  return (
    <ToastProvider>
      <Outlet />
      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <img className='icon-img' src={item.icon} alt="" />
            <span style={{fontSize:12, fontWeight:500}}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </ToastProvider>
  )
}

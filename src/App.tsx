import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import NewMatchPage from './pages/NewMatchPage'
import TrendsPage from './pages/TrendsPage'
import HistoryPage from './pages/HistoryPage'
import MorePage from './pages/MorePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new-match" element={<NewMatchPage />} />
          <Route path="/edit-match/:id" element={<NewMatchPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/more" element={<MorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

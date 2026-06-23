import { useState } from 'react'
import TagsManager from '../components/tags/TagsManager'
import SeasonsManager from '../components/seasons/SeasonsManager'
import InjuriesManager from '../components/injuries/InjuriesManager'
import SettingsPanel from '../components/settings/SettingsPanel'
import settings from '../assets/settings.png'
import tags from '../assets/tag.png'
import trophy from '../assets/award.png'
import injury from '../assets/plaster.png'
import other from '../assets/menu.png'

type Tab = 'tags' | 'seasons' | 'injuries' | 'settings'

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'settings', label: 'Impostazioni', icon: settings },
  { key: 'seasons', label: 'Stagioni', icon: trophy },
  { key: 'injuries', label: 'Infortuni', icon: injury },
  { key: 'tags', label: 'Tag', icon: tags },
]

export default function MorePage() {
  const [activeTab, setActiveTab] = useState<Tab>('settings')

  return (
    <>
      <div className="page-header">
        <h1 className="page-title"><img className='icon-img' src={other} alt=""/> Altro</h1>
      </div>
      <div className="filter-bar" style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            className={`filter-chip${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
            style={{display:'flex',gap:5,alignItems:'center'}}
          >
            <img className='icon-img' src={t.icon} alt="" /> {t.label}
          </button>
        ))}
      </div>
      <div className="page-content">
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'tags' && <TagsManager />}
        {activeTab === 'seasons' && <SeasonsManager />}
        {activeTab === 'injuries' && <InjuriesManager />}
      </div>
    </>
  )
}

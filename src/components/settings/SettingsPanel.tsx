import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useMatches } from '../../hooks/useMatches'
import { exportAllData, importAllData } from '../../db'
import { useToast } from '../ui/Toast'
import sun from '../../assets/sun.png'
import moon from '../../assets/moon.png'
import exp from '../../assets/export.png'
import imp from '../../assets/import.png'
import info from '../../assets/info.png'
import backup from '../../assets/database-management.png'

export default function SettingsPanel() {
  const { darkMode, toggle } = useTheme()
  const { refresh } = useMatches()
  const { toast } = useToast()
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const json = await exportAllData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tabellino_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast('Backup esportato con successo', 'success')
    } catch (err) {
      toast('Errore durante l\'esportazione', 'error')
      console.error('Export error:', err)
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportError('')
    try {
      const text = await file.text()
      await importAllData(text)
      await refresh()
      toast('Dati importati con successo!', 'success')
    } catch (err) {
      setImportError('Errore durante l\'importazione. Verifica che il file sia valido.')
      console.error('Import error:', err)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Theme */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Tema</span>
          <button
            onClick={toggle}
            className="btn-sm"
            style={{
              background: darkMode ? 'var(--warning)' : 'var(--bg-card)',
              color: darkMode ? '#000' : 'var(--text)',
              border: '1px solid var(--border)',
              display:'flex',gap:5,alignItems:'center'
            }}
          >
            <img className='icon-img' style={{filter:'none'}} src={darkMode ? sun : moon} alt=""/>
            {darkMode ? 'Chiaro' : 'Scuro'}
          </button>
        </div>
      </div>

      {/* Export / Import */}
      <div className="card">
        <span className="card-title" style={{ display:'flex',gap:5,alignItems:'center', marginBottom: 12 }}><img className='icon-img' src={backup} alt=""/> Backup Dati</span>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Esporta tutti i tuoi dati in formato JSON per sicurezza o per trasferirli su un altro dispositivo.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleExport} disabled={exporting} style={{ flex: 1, display:'flex',gap:5,alignItems:'center', flexDirection:'column' }}>
            {!exporting && <img className='icon-img' src={exp} alt=""/>}
            {exporting ? 'Esportazione...' : 'Esporta JSON'}
          </button>
          <label className="btn-primary" style={{ flex: 1, textAlign: 'center', cursor: 'pointer', margin:0, borderRadius: 'var(--radius-sm)', fontWeight:500, display:'flex',gap:5,alignItems:'center', flexDirection:'column' }}>
            {!importing && <img className='icon-img' src={imp} alt=""/>}
            {importing ? 'Importazione...' : 'Importa JSON'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
              disabled={importing}
            />
          </label>
        </div>
        {importError && (
          <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 8 }}>{importError}</div>
        )}
      </div>

      {/* Info */}
      <div className="card">
        <span className="card-title" style={{ display: 'flex',gap:5,alignItems:'center', marginBottom: 8 }}><img className='icon-img' src={info} alt=""/> Info App</span>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div>Tabellino Personale v1.0.0</div>
          <div>100% offline · PWA · React + Vite</div>
        </div>
      </div>
    </div>
  )
}

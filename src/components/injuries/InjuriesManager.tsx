import { useState } from 'react'
import { useInjuries } from '../../hooks/useInjuries'
import { INJURY_TYPE_OPTIONS, BODY_PART_OPTIONS, SEVERITY_OPTIONS } from '../../types'
import type { Injury } from '../../types'
import { useToast } from '../ui/Toast'
import save from '../../assets/diskette.png'
import mod from '../../assets/edit-button.png'
import note from '../../assets/notes.png'

const severityColors: Record<string, string> = {
  minor: 'var(--warning)',
  moderate: 'var(--danger)',
  severe: '#e74c3c',
}

const optLabel = <T,>(opts: { value: T; label: string }[], v: T) => opts.find(o => o.value === v)?.label ?? String(v)

export default function InjuriesManager() {
  const { injuries, loading, addInjury, editInjury, removeInjury } = useInjuries()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState('strain')
  const [bodyPart, setBodyPart] = useState('hamstring')
  const [severity, setSeverity] = useState<'minor' | 'moderate' | 'severe'>('minor')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [matchesMissed, setMatchesMissed] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  if (loading) return <div className="loading"><div className="spinner" /></div>

  const resetForm = () => {
    setType('strain')
    setBodyPart('hamstring')
    setSeverity('minor')
    setStartDate(new Date().toISOString().split('T')[0])
    setEndDate('')
    setNotes('')
    setMatchesMissed('')
    setEditId(null)
    setShowForm(false)
  }

  const openEdit = (injury: Injury) => {
    setEditId(injury.id)
    setType(injury.type)
    setBodyPart(injury.bodyPart)
    setSeverity(injury.severity)
    setStartDate(injury.startDate)
    setEndDate(injury.endDate || '')
    setNotes(injury.notes || '')
    setMatchesMissed(String(injury.matchesMissed))
    setShowForm(true)
  }

  const handleSave = async () => {
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
    const data = {
      startDate,
      endDate: endDate || undefined,
      type: type as any,
      bodyPart: bodyPart as any,
      severity,
      notes: capitalize(notes) || undefined,
      matchesMissed: Number(matchesMissed) || 0,
    }
    if (editId) {
      const injury = injuries.find(i => i.id === editId)
      if (injury) await editInjury({ ...injury, ...data })
      toast('Infortunio modificato', 'success')
    } else {
      await addInjury(data)
      toast('Infortunio registrato', 'success')
    }
    resetForm()
  }

  const handleClose = async (injuryId: string) => {
    if (!window.confirm('Chiudere questo infortunio?')) return
    const injury = injuries.find(i => i.id === injuryId)
    if (!injury) return
    await editInjury({
      ...injury,
      endDate: new Date().toISOString().split('T')[0],
    })
    toast('Infortunio chiuso', 'success')
  }

  const activeInjuries = injuries.filter(i => !i.endDate)
  const pastInjuries = injuries.filter(i => i.endDate)

  return (
    <div style={{ position:'relative' }}>
      {!showForm && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }}>
        <span style={{ fontWeight: 600 }}>
          {activeInjuries.length > 0 && (
            <span>{activeInjuries.length} infortuni in corso</span>
          )}
        </span>
        <button className={`btn-primary btn-sm ${'new-injury'}`} onClick={() => setShowForm(!showForm)}>
          + Nuovo
        </button>
      </div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 12 }}>
          <span className="card-title" style={{ display: 'flex',gap:5,alignItems:'center', marginBottom: 12 }}>{editId && <img className='icon-img' src={mod} alt="" />}{editId ? 'Modifica Infortunio' : '➕ Nuovo Infortunio'}</span>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                {INJURY_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Parte del corpo</label>
              <select value={bodyPart} onChange={e => setBodyPart(e.target.value)}>
                {BODY_PART_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Gravità</label>
              <select value={severity} onChange={e => setSeverity(e.target.value as any)}>
                {SEVERITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Data inizio</label>
              <input type="date"value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data fine (lascia vuoto se in corso)</label>
              <input type="date"  value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Partite saltate</label>
              <input type="number" min="0" value={matchesMissed} onChange={e => setMatchesMissed(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Note</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Dettagli infortunio..." />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={resetForm}>Annulla</button>
            <button className="btn-primary" style={{ flex: 1, display:'flex',gap:5,alignItems:'center' }} onClick={handleSave}><img alt='' src={save} className='icon-img'></img>Salva</button>
          </div>
        </div>
      )}

      {/* Active injuries */}
      {activeInjuries.map(injury => (
        <div key={injury.id} className="card card-injury" style={{ marginBottom: 8, borderLeft: `3px solid ${severityColors[injury.severity]}` }}>
          <div className="card-header" style={{flexDirection:'column',alignItems:'center'}}>
            <div style={{width:'100%',display:'flex',gap:10}}>
              <span style={{ fontWeight: 700, margin:'auto 0' }}>{optLabel(INJURY_TYPE_OPTIONS, injury.type)}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 8, margin:'auto 0' }}>
                {optLabel(BODY_PART_OPTIONS, injury.bodyPart)}
              </span>
              <button className="btn-icon" style={{marginLeft:'auto'}} onClick={() => {
  if (window.confirm('Eliminare questo infortunio?')) {
    removeInjury(injury.id)
    toast('Infortunio eliminato', 'success')
  }
}}>x</button>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Dal {injury.startDate} · {injury.matchesMissed > 0 && `${injury.matchesMissed} partite saltate`}
          </div>
          {injury.notes && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8, display:'flex', gap:5 }}>
              <img className='icon-img' style={{marginTop:0}} src={note} alt="" /> {injury.notes}
            </div>
          )}
          <div style={{ display: 'flex', gap: 4, marginTop:8 }}>
            <span className="tag" style={{ background: severityColors[injury.severity], color: '#fff', marginRight:'auto' }}>
              {optLabel(SEVERITY_OPTIONS, injury.severity)}
            </span>
            <button className="btn-sm btn-secondary" onClick={() => openEdit(injury)} style={{display:'flex',gap:5,alignItems:'center'}}><img className='icon-img' src={mod} alt="" /> Modifica</button>
            <button className="btn-sm btn-primary" style={{alignItems:'center'}} onClick={() => handleClose(injury.id)}>Chiudi</button>
          </div>
        </div>
      ))}

      {/* Past injuries */}
      {pastInjuries.length > 0 && (
        <>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', margin: '16px 0 8px' }}>
            Storico infortuni
          </div>
          {pastInjuries.map(injury => (
            <div key={injury.id} className="card" style={{ marginBottom: 8, opacity: 0.7 }}>
              <div className="card-header">
                <div style={{ width:'85%', display:'flex',gap:5, flexWrap:'wrap'}}>
                  <span style={{ fontWeight: 600, alignContent:'center'}}>{optLabel(INJURY_TYPE_OPTIONS, injury.type)}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin:'auto 0' }}>
                    {optLabel(BODY_PART_OPTIONS, injury.bodyPart)}
                  </span>
                </div>
                <button className="btn-icon" onClick={() => {
                  if (window.confirm('Eliminare questo infortunio?')) {
                    removeInjury(injury.id)
                    toast('Infortunio eliminato', 'success')
                  }
                }}>x</button>
              </div>
              <span className="tag" style={{ background: severityColors[injury.severity], color: '#fff', opacity: 0.7, marginBottom:10 }}>
                {optLabel(SEVERITY_OPTIONS, injury.severity)}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {injury.startDate} → {injury.endDate}
                {injury.matchesMissed > 0 && ` · ${injury.matchesMissed} partite`}
              </div>
            </div>
          ))}
        </>
      )}

      {injuries.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="empty-state-title">Nessun infortunio</div>
          <div className="empty-state-text">Tieni traccia dei tuoi stop per analizzare l'impatto sulle prestazioni</div>
        </div>
      )}
    </div>
  )
}

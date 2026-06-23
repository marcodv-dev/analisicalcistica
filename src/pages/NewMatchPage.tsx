import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMatches } from '../hooks/useMatches'
import * as db from '../db'
import { useTags } from '../hooks/useTags'
import { useSeasons } from '../hooks/useSeasons'
import { useToast } from '../components/ui/Toast'
import type { Match, Role, Weather, PitchType, PitchCondition, MentalState, CompetitionType, Tag } from '../types'
import { ROLES, WEATHER_OPTIONS, PITCH_TYPE_OPTIONS, PITCH_CONDITION_OPTIONS, MENTAL_STATE_OPTIONS } from '../types'
import back from '../assets/left-chevron.png'
import save from '../assets/diskette.png'
import home from '../assets/house.png'

interface FormData {
  date: string
  opponent: string
  competition: CompetitionType
  seasonId: string
  matchTitle: string
  homeAway: 'home' | 'away' | 'neutral'
  formation: string
  weather: Weather
  pitchType: PitchType
  pitchCondition: PitchCondition
  mentalState: MentalState
  sleepHours: string
  lineupStatus: 'starter' | 'substitute'
  substitutionMinute: string
  minutesPlayed: number
  roleSlots: { role: string; minutes: string }[]
  teamScore: string
  opponentScore: string
  goals: string
  assists: string
  shotsOnTarget: string
  shotsTotal: string
  crossesSuccessful: string
  crossesTotal: string
  dribblesSuccessful: string
  dribblesTotal: string
  bigChancesCreated: string
  bigChancesMissed: string
  ballsRecovered: string
  foulsMade: string
  foulsSuffered: string
  tacklesSuccessful: string
  tacklesTotal: string
  yellowCards: string
  redCards: string
  decisiveErrors: string
  directOpponent: string
  opponentLevel: string
  opponentNotes: string
  selfRating: string
  misterRating: string
  newspaperRating: string
  tagIds: string[]
  notes: string
}

const initialForm: FormData = {
  date: new Date().toISOString().split('T')[0],
  opponent: '',
  competition: 'league',
  seasonId: '',
  matchTitle: '',
  homeAway: 'home',
  formation: '4-3-3',
  weather: 'sunny',
  pitchType: 'natural',
  pitchCondition: 'good',
  mentalState: 'normal',
  sleepHours: '',
  lineupStatus: 'starter',
  substitutionMinute: '',
  minutesPlayed: 90,
  roleSlots: [{ role: 'rw', minutes: '90' }],
  teamScore: '',
  opponentScore: '',
  goals: '',
  assists: '',
  shotsOnTarget: '',
  shotsTotal: '',
  crossesSuccessful: '',
  crossesTotal: '',
  dribblesSuccessful: '',
  dribblesTotal: '',
  bigChancesCreated: '',
  bigChancesMissed: '',
  ballsRecovered: '',
  foulsMade: '',
  foulsSuffered: '',
  tacklesSuccessful: '',
  tacklesTotal: '',
  yellowCards: '',
  redCards: '',
  decisiveErrors: '',
  directOpponent: '',
  opponentLevel: '',
  opponentNotes: '',
  selfRating: '',
  misterRating: '',
  newspaperRating: '',
  tagIds: [],
  notes: '',
}

export default function NewMatchPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const { addMatch, editMatch } = useMatches()
  const { tags } = useTags()
  const { seasons } = useSeasons()
  const { toast } = useToast()
  const [form, setForm] = useState<FormData>(initialForm)
  const [saving, setSaving] = useState(false)
  const [loadingMatch, setLoadingMatch] = useState(false)
  const originalMatchRef = useRef<Match | null>(null)

  useEffect(() => {
    if (!id) return
    setLoadingMatch(true)
    db.getMatch(id).then(match => {
      if (!match) { navigate('/history'); return }
      originalMatchRef.current = match
      setForm({
        date: match.date.split('T')[0],
        opponent: match.opponent,
        competition: match.competition,
        seasonId: match.seasonId || '',
        matchTitle: match.matchTitle || '',
        homeAway: match.homeAway,
        formation: match.formation,
        weather: match.weather,
        pitchType: match.pitchType,
        pitchCondition: match.pitchCondition,
        mentalState: match.mentalState,
        sleepHours: match.sleepHours?.toString() || '',
        lineupStatus: match.lineupStatus,
        substitutionMinute: match.substitutionMinute?.toString() || '',
        minutesPlayed: match.minutesPlayed,
        roleSlots: [
          { role: match.primaryRole, minutes: match.minutesInRole.toString() },
          ...(match.secondaryRole ? [{ role: match.secondaryRole, minutes: Math.max(0, match.minutesPlayed - match.minutesInRole).toString() }] : []),
        ],
        teamScore: match.teamScore.toString(),
        opponentScore: match.opponentScore.toString(),
        goals: match.goals.toString(),
        assists: match.assists.toString(),
        shotsOnTarget: match.shotsOnTarget.toString(),
        shotsTotal: match.shotsTotal.toString(),
        crossesSuccessful: match.crossesSuccessful.toString(),
        crossesTotal: match.crossesTotal.toString(),
        dribblesSuccessful: match.dribblesSuccessful.toString(),
        dribblesTotal: match.dribblesTotal.toString(),
        bigChancesCreated: match.bigChancesCreated.toString(),
        bigChancesMissed: match.bigChancesMissed.toString(),
        ballsRecovered: match.ballsRecovered.toString(),
        foulsMade: match.foulsMade.toString(),
        foulsSuffered: match.foulsSuffered.toString(),
        tacklesSuccessful: match.tacklesSuccessful.toString(),
        tacklesTotal: match.tacklesTotal.toString(),
        yellowCards: match.yellowCards.toString(),
        redCards: match.redCards.toString(),
        decisiveErrors: match.decisiveErrors.toString(),
        directOpponent: match.directOpponent || '',
        opponentLevel: match.opponentLevel || '',
        opponentNotes: match.opponentNotes || '',
        selfRating: match.selfRating?.toString() || '',
        misterRating: match.misterRating?.toString() || '',
        newspaperRating: match.newspaperRating?.toString() || '',
        tagIds: match.tagIds || [],
        notes: match.notes || '',
      })
      setLoadingMatch(false)
    })
  }, [id, navigate])

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const TEXT_FIELDS = new Set<keyof FormData>(['opponent', 'matchTitle', 'notes', 'opponentNotes'])
  const set = (field: keyof FormData, value: any) =>
    setForm(prev => ({ ...prev, [field]: TEXT_FIELDS.has(field) ? capitalize(String(value)) : value }))

  const toggleTag = (tagId: string) => {
    setForm(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const roleMinutesOk = form.roleSlots.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0) === form.minutesPlayed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleMinutesOk) { toast('Somma minuti ruoli non corrisponde ai minuti giocati', 'warning'); return }
    setSaving(true)

    try {
      const selectedSeason = form.seasonId ? seasons.find(s => s.id === form.seasonId) : undefined
      const matchData: Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'autoRating'> = {
        date: form.date,
        opponent: form.opponent,
        competition: form.competition,
        competitionName: selectedSeason ? selectedSeason.name : '',
        seasonId: form.seasonId || undefined,
        matchTitle: form.matchTitle || undefined,
        homeAway: form.homeAway,
        formation: form.formation,
        weather: form.weather,
        pitchType: form.pitchType,
        pitchCondition: form.pitchCondition,
        mentalState: form.mentalState,
        sleepHours: form.sleepHours ? Number(form.sleepHours) : undefined,
        lineupStatus: form.lineupStatus,
        substitutionMinute: form.substitutionMinute ? Number(form.substitutionMinute) : undefined,
        minutesPlayed: form.minutesPlayed,
        primaryRole: form.roleSlots[0]?.role as Role || 'rw',
        secondaryRole: form.roleSlots[1]?.role as Role || undefined,
        minutesInRole: Number(form.roleSlots[0]?.minutes) || form.minutesPlayed,
        teamScore: Number(form.teamScore) || 0,
        opponentScore: Number(form.opponentScore) || 0,
        goals: Number(form.goals) || 0,
        assists: Number(form.assists) || 0,
        shotsOnTarget: Number(form.shotsOnTarget) || 0,
        shotsTotal: Number(form.shotsTotal) || 0,
        crossesSuccessful: Number(form.crossesSuccessful) || 0,
        crossesTotal: Number(form.crossesTotal) || 0,
        dribblesSuccessful: Number(form.dribblesSuccessful) || 0,
        dribblesTotal: Number(form.dribblesTotal) || 0,
        bigChancesCreated: Number(form.bigChancesCreated) || 0,
        bigChancesMissed: Number(form.bigChancesMissed) || 0,
        xgSimplified: [],
        ballsRecovered: Number(form.ballsRecovered) || 0,
        foulsMade: Number(form.foulsMade) || 0,
        foulsSuffered: Number(form.foulsSuffered) || 0,
        tacklesSuccessful: Number(form.tacklesSuccessful) || 0,
        tacklesTotal: Number(form.tacklesTotal) || 0,
        yellowCards: Number(form.yellowCards) || 0,
        redCards: Number(form.redCards) || 0,
        decisiveErrors: Number(form.decisiveErrors) || 0,
        directOpponent: (form.directOpponent as Role) || undefined,
        opponentLevel: (form.opponentLevel as 'strong' | 'medium' | 'weak') || undefined,
        opponentNotes: form.opponentNotes || undefined,
        selfRating: Number(form.selfRating) || 0,
        misterRating: form.misterRating ? Number(form.misterRating) : undefined,
        newspaperRating: form.newspaperRating ? Number(form.newspaperRating) : undefined,
        tagIds: form.tagIds,
        events: [],
        notes: form.notes,
      }

      if (isEditing && originalMatchRef.current) {
        const orig = originalMatchRef.current
        await editMatch({ ...matchData, id, createdAt: orig.createdAt, updatedAt: new Date().toISOString() } as Match)
      } else {
        await addMatch(matchData)
      }
      toast(isEditing ? 'Partita modificata con successo' : 'Partita salvata con successo', 'success')
      navigate('/history')
    } catch (err) {
      toast('Errore durante il salvataggio', 'error')
      console.error('Error saving match:', err)
    } finally {
      setSaving(false)
    }
  }

  const input = (field: keyof FormData, opts?: { type?: string; placeholder?: string; min?: string; max?: string; step?: string }) => (
    <input
      type={opts?.type || 'text'}
      placeholder={opts?.placeholder}
      value={form[field] as string}
      onChange={e => set(field, e.target.value)}
      min={opts?.min}
      max={opts?.max}
      step={opts?.step}
    />
  )

  const numInput = (field: keyof FormData) => (
    <input
      className='default-input'
      type="number"
      min="0"
      value={form[field] as string}
      onChange={e => set(field, e.target.value)}
    />
  )

  const select = (field: keyof FormData, options: { value: string; label: string }[]) => (
    <select value={form[field] as string} onChange={e => set(field, e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )

  return (
    <>
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}> <img className='icon-img' src={back} alt="" /></button>
        <h1 className="page-title">{isEditing ? 'Modifica Partita' : 'Nuova Partita'}</h1>
        <div style={{ width: 36 }} />
      </div>
      <div className="page-content">
        {loadingMatch && <div className="loading"><div className="spinner" /></div>}
        {!loadingMatch && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Dati Base */}
          <div className="form-section">Dati Base</div>
          <div className="form-row">
            <div className="form-group">
              <label>Data</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Avversario</label>
              {input('opponent', { placeholder: 'es. Juventus' })}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Competizione</label>
              <select value={form.competition} onChange={e => {
                set('competition', e.target.value)
                if (e.target.value !== 'league') set('seasonId', '')
              }}>
                <option value="league">Stagione</option>
                <option value="friendly">Amichevole</option>
              </select>
            </div>
            {form.competition === 'league' && (
              <div className="form-group">
                <label>Stagione</label>
                <select value={form.seasonId} onChange={e => set('seasonId', e.target.value)}>
                  <option value="">— Seleziona —</option>
                  {seasons.filter(s => {
                    const now = new Date()
                    const start = new Date(s.startDate + 'T00:00:00')
                    const end = new Date(s.endDate + 'T23:59:59')
                    return now >= start && now <= end
                  }).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Casa/Fuori</label>
              <select value={form.homeAway} onChange={e => set('homeAway', e.target.value)}>
                <option value="home">Casa</option>
                <option value="away">Fuori</option>
                <option value="neutral">Neutro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Risultato</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {input('teamScore', { type: 'number', min: '0', placeholder: '2' })}
                <span style={{ color: 'var(--text-muted)' }}>:</span>
                {input('opponentScore', { type: 'number', min: '0', placeholder: '1' })}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Titolo partita (opzionale)</label>
            {input('matchTitle', { placeholder: 'es. La rimonta di Bergamo' })}
          </div>

          {/* Condizioni */}
          <div className="form-section">Condizioni</div>
          <div className="form-row">
            <div className="form-group">
              <label>Stato mentale</label>
              {select('mentalState', MENTAL_STATE_OPTIONS.map(o => ({ value: o.value, label: `${o.label}` })))}
            </div>
            <div className="form-group">
              <label>Ore sonno</label>
              {input('sleepHours', { type: 'number', min: '0', max: '12', step: '0.5', placeholder: '8' })}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Meteo</label>
              {select('weather', WEATHER_OPTIONS)}
            </div>
            <div className="form-group">
              <label>Formazione squadra</label>
              {input('formation', { placeholder: 'es. 4-3-3' })}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo campo</label>
              {select('pitchType', PITCH_TYPE_OPTIONS)}
            </div>
            <div className="form-group">
              <label>Condizione campo</label>
              {select('pitchCondition', PITCH_CONDITION_OPTIONS)}
            </div>
          </div>

          {/* Minuti e Ruolo */}
          <div className="form-section">Minuti e Ruolo</div>
          <div className="form-group">
            <label>Minuti giocati</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="range"
                min="0"
                max="120"
                step="1"
                value={form.minutesPlayed}
                onChange={e => set('minutesPlayed', Number(e.target.value))}
                style={{ flex: 1, minHeight:0 }}
              />
              <span style={{ fontWeight: 700, minWidth: 30, textAlign: 'right' }}>{form.minutesPlayed}'</span>
              <button type="button" className="btn-sm btn-secondary" onClick={() => set('minutesPlayed', 90)}>90'</button>
            </div>
          </div>
          <div className="form-group">
            <label>Esordio</label>
            <select value={form.lineupStatus} onChange={e => set('lineupStatus', e.target.value as any)}>
              <option value="starter">Titolare</option>
              <option value="substitute">Subentrato</option>
            </select>
          </div>
          {form.lineupStatus === 'substitute' && (
            <div className="form-group">
              <label>Minuto ingresso</label>
              {input('substitutionMinute', { type: 'number', min: '0', max: '120', placeholder: '60' })}
            </div>
          )}
          {form.roleSlots.map((slot, i) => (
            <div key={i} className="form-row">
              <div className="form-group">
                <label>{i === 0 ? 'Ruolo' : `Ruolo aggiuntivo`}</label>
                <select value={slot.role} onChange={e => {
                  const next = [...form.roleSlots]
                  next[i] = { ...next[i], role: e.target.value }
                  set('roleSlots', next)
                }}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Minuti</label>
                <input type="number" min="0" value={slot.minutes} onChange={e => {
                  const next = [...form.roleSlots]
                  next[i] = { ...next[i], minutes: e.target.value }
                  set('roleSlots', next)
                }} />
              </div>
            </div>
          ))}
          {form.roleSlots.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0) < form.minutesPlayed && (
            <button type="button" className="btn-sm btn-secondary" style={{ marginTop: 4 }} onClick={() => {
              const remaining = form.minutesPlayed - form.roleSlots.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)
              set('roleSlots', [...form.roleSlots, { role: form.roleSlots[form.roleSlots.length - 1]?.role || 'rw', minutes: String(remaining) }])
            }}>
              + Aggiungi ruolo
            </button>
          )}
          {!roleMinutesOk && (
            <div style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: 4 }}>
              La somma dei minuti nei ruoli ({form.roleSlots.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)}') non coincide con i minuti giocati ({form.minutesPlayed}')
            </div>
          )}

          {/* Statistiche Attacco */}
          <div className="form-section">Statistiche Attacco (Winger)</div>
          <div className="form-row">
            <div className="form-group">
              <label>Gol</label>
              {numInput('goals')}
            </div>
            <div className="form-group">
              <label>Assist</label>
              {numInput('assists')}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tiri in porta</label>
              {numInput('shotsOnTarget')}
            </div>
            <div className="form-group">
              <label>Tiri totali</label>
              {numInput('shotsTotal')}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Cross riusciti</label>
              {numInput('crossesSuccessful')}
            </div>
            <div className="form-group">
              <label>Cross totali</label>
              {numInput('crossesTotal')}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Dribbling riusciti</label>
              {numInput('dribblesSuccessful')}
            </div>
            <div className="form-group">
              <label>Dribbling totali</label>
              {numInput('dribblesTotal')}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Grandi occasioni create</label>
              {numInput('bigChancesCreated')}
            </div>
            <div className="form-group">
              <label>Grandi occasioni sbagliate</label>
              {numInput('bigChancesMissed')}
            </div>
          </div>

          {/* Statistiche Difensive */}
          <div className="form-section">Statistiche Difensive</div>
          <div className="form-row">
            <div className="form-group">
              <label>Palloni recuperati</label>
              {numInput('ballsRecovered')}
            </div>
            <div className="form-group">
              <label>Contrasti vinti</label>
              {numInput('tacklesSuccessful')}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contrasti totali</label>
              {numInput('tacklesTotal')}
            </div>
            <div className="form-group">
              <label>Falli fatti</label>
              {numInput('foulsMade')}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Falli subiti</label>
              {numInput('foulsSuffered')}
            </div>
          </div>

          {/* Disciplina */}
          <div className="form-section">Disciplina</div>
          <div className="form-row">
            <div className="form-group">
              <label>Cartellini gialli</label>
              {numInput('yellowCards')}
            </div>
            <div className="form-group">
              <label>Cartellini rossi</label>
              {numInput('redCards')}
            </div>
          </div>
          <div className="form-group">
            <label>Errori decisivi</label>
            {numInput('decisiveErrors')}
          </div>

          {/* Marcatura Avversaria */}
          <div className="form-section">Marcatura Avversaria</div>
          <div className="form-row">
            <div className="form-group">
              <label>Chi ti marcava</label>
              <select value={form.directOpponent} onChange={e => set('directOpponent', e.target.value)}>
                <option value="">— Seleziona —</option>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Livello avversario</label>
              <select value={form.opponentLevel} onChange={e => set('opponentLevel', e.target.value)}>
                <option value="">— Seleziona —</option>
                <option value="strong">Forte</option>
                <option value="medium">Medio</option>
                <option value="weak">Debole</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Note sull'avversario diretto</label>
            <textarea
              value={form.opponentNotes}
              onChange={e => set('opponentNotes', e.target.value)}
              placeholder="es. Era lentissimo sul lungo, voleva sempre il duello fisico..."
              rows={3}
            />
          </div>

          {/* Valutazioni */}
          <div className="form-section">Valutazioni</div>
          <div className="form-row">
            <div className="form-group">
              <label>Autovalutazione (1-10)</label>
              <input
                type="number" min="0" max="10" step="0.5"
                value={form.selfRating}
                onChange={e => set('selfRating', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Voto Mister</label>
              <input
                type="number" min="0" max="10" step="0.5"
                value={form.misterRating}
                onChange={e => set('misterRating', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Voto giornale/sito</label>
            <input
              type="number" min="0" max="10" step="0.5"
              value={form.newspaperRating}
              onChange={e => set('newspaperRating', e.target.value)}
            />
          </div>

          {/* Tag Tattici */}
          <div className="form-section">Tag Tattici</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map(tag => {
              const active = form.tagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="tag"
                  style={{
                    background: active ? (tag.color || 'var(--primary)') : 'var(--bg-card)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${tag.color || 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>

          {/* Note */}
          <div className="form-section">Note</div>
          <div className="form-group">
            <label>Note tattiche / mentali</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Es. Il terzino era lentissimo sul lungo, dovevo puntarlo subito. Poca lucidità sotto porta all'80esimo..."
              rows={4}
            />
          </div>

          {/* Submit */}
          <div style={{ marginTop: 16, marginBottom: 32, display: 'flex', gap: 12 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>
              Annulla
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={saving || !roleMinutesOk}>
              {saving ? null: <img alt='' src={save} className='icon-img'></img>}
              {saving ? 'Salvataggio...' : 'Salva Partita'}
            </button>
          </div>
        </form>
      )}
    </div>
    </>
  )
}

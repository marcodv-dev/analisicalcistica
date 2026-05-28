# Data Model — Tabellino Personale (Winger PWA)

## 1. Partita (Match) — Entità principale

```typescript
interface Match {
  id: string
  date: string            // ISO 8601: "2026-01-15"
  opponent: string        // "Real Madrid"
  competition: CompetitionType
  competitionName: string // "Serie A", "Champions League"
  matchTitle?: string     // "La rimonta di Bergamo"

  // Contesto partita
  homeAway: 'home' | 'away' | 'neutral'
  formation: string       // "4-3-3"
  weather: Weather
  pitchType: PitchType
  pitchCondition: PitchCondition
  mentalState: MentalState
  sleepHours?: number

  // Minuti e ruolo
  lineupStatus: 'starter' | 'substitute'
  substitutionMinute?: number
  minutesPlayed: number
  primaryRole: Role
  secondaryRole?: Role
  minutesInRole: number

  // Risultato squadra
  teamScore: number       // gol fatti
  opponentScore: number   // gol subiti

  // Statistiche attacco (winger)
  goals: number
  assists: number
  shotsOnTarget: number
  shotsTotal: number
  crossesSuccessful: number
  crossesTotal: number
  dribblesSuccessful: number
  dribblesTotal: number
  bigChancesCreated: number
  bigChancesMissed: number

  // xG / xA semplificati
  xgSimplified: XgEntry[]

  // Statistiche difensive
  ballsRecovered: number
  foulsMade: number
  foulsSuffered: number
  tacklesSuccessful: number
  tacklesTotal: number

  // Disciplina
  yellowCards: number
  redCards: number
  decisiveErrors: number

  // Marcatura avversaria
  directOpponent?: Role         // chi ti marcava
  opponentLevel?: 'strong' | 'medium' | 'weak'
  opponentNotes?: string

  // Valutazioni
  selfRating: number            // 1-10
  misterRating?: number         // 1-10
  newspaperRating?: number      // 1-10
  autoRating?: number           // calcolato dal sistema

  // Tag tattici
  tagIds: string[]

  // Timeline eventi
  events: MatchEvent[]

  // Note libere
  notes: string

  // Meta
  createdAt: string       // ISO
  updatedAt: string       // ISO
}
```

## 2. Sotto-Entità

### 2a. Evento Timeline (MatchEvent)

```typescript
interface MatchEvent {
  id: string
  minute: number
  type: EventType
  note?: string
  xgProbability?: XgProbability  // solo per tiri
  assistType?: AssistType        // solo per assist/key passes
  outcome: 'success' | 'failure' | 'neutral'
}

type EventType =
  | 'goal'
  | 'assist'
  | 'shot'
  | 'dribble_won'
  | 'dribble_lost'
  | 'cross'
  | 'key_pass'
  | 'big_chance_created'
  | 'big_chance_missed'
  | 'recovery'
  | 'tackle'
  | 'foul_made'
  | 'foul_suffered'
  | 'yellow_card'
  | 'red_card'
  | 'substitution_on'
  | 'substitution_off'
  | 'decisive_error'
```

### 2b. xG/xA Semplificati

```typescript
interface XgEntry {
  minute: number
  type: 'shot' | 'key_pass'
  probability: XgProbability
  outcome: 'goal' | 'saved' | 'missed' | 'blocked' | 'assist' | 'key_pass_completed'
  detail?: string
}

type XgProbability = 'high' | 'medium' | 'low'

type AssistType =
  | 'cross_simple'
  | 'through_ball'
  | 'difficult_key_pass'
  | 'great_individual_play'
```

### 2c. Ruoli (Role)

```typescript
type Role =
  | 'rw'           // ala destra
  | 'lw'           // ala sinistra
  | 'rm'           // esterno destro (5-3-2 / 3-5-2)
  | 'lm'           // esterno sinistro
  | 'cam'          // trequartista
  | 'ss'           // seconda punta
  | 'wf'           // attaccante largo
  | 'cf'           // punta centrale
  | 'cm'           // centrocampista centrale
  | 'wb'           // quinto di centrocampo
```

### 2d. Condizioni

```typescript
type Weather = 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'indoor' | 'snow'
type PitchType = 'natural' | 'artificial' | 'mixed'
type PitchCondition = 'perfect' | 'good' | 'heavy' | 'dry' | 'wet' | 'slippery'
type MentalState = 'charged' | 'normal' | 'tired' | 'nervous' | 'sleepy' | 'focused' | 'distracted'
type CompetitionType = 'league' | 'cup' | 'friendly' | 'playoff' | 'tournament' | 'other'
```

## 3. Tag Tattici

```typescript
interface Tag {
  id: string
  name: string
  category: TagCategory
  color?: string
  useCount: number
  lastUsed: string      // ISO data ultima partita
  createdAt: string
}

type TagCategory = 'tactical' | 'technical' | 'athletic'

// Tag predefiniti suggeriti
const PRESET_TAGS: TagPreset[] = [
  // Tattici
  { name: 'Difesa alta', category: 'tactical' },
  { name: 'Raddoppio', category: 'tactical' },
  { name: 'Squadra chiusa', category: 'tactical' },
  { name: 'Pressione alta', category: 'tactical' },
  { name: 'Gioco sulle fasce', category: 'tactical' },
  { name: 'Ripartenza', category: 'tactical' },
  // Tecnici
  { name: 'Bene nell\'1vs1', category: 'technical' },
  { name: 'Cross imprecisi', category: 'technical' },
  { name: 'Poco servito', category: 'technical' },
  { name: 'Tanta iniziativa', category: 'technical' },
  { name: 'Palleggio efficace', category: 'technical' },
  // Atletici
  { name: 'Grande condizione', category: 'athletic' },
  { name: 'Gambe pesanti', category: 'athletic' },
  { name: 'Recupero rapido', category: 'athletic' },
]
```

## 4. Stagione (Season) / Career Mode

```typescript
interface Season {
  id: string
  name: string          // "2025/2026"
  startDate: string
  endDate: string
  isActive: boolean
  teamName?: string
  teamLogo?: string
  notes?: string
}

interface SeasonGoals {
  id: string
  seasonId: string
  type: GoalType
  target: number
  current: number       // aggiornato in tempo reale
  customLabel?: string
  customUnit?: string
}

type GoalType =
  | 'goals'
  | 'assists'
  | 'avg_rating'
  | 'dribble_pct'
  | 'cross_pct'
  | 'appearances'
  | 'minutes'
  | 'custom'
```

## 5. Infortuni

```typescript
interface Injury {
  id: string
  startDate: string
  endDate?: string      // null = ancora fermo
  type: InjuryType
  bodyPart: BodyPart
  severity: 'minor' | 'moderate' | 'severe'
  notes?: string
  matchesMissed: number // calcolato o manuale
}

type InjuryType = 'strain' | 'fatigue' | 'sprain' | 'fracture' | 'contusion' | 'tendonitis' | 'other'
type BodyPart = 'hamstring' | 'ankle' | 'knee' | 'thigh' | 'groin' | 'calf' | 'quadriceps' | 'hip' | 'back' | 'foot'
```

## 6. Match Rating Automatico — Pesi

```typescript
const AUTO_RATING_WEIGHTS = {
  positive: {
    goal: 1.5,
    assist: 1.0,
    dribbleSuccessful: 0.2,
    crossSuccessful: 0.1,
    ballRecovered: 0.15,
    shotOnTarget: 0.2,
    foulSuffered: 0.05,
    bigChanceCreated: 0.3,
    tackleSuccessful: 0.15,
  },
  negative: {
    shotOffTarget: -0.15,
    crossFailed: -0.08,
    dribbleLost: -0.15,
    foulMade: -0.15,
    yellowCard: -0.4,
    redCard: -1.0,
    decisiveError: -0.5,
    bigChanceMissed: -0.3,
  },
  minutesBase: {
    '90': 6.5,    // voto base per 90 minuti
    factor: 0.02, // correzione per minuti giocati
  },
}
```

## 7. IndexedDB — Store Layout (via `idb`)

| Store Name | Key Path | Indices |
|---|---|---|
| `matches` | `id` | `date`, `opponent`, `competition`, `homeAway`, `primaryRole`, `lineupStatus`, `createdAt` |
| `tags` | `id` | `category`, `useCount` |
| `seasons` | `id` | `isActive`, `startDate` |
| `seasonGoals` | `id` | `seasonId`, `type` |
| `injuries` | `id` | `startDate`, `endDate`, `bodyPart` |
| `appSettings` | `key` | — (key-value store per preferenze) |

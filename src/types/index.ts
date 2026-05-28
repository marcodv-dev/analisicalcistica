// ─── Ruoli ───
export type Role =
  | 'gk' | 'cb' | 'lb' | 'rb' | 'dm' | 'cm' | 'wb'
  | 'rm' | 'lm' | 'cam' | 'rw' | 'lw' | 'wf' | 'ss' | 'cf'

export const ROLES: { value: Role; label: string }[] = [
  { value: 'gk', label: 'Portiere' },
  { value: 'cb', label: 'Difensore centrale' },
  { value: 'lb', label: 'Terzino sinistro' },
  { value: 'rb', label: 'Terzino destro' },
  { value: 'dm', label: 'Centrocampista difensivo' },
  { value: 'cm', label: 'Centrocampista centrale' },
  { value: 'wb', label: 'Quinto di centrocampo' },
  { value: 'rm', label: 'Esterno destro' },
  { value: 'lm', label: 'Esterno sinistro' },
  { value: 'cam', label: 'Trequartista' },
  { value: 'rw', label: 'Ala destra' },
  { value: 'lw', label: 'Ala sinistra' },
  { value: 'wf', label: 'Attaccante largo' },
  { value: 'ss', label: 'Seconda punta' },
  { value: 'cf', label: 'Punta centrale' },
]

// ─── Condizioni ───
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'indoor' | 'snow'
export const WEATHER_OPTIONS: { value: Weather; label: string }[] = [
  { value: 'sunny', label: 'Sereno' },
  { value: 'cloudy', label: 'Nuvoloso' },
  { value: 'rainy', label: 'Pioggia' },
  { value: 'windy', label: 'Vento' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'snow', label: 'Neve' },
]

export type PitchType = 'natural' | 'artificial' | 'mixed'
export const PITCH_TYPE_OPTIONS: { value: PitchType; label: string }[] = [
  { value: 'natural', label: 'Erba naturale' },
  { value: 'artificial', label: 'Erba sintetica' },
  { value: 'mixed', label: 'Misto' },
]

export type PitchCondition = 'perfect' | 'good' | 'heavy' | 'dry' | 'wet' | 'slippery'
export const PITCH_CONDITION_OPTIONS: { value: PitchCondition; label: string }[] = [
  { value: 'perfect', label: 'Perfetto' },
  { value: 'good', label: 'Buono' },
  { value: 'heavy', label: 'Pesante' },
  { value: 'dry', label: 'Secco' },
  { value: 'wet', label: 'Bagnato' },
  { value: 'slippery', label: 'Scivoloso' },
]

export type MentalState = 'charged' | 'normal' | 'tired' | 'nervous' | 'sleepy' | 'focused' | 'distracted'
export const MENTAL_STATE_OPTIONS: { value: MentalState; label: string; }[] = [
  { value: 'charged', label: 'Caricato' },
  { value: 'normal', label: 'Normale' },
  { value: 'tired', label: 'Stanco' },
  { value: 'nervous', label: 'Nervoso' },
  { value: 'sleepy', label: 'Poco sonno' },
  { value: 'focused', label: 'Concentrato' },
  { value: 'distracted', label: 'Distratto' },
]

export type CompetitionType = 'league' | 'cup' | 'friendly' | 'playoff' | 'tournament' | 'other'
export const COMPETITION_OPTIONS: { value: CompetitionType; label: string }[] = [
  { value: 'league', label: 'Campionato' },
  { value: 'cup', label: 'Coppa' },
  { value: 'friendly', label: 'Amichevole' },
  { value: 'playoff', label: 'Playoff' },
  { value: 'tournament', label: 'Torneo' },
  { value: 'other', label: 'Altro' },
]

// ─── Eventi Timeline ───
export type EventType =
  | 'goal' | 'assist' | 'shot' | 'dribble_won' | 'dribble_lost'
  | 'cross' | 'key_pass' | 'big_chance_created' | 'big_chance_missed'
  | 'recovery' | 'tackle' | 'foul_made' | 'foul_suffered'
  | 'yellow_card' | 'red_card' | 'substitution_on' | 'substitution_off'
  | 'decisive_error'

export type XgProbability = 'high' | 'medium' | 'low'

export interface MatchEvent {
  id: string
  minute: number
  type: EventType
  note?: string
  xgProbability?: XgProbability
  outcome: 'success' | 'failure' | 'neutral'
}

// ─── xG/xA ───
export interface XgEntry {
  minute: number
  type: 'shot' | 'key_pass'
  probability: XgProbability
  outcome: 'goal' | 'saved' | 'missed' | 'blocked' | 'assist' | 'key_pass_completed'
  detail?: string
}

export type AssistType = 'cross_simple' | 'through_ball' | 'difficult_key_pass' | 'great_individual_play'

// ─── Tag ───
export type TagCategory = 'tactical' | 'technical' | 'athletic'

export const TAG_CATEGORIES: { value: TagCategory; label: string; color: string }[] = [
  { value: 'tactical', label: 'Tattici', color: '#ff6b6b' },
  { value: 'technical', label: 'Tecnici', color: '#4ecdc4' },
  { value: 'athletic', label: 'Atletici', color: '#45b7d1' },
]

export interface Tag {
  id: string
  name: string
  category: TagCategory
  color?: string
  useCount: number
  lastUsed: string
  createdAt: string
}

export const PRESET_TAGS: Omit<Tag, 'id' | 'useCount' | 'lastUsed' | 'createdAt'>[] = [
  { name: 'Difesa alta', category: 'tactical', color: '#ff6b6b' },
  { name: 'Raddoppio', category: 'tactical', color: '#ff6b6b' },
  { name: 'Squadra chiusa', category: 'tactical', color: '#ff6b6b' },
  { name: 'Pressione alta', category: 'tactical', color: '#ff6b6b' },
  { name: 'Gioco sulle fasce', category: 'tactical', color: '#ff6b6b' },
  { name: 'Ripartenza', category: 'tactical', color: '#ff6b6b' },
  { name: "Bene nell'1vs1", category: 'technical', color: '#4ecdc4' },
  { name: 'Cross imprecisi', category: 'technical', color: '#4ecdc4' },
  { name: 'Poco servito', category: 'technical', color: '#4ecdc4' },
  { name: 'Tanta iniziativa', category: 'technical', color: '#4ecdc4' },
  { name: 'Palleggio efficace', category: 'technical', color: '#4ecdc4' },
  { name: 'Grande condizione', category: 'athletic', color: '#45b7d1' },
  { name: 'Gambe pesanti', category: 'athletic', color: '#45b7d1' },
  { name: 'Recupero rapido', category: 'athletic', color: '#45b7d1' },
]

// ─── Partita (Match) ───
export interface Match {
  id: string
  date: string
  opponent: string
  competition: CompetitionType
  competitionName: string
  matchTitle?: string
  homeAway: 'home' | 'away' | 'neutral'
  formation: string
  weather: Weather
  pitchType: PitchType
  pitchCondition: PitchCondition
  mentalState: MentalState
  sleepHours?: number
  lineupStatus: 'starter' | 'substitute'
  substitutionMinute?: number
  minutesPlayed: number
  primaryRole: Role
  secondaryRole?: Role
  minutesInRole: number
  teamScore: number
  opponentScore: number
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
  xgSimplified: XgEntry[]
  ballsRecovered: number
  foulsMade: number
  foulsSuffered: number
  tacklesSuccessful: number
  tacklesTotal: number
  yellowCards: number
  redCards: number
  decisiveErrors: number
  directOpponent?: Role
  opponentLevel?: 'strong' | 'medium' | 'weak'
  opponentNotes?: string
  selfRating: number
  misterRating?: number
  newspaperRating?: number
  autoRating?: number
  tagIds: string[]
  events: MatchEvent[]
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Stagione ───
export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  teamName?: string
  teamLogo?: string
  notes?: string
}

export type GoalType = 'goals' | 'assists' | 'avg_rating' | 'dribble_pct' | 'cross_pct' | 'appearances' | 'minutes' | 'custom'

export const GOAL_TYPE_OPTIONS: { value: GoalType; label: string; unit: string }[] = [
  { value: 'goals', label: 'Gol', unit: 'gol' },
  { value: 'assists', label: 'Assist', unit: 'assist' },
  { value: 'avg_rating', label: 'Media voto', unit: 'voto' },
  { value: 'dribble_pct', label: '% Dribbling riusciti', unit: '%' },
  { value: 'cross_pct', label: '% Cross riusciti', unit: '%' },
  { value: 'appearances', label: 'Presenze', unit: 'presenze' },
  { value: 'minutes', label: 'Minuti giocati', unit: 'min\' totali' },
  { value: 'custom', label: 'Personalizzato', unit: '' },
]

export interface SeasonGoal {
  id: string
  seasonId: string
  type: GoalType
  target: number
  current: number
  customLabel?: string
  customUnit?: string
}

// ─── Infortuni ───
export type InjuryType = 'strain' | 'fatigue' | 'sprain' | 'fracture' | 'contusion' | 'tendonitis' | 'other'
export const INJURY_TYPE_OPTIONS: { value: InjuryType; label: string }[] = [
  { value: 'strain', label: 'Stiramento' },
  { value: 'fatigue', label: 'Affaticamento' },
  { value: 'sprain', label: 'Distorsione' },
  { value: 'fracture', label: 'Frattura' },
  { value: 'contusion', label: 'Contusione' },
  { value: 'tendonitis', label: 'Tendinite' },
  { value: 'other', label: 'Altro' },
]

export type BodyPart = 'hamstring' | 'ankle' | 'knee' | 'thigh' | 'groin' | 'calf' | 'quadriceps' | 'hip' | 'back' | 'foot'
export const BODY_PART_OPTIONS: { value: BodyPart; label: string }[] = [
  { value: 'hamstring', label: 'Ileopsoas/Femorale' },
  { value: 'ankle', label: 'Caviglia' },
  { value: 'knee', label: 'Ginocchio' },
  { value: 'thigh', label: 'Coscia' },
  { value: 'groin', label: 'Inguine' },
  { value: 'calf', label: 'Polpaccio' },
  { value: 'quadriceps', label: 'Quadricipite' },
  { value: 'hip', label: 'Anca' },
  { value: 'back', label: 'Schiena' },
  { value: 'foot', label: 'Piede' },
]

export type Severity = 'minor' | 'moderate' | 'severe'
export const SEVERITY_OPTIONS: { value: Severity; label: string; color: string }[] = [
  { value: 'minor', label: 'Lieve', color: '#ffd93d' },
  { value: 'moderate', label: 'Moderato', color: '#ff6b6b' },
  { value: 'severe', label: 'Grave', color: '#e74c3c' },
]

export interface Injury {
  id: string
  startDate: string
  endDate?: string
  type: InjuryType
  bodyPart: BodyPart
  severity: Severity
  notes?: string
  matchesMissed: number
}

// ─── Rating Automatico ───
export interface AutoRatingInput {
  goals: number
  assists: number
  shotsOnTarget: number
  shotsTotal: number
  crossesSuccessful: number
  crossesTotal: number
  dribblesSuccessful: number
  dribblesTotal: number
  ballsRecovered: number
  foulsMade: number
  foulsSuffered: number
  tacklesSuccessful: number
  bigChancesCreated: number
  bigChancesMissed: number
  yellowCards: number
  redCards: number
  decisiveErrors: number
  minutesPlayed: number
}

// ─── Smart Insights ───
export interface SmartInsight {
  id: string
  type: 'performance' | 'tactical' | 'temporal' | 'mental'
  label: string
  description: string
  value: string
  trend?: 'up' | 'down' | 'stable'
  importance: number
}

// ─── Statistiche aggregate ───
export interface AggregatedStats {
  totalMatches: number
  starterMatches: number
  substituteMatches: number
  totalMinutes: number
  totalGoals: number
  totalAssists: number
  goalContributions: number
  minutesPerGoal: number
  minutesPerAssist: number
  avgSelfRating: number
  avgMisterRating: number
  avgNewspaperRating: number
  avgAutoRating: number
  totalDribbles: number
  dribbleSuccessRate: number
  totalCrosses: number
  crossSuccessRate: number
  totalShotsOnTarget: number
  shotAccuracy: number
  totalBallsRecovered: number
  avgBallsRecovered: number
  wins: number
  draws: number
  losses: number
  winRate: number
  last5Results: ('win' | 'draw' | 'loss')[]
  last5Ratings: number[]
  bestRating: number
}

// ─── App Settings ───
export interface AppSettings {
  darkMode: boolean
  activeSeasonId: string | null
  playerName: string
  playerNumber: number
}

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  activeSeasonId: null,
  playerName: '',
  playerNumber: 0,
}

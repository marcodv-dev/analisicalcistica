import { openDB, IDBPDatabase } from 'idb'
import type { Match, Tag, Season, SeasonGoal, Injury, AppSettings } from '../types'

const DB_NAME = 'tabellino-personale'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('matches')) {
          const matchesStore = db.createObjectStore('matches', { keyPath: 'id' })
          matchesStore.createIndex('date', 'date')
          matchesStore.createIndex('opponent', 'opponent')
          matchesStore.createIndex('competition', 'competition')
          matchesStore.createIndex('homeAway', 'homeAway')
          matchesStore.createIndex('primaryRole', 'primaryRole')
          matchesStore.createIndex('lineupStatus', 'lineupStatus')
        }
        if (!db.objectStoreNames.contains('tags')) {
          const tagsStore = db.createObjectStore('tags', { keyPath: 'id' })
          tagsStore.createIndex('category', 'category')
          tagsStore.createIndex('useCount', 'useCount')
        }
        if (!db.objectStoreNames.contains('seasons')) {
          const seasonsStore = db.createObjectStore('seasons', { keyPath: 'id' })
          seasonsStore.createIndex('isActive', 'isActive')
        }
        if (!db.objectStoreNames.contains('seasonGoals')) {
          const goalsStore = db.createObjectStore('seasonGoals', { keyPath: 'id' })
          goalsStore.createIndex('seasonId', 'seasonId')
        }
        if (!db.objectStoreNames.contains('injuries')) {
          const injuriesStore = db.createObjectStore('injuries', { keyPath: 'id' })
          injuriesStore.createIndex('startDate', 'startDate')
          injuriesStore.createIndex('bodyPart', 'bodyPart')
        }
        if (!db.objectStoreNames.contains('appSettings')) {
          db.createObjectStore('appSettings', { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

// ─── Generic helpers ───
function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ─── Matches ───
export async function getAllMatches(): Promise<Match[]> {
  const db = await getDb()
  const matches = await db.getAll('matches')
  return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getMatch(id: string): Promise<Match | undefined> {
  const db = await getDb()
  return db.get('matches', id)
}

export async function saveMatch(match: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = await getDb()
  const now = new Date().toISOString()
  const id = generateId()
  await db.add('matches', { ...match, id, createdAt: now, updatedAt: now })
  return id
}

export async function updateMatch(match: Match): Promise<void> {
  const db = await getDb()
  await db.put('matches', { ...match, updatedAt: new Date().toISOString() })
}

export async function deleteMatch(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('matches', id)
}

export async function getMatchesByDateRange(from: string, to: string): Promise<Match[]> {
  const db = await getDb()
  const index = db.transaction('matches').store.index('date')
  const range = IDBKeyRange.bound(from, to)
  return index.getAll(range)
}

// ─── Tags ───
export async function getAllTags(): Promise<Tag[]> {
  const db = await getDb()
  const tags = await db.getAll('tags')
  return tags.sort((a, b) => b.useCount - a.useCount)
}

export async function getTag(id: string): Promise<Tag | undefined> {
  const db = await getDb()
  return db.get('tags', id)
}

export async function saveTag(tag: Omit<Tag, 'id' | 'useCount' | 'lastUsed' | 'createdAt'>): Promise<string> {
  const db = await getDb()
  const id = generateId()
  const now = new Date().toISOString()
  await db.add('tags', { ...tag, id, useCount: 0, lastUsed: now, createdAt: now })
  return id
}

export async function updateTag(tag: Tag): Promise<void> {
  const db = await getDb()
  await db.put('tags', tag)
}

export async function deleteTag(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('tags', id)
}

export async function incrementTagUseCount(id: string): Promise<void> {
  const db = await getDb()
  const tag = await db.get('tags', id)
  if (tag) {
    tag.useCount++
    tag.lastUsed = new Date().toISOString()
    await db.put('tags', tag)
  }
}

// ─── Seasons ───
export async function getAllSeasons(): Promise<Season[]> {
  const db = await getDb()
  return db.getAll('seasons')
}

export async function getActiveSeason(): Promise<Season | undefined> {
  const db = await getDb()
  const index = db.transaction('seasons').store.index('isActive')
  const seasons = await index.getAll(1)
  return seasons[0]
}

export async function saveSeason(season: Omit<Season, 'id'>): Promise<string> {
  const db = await getDb()
  const id = generateId()
  await db.add('seasons', { ...season, id })
  return id
}

export async function updateSeason(season: Season): Promise<void> {
  const db = await getDb()
  await db.put('seasons', season)
}

export async function setActiveSeason(id: string): Promise<void> {
  const db = await getDb()
  const allSeasons = await db.getAll('seasons')
  for (const season of allSeasons) {
    season.isActive = season.id === id
    await db.put('seasons', season)
  }
}

export async function deleteSeason(id: string): Promise<void> {
  const db = await getDb()
  const goals = await getSeasonGoals(id)
  const tx = db.transaction(['seasons', 'seasonGoals'], 'readwrite')
  await tx.objectStore('seasons').delete(id)
  for (const goal of goals) {
    await tx.objectStore('seasonGoals').delete(goal.id)
  }
  await tx.done
}

// ─── Season Goals ───
export async function getSeasonGoals(seasonId: string): Promise<SeasonGoal[]> {
  const db = await getDb()
  const index = db.transaction('seasonGoals').store.index('seasonId')
  return index.getAll(seasonId)
}

export async function saveSeasonGoal(goal: Omit<SeasonGoal, 'id'>): Promise<string> {
  const db = await getDb()
  const id = generateId()
  await db.add('seasonGoals', { ...goal, id })
  return id
}

export async function updateSeasonGoal(goal: SeasonGoal): Promise<void> {
  const db = await getDb()
  await db.put('seasonGoals', goal)
}

export async function deleteSeasonGoal(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('seasonGoals', id)
}

// ─── Injuries ───
export async function getAllInjuries(): Promise<Injury[]> {
  const db = await getDb()
  const injuries = await db.getAll('injuries')
  return injuries.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
}

export async function saveInjury(injury: Omit<Injury, 'id'>): Promise<string> {
  const db = await getDb()
  const id = generateId()
  await db.add('injuries', { ...injury, id })
  return id
}

export async function updateInjury(injury: Injury): Promise<void> {
  const db = await getDb()
  await db.put('injuries', injury)
}

export async function deleteInjury(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('injuries', id)
}

// ─── Settings ───
const DEFAULT_SETTINGS_VALUES: AppSettings = {
  darkMode: false,
  activeSeasonId: null,
  playerName: '',
  playerNumber: 0,
}

export async function getSettings(): Promise<AppSettings> {
  const db = await getDb()
  const settings = await db.get('appSettings', 'user_settings')
  if (!settings) return DEFAULT_SETTINGS_VALUES
  return settings.value as AppSettings
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDb()
  await db.put('appSettings', { key: 'user_settings', value: settings })
}

// ─── Export / Import ───
export async function exportAllData(): Promise<string> {
  const db = await getDb()
  const data = {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    matches: await db.getAll('matches'),
    tags: await db.getAll('tags'),
    seasons: await db.getAll('seasons'),
    seasonGoals: await db.getAll('seasonGoals'),
    injuries: await db.getAll('injuries'),
    settings: await db.get('appSettings', 'user_settings'),
  }
  return JSON.stringify(data, null, 2)
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json)
  const db = await getDb()

  const tx = db.transaction(['matches', 'tags', 'seasons', 'seasonGoals', 'injuries', 'appSettings'], 'readwrite')

  if (data.matches) {
    for (const match of data.matches) await tx.objectStore('matches').put(match)
  }
  if (data.tags) {
    for (const tag of data.tags) await tx.objectStore('tags').put(tag)
  }
  if (data.seasons) {
    for (const season of data.seasons) await tx.objectStore('seasons').put(season)
  }
  if (data.seasonGoals) {
    for (const goal of data.seasonGoals) await tx.objectStore('seasonGoals').put(goal)
  }
  if (data.injuries) {
    for (const injury of data.injuries) await tx.objectStore('injuries').put(injury)
  }
  if (data.settings) {
    await tx.objectStore('appSettings').put(data.settings)
  }

  await tx.done
}

import { useState, useEffect, useCallback } from 'react'
import * as db from '../db'
import type { Season, SeasonGoal } from '../types'

function isInRange(season: Season, now: Date): boolean {
  const start = new Date(season.startDate + 'T00:00:00')
  const end = new Date(season.endDate + 'T23:59:59')
  return now >= start && now <= end
}

export function useSeasons() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [activeSeason, setActive] = useState<Season | undefined>()
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await db.getAllSeasons()
    setSeasons(data)
    const now = new Date()
    setActive(data.find(s => isInRange(s, now)))
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addSeason = useCallback(async (season: Omit<Season, 'id'>) => {
    const id = await db.saveSeason(season)
    await refresh()
    return id
  }, [refresh])

  const editSeason = useCallback(async (season: Season) => {
    await db.updateSeason(season)
    await refresh()
  }, [refresh])

  const removeSeason = useCallback(async (id: string) => {
    await db.deleteSeason(id)
    await refresh()
  }, [refresh])

  return { seasons, activeSeason, loading, refresh, addSeason, editSeason, removeSeason }
}

export function useSeasonGoals(seasonId: string | null) {
  const [goals, setGoals] = useState<SeasonGoal[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!seasonId) { setGoals([]); setLoading(false); return }
    setLoading(true)
    const data = await db.getSeasonGoals(seasonId)
    setGoals(data)
    setLoading(false)
  }, [seasonId])

  useEffect(() => { refresh() }, [refresh])

  const addGoal = useCallback(async (goal: Omit<SeasonGoal, 'id'>) => {
    const id = await db.saveSeasonGoal(goal)
    await refresh()
    return id
  }, [refresh])

  const editGoal = useCallback(async (goal: SeasonGoal) => {
    await db.updateSeasonGoal(goal)
    await refresh()
  }, [refresh])

  const removeGoal = useCallback(async (id: string) => {
    await db.deleteSeasonGoal(id)
    await refresh()
  }, [refresh])

  return { goals, loading, refresh, addGoal, editGoal, removeGoal }
}

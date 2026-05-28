import { useState, useEffect, useCallback } from 'react'
import * as db from '../db'
import type { Match } from '../types'
import { calculateAutoRating } from '../utils/rating'

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await db.getAllMatches()
    setMatches(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addMatch = useCallback(async (match: Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'autoRating'>) => {
    const autoRating = calculateAutoRating({
      goals: match.goals, assists: match.assists,
      shotsOnTarget: match.shotsOnTarget, shotsTotal: match.shotsTotal,
      crossesSuccessful: match.crossesSuccessful, crossesTotal: match.crossesTotal,
      dribblesSuccessful: match.dribblesSuccessful, dribblesTotal: match.dribblesTotal,
      ballsRecovered: match.ballsRecovered, foulsMade: match.foulsMade,
      foulsSuffered: match.foulsSuffered, tacklesSuccessful: match.tacklesSuccessful,
      bigChancesCreated: match.bigChancesCreated, bigChancesMissed: match.bigChancesMissed,
      yellowCards: match.yellowCards, redCards: match.redCards,
      decisiveErrors: match.decisiveErrors, minutesPlayed: match.minutesPlayed,
    })
    const id = await db.saveMatch({ ...match, autoRating })
    await refresh()
    return id
  }, [refresh])

  const editMatch = useCallback(async (match: Match) => {
    const autoRating = calculateAutoRating({
      goals: match.goals, assists: match.assists,
      shotsOnTarget: match.shotsOnTarget, shotsTotal: match.shotsTotal,
      crossesSuccessful: match.crossesSuccessful, crossesTotal: match.crossesTotal,
      dribblesSuccessful: match.dribblesSuccessful, dribblesTotal: match.dribblesTotal,
      ballsRecovered: match.ballsRecovered, foulsMade: match.foulsMade,
      foulsSuffered: match.foulsSuffered, tacklesSuccessful: match.tacklesSuccessful,
      bigChancesCreated: match.bigChancesCreated, bigChancesMissed: match.bigChancesMissed,
      yellowCards: match.yellowCards, redCards: match.redCards,
      decisiveErrors: match.decisiveErrors, minutesPlayed: match.minutesPlayed,
    })
    await db.updateMatch({ ...match, autoRating })
    await refresh()
  }, [refresh])

  const removeMatch = useCallback(async (id: string) => {
    await db.deleteMatch(id)
    await refresh()
  }, [refresh])

  return { matches, loading, refresh, addMatch, editMatch, removeMatch }
}

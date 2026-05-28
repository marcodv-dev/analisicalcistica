import type { Match, AggregatedStats } from '../types'

export function aggregateStats(matches: Match[]): AggregatedStats {
  const totalMatches = matches.length
  let starterMatches = 0
  let substituteMatches = 0
  let totalMinutes = 0
  let totalGoals = 0
  let totalAssists = 0
  let sumSelfRating = 0
  let selfRatingCount = 0
  let sumMisterRating = 0
  let misterRatingCount = 0
  let sumNewspaperRating = 0
  let newspaperRatingCount = 0
  let sumAutoRating = 0
  let autoRatingCount = 0
  let totalDribblesSuccessful = 0
  let totalDribbles = 0
  let totalCrossesSuccessful = 0
  let totalCrosses = 0
  let totalShotsOnTarget = 0
  let totalShots = 0
  let totalBallsRecovered = 0
  let wins = 0
  let draws = 0
  let losses = 0

  const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  for (const m of sortedMatches) {
    if (m.lineupStatus === 'starter') starterMatches++
    else substituteMatches++

    totalMinutes += m.minutesPlayed
    totalGoals += m.goals
    totalAssists += m.assists
    totalDribblesSuccessful += m.dribblesSuccessful
    totalDribbles += m.dribblesTotal
    totalCrossesSuccessful += m.crossesSuccessful
    totalCrosses += m.crossesTotal
    totalShotsOnTarget += m.shotsOnTarget
    totalShots += m.shotsTotal
    totalBallsRecovered += m.ballsRecovered

    if (m.selfRating > 0) { sumSelfRating += m.selfRating; selfRatingCount++ }
    if (m.misterRating && m.misterRating > 0) { sumMisterRating += m.misterRating; misterRatingCount++ }
    if (m.newspaperRating && m.newspaperRating > 0) { sumNewspaperRating += m.newspaperRating; newspaperRatingCount++ }
    if (m.autoRating && m.autoRating > 0) { sumAutoRating += m.autoRating; autoRatingCount++ }

    if (m.teamScore > m.opponentScore) wins++
    else if (m.teamScore === m.opponentScore) draws++
    else losses++
  }

  const last5 = sortedMatches.slice(-5)
  const last5Results = last5.map(m =>
    m.teamScore > m.opponentScore ? 'win' : m.teamScore === m.opponentScore ? 'draw' : 'loss'
  )
  const last5Ratings = last5.map(m => m.selfRating).filter(r => r > 0)

  const bestRating = matches.reduce((best, m) => Math.max(best, m.selfRating || 0), 0)

  return {
    totalMatches,
    starterMatches,
    substituteMatches,
    totalMinutes,
    totalGoals,
    totalAssists,
    goalContributions: totalGoals + totalAssists,
    minutesPerGoal: totalGoals > 0 ? Math.round(totalMinutes / totalGoals) : 0,
    minutesPerAssist: totalAssists > 0 ? Math.round(totalMinutes / totalAssists) : 0,
    avgSelfRating: selfRatingCount > 0 ? Math.round((sumSelfRating / selfRatingCount) * 10) / 10 : 0,
    avgMisterRating: misterRatingCount > 0 ? Math.round((sumMisterRating / misterRatingCount) * 10) / 10 : 0,
    avgNewspaperRating: newspaperRatingCount > 0 ? Math.round((sumNewspaperRating / newspaperRatingCount) * 10) / 10 : 0,
    avgAutoRating: autoRatingCount > 0 ? Math.round((sumAutoRating / autoRatingCount) * 10) / 10 : 0,
    totalDribbles,
    dribbleSuccessRate: totalDribbles > 0 ? Math.round((totalDribblesSuccessful / totalDribbles) * 100) : 0,
    totalCrosses,
    crossSuccessRate: totalCrosses > 0 ? Math.round((totalCrossesSuccessful / totalCrosses) * 100) : 0,
    totalShotsOnTarget,
    shotAccuracy: totalShots > 0 ? Math.round((totalShotsOnTarget / totalShots) * 100) : 0,
    totalBallsRecovered,
    avgBallsRecovered: totalMatches > 0 ? Math.round((totalBallsRecovered / totalMatches) * 10) / 10 : 0,
    wins,
    draws,
    losses,
    winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    last5Results,
    last5Ratings,
    bestRating,
  }
}

export function getStatsByRole(matches: Match[]) {
  const roleMap = new Map<string, Match[]>()
  for (const m of matches) {
    const existing = roleMap.get(m.primaryRole) || []
    existing.push(m)
    roleMap.set(m.primaryRole, existing)
  }
  const result: Record<string, AggregatedStats> = {}
  for (const [role, roleMatches] of roleMap) {
    result[role] = aggregateStats(roleMatches)
  }
  return result
}

export function getMatchesByCompetition(matches: Match[]) {
  const compMap = new Map<string, Match[]>()
  for (const m of matches) {
    const existing = compMap.get(m.competition) || []
    existing.push(m)
    compMap.set(m.competition, existing)
  }
  return compMap
}

export function getHomeAwayComparison(matches: Match[]) {
  const home = matches.filter(m => m.homeAway === 'home')
  const away = matches.filter(m => m.homeAway === 'away')
  return {
    home: home.length > 0 ? aggregateStats(home) : null,
    away: away.length > 0 ? aggregateStats(away) : null,
  }
}

export function getStarterSubComparison(matches: Match[]) {
  const starter = matches.filter(m => m.lineupStatus === 'starter')
  const sub = matches.filter(m => m.lineupStatus === 'substitute')
  return {
    starter: starter.length > 0 ? aggregateStats(starter) : null,
    substitute: sub.length > 0 ? aggregateStats(sub) : null,
  }
}

export function getGoalContributionRate(matches: Match[], teamName?: string): number {
  if (matches.length === 0) return 0
  const totalGoalsByTeam = matches.reduce((sum, m) => sum + m.teamScore, 0)
  if (totalGoalsByTeam === 0) return 0
  const contributions = matches.reduce((sum, m) => sum + m.goals + m.assists, 0)
  return Math.round((contributions / totalGoalsByTeam) * 100)
}

export function getStreak(matches: Match[]): { type: 'scoring' | 'assist' | 'rating'; current: number; best: number }[] {
  const sorted = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  function calcStreak(getValue: (m: Match) => number): { current: number; best: number } {
    let current = 0
    let best = 0
    for (const m of sorted) {
      if (getValue(m) > 0) {
        current++
        best = Math.max(best, current)
      } else {
        current = 0
      }
    }
    return { current, best }
  }

  return [
    { type: 'scoring', ...calcStreak(m => m.goals) },
    { type: 'assist', ...calcStreak(m => m.assists) },
    { type: 'rating', current: 0, best: matches.filter(m => (m.selfRating || 0) >= 7).length },
  ]
}

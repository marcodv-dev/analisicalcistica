import { useMemo } from 'react'
import type { Match, AggregatedStats } from '../types'
import { aggregateStats, getHomeAwayComparison, getStarterSubComparison } from '../utils/stats'

export function useStats(matches: Match[]) {
  return useMemo(() => aggregateStats(matches), [matches])
}

export function useHomeAwayStats(matches: Match[]) {
  return useMemo(() => getHomeAwayComparison(matches), [matches])
}

export function useStarterSubStats(matches: Match[]) {
  return useMemo(() => getStarterSubComparison(matches), [matches])
}

import type { AutoRatingInput } from '../types'

const BASE_RATING = 6.5
const WEIGHTS = {
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
}

export function calculateAutoRating(input: AutoRatingInput): number {
  let score = BASE_RATING

  score += input.goals * WEIGHTS.positive.goal
  score += input.assists * WEIGHTS.positive.assist
  score += input.dribblesSuccessful * WEIGHTS.positive.dribbleSuccessful
  score += input.crossesSuccessful * WEIGHTS.positive.crossSuccessful
  score += input.ballsRecovered * WEIGHTS.positive.ballRecovered
  score += input.shotsOnTarget * WEIGHTS.positive.shotOnTarget
  score += input.foulsSuffered * WEIGHTS.positive.foulSuffered
  score += input.bigChancesCreated * WEIGHTS.positive.bigChanceCreated
  score += input.tacklesSuccessful * WEIGHTS.positive.tackleSuccessful

  const shotsOffTarget = input.shotsTotal - input.shotsOnTarget
  score += shotsOffTarget * WEIGHTS.negative.shotOffTarget
  const crossesFailed = input.crossesTotal - input.crossesSuccessful
  score += crossesFailed * WEIGHTS.negative.crossFailed
  const dribblesLost = input.dribblesTotal - input.dribblesSuccessful
  score += dribblesLost * WEIGHTS.negative.dribbleLost
  score += input.foulsMade * WEIGHTS.negative.foulMade
  score += input.yellowCards * WEIGHTS.negative.yellowCard
  score += input.redCards * WEIGHTS.negative.redCard
  score += input.decisiveErrors * WEIGHTS.negative.decisiveError
  score += input.bigChancesMissed * WEIGHTS.negative.bigChanceMissed

  // Normalize per minutes played
  const minuteFactor = input.minutesPlayed / 90
  score = BASE_RATING + (score - BASE_RATING) * Math.min(minuteFactor, 1.0)

  // Clamp between 1 and 10
  return Math.round(Math.max(1, Math.min(10, score)) * 10) / 10
}

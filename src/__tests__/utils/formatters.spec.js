import { describe, it, expect } from 'vitest'
import { formatMushroomDecisionSummary } from '@/utils/formatters.js'

const t = (key, params) => {
  const templates = {
    'mushroom.status.psilocybin': 'Psilocybin',
    'mushroom.status.toxic': 'Toxic',
    'request.mushroomDecisionAllOf': `All ${params?.status}`,
    'request.mushroomDecisionAndMore': `${params?.status} and ${params?.count} more`
  }
  return templates[key] ?? key
}

describe('formatMushroomDecisionSummary', () => {
  it('returns null when there are no status counts', () => {
    expect(formatMushroomDecisionSummary(null, t)).toBeNull()
  })

  it('returns null when every mushroom is still not processed', () => {
    expect(formatMushroomDecisionSummary({ NOT_PROCESSED: 4 }, t)).toBeNull()
  })

  it('summarizes a single decided status as "All X"', () => {
    expect(formatMushroomDecisionSummary({ PSILOCYBIN: 4 }, t)).toBe('All psilocybin')
  })

  it('ignores not-yet-processed mushrooms when everything decided shares one status', () => {
    expect(formatMushroomDecisionSummary({ PSILOCYBIN: 2, NOT_PROCESSED: 1 }, t)).toBe('All psilocybin')
  })

  it('summarizes a mix of decided statuses as "X and N more"', () => {
    expect(formatMushroomDecisionSummary({ PSILOCYBIN: 1, TOXIC: 3 }, t)).toBe('Toxic and 1 more')
  })
})

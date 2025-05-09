import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as statsService from '@/services/statsService'
import axios from '@/config/axiosConfig'

vi.mock('@/config/axiosConfig')
vi.mock('@/utils/authHeaders', () => ({
  getAuthHeaders: () => ({ Authorization: 'Bearer mock-token' })
}))

describe('statsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches mushroom category stats', async () => {
    const mockData = [{ category: 'A', count: 10 }]
    axios.get.mockResolvedValue({ data: mockData })

    const result = await statsService.fetchMushroomCategoryStats()
    expect(axios.get).toHaveBeenCalledWith('/api/admin/stats/categories', {
      headers: { Authorization: 'Bearer mock-token' }
    })
    expect(result).toEqual(mockData)
  })

  it('fetches overview stats', async () => {
    const mockData = { total: 100, pending: 20 }
    axios.get.mockResolvedValue({ data: mockData })

    const result = await statsService.fetchOverviewStats()
    expect(axios.get).toHaveBeenCalledWith('/api/admin/stats/overview', {
      headers: { Authorization: 'Bearer mock-token' }
    })
    expect(result).toEqual(mockData)
  })

  it('fetches completed stats with interval and date range', async () => {
    const mockData = [5, 10, 15]
    const params = { interval: 'day', from: '2024-01-01', to: '2024-01-07' }
    axios.get.mockResolvedValue({ data: mockData })

    const result = await statsService.fetchCompletedStats(params)
    expect(axios.get).toHaveBeenCalledWith('/api/admin/stats/rate', {
      headers: { Authorization: 'Bearer mock-token' },
      params
    })
    expect(result).toEqual(mockData)
  })

  it('returns empty array on category stats error', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    const result = await statsService.fetchMushroomCategoryStats()
    expect(result).toEqual([])
  })

  it('returns null on overview stats error', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    const result = await statsService.fetchOverviewStats()
    expect(result).toBeNull()
  })

  it('returns empty array on completed stats error', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    const result = await statsService.fetchCompletedStats({ interval: 'day', from: '', to: '' })
    expect(result).toEqual([])
  })
})
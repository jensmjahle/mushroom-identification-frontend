import {beforeEach, describe, expect, it, vi} from 'vitest'
import axios from '@/config/axiosConfig'
import * as adminRequestService from '@/services/rest/adminRequestService'

vi.mock('@/config/axiosConfig')
vi.mock('@/utils/authHeaders', () => ({ getAuthHeaders: () => ({ Authorization: 'Bearer token' }) }))
vi.mock('vue-toastification', () => ({
  useToast: () => ({ error: vi.fn(), success: vi.fn() })
}))

const mockResponse = (data) => ({ data })

describe('adminRequestService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches paginated requests with default params', async () => {
    axios.get.mockResolvedValueOnce(mockResponse({ content: [1], totalPages: 1 }))

    const result = await adminRequestService.getPaginatedRequests()

    expect(result).toEqual({ content: [1], totalPages: 1 })
    expect(axios.get).toHaveBeenCalledWith('/api/admin/requests', expect.objectContaining({
      params: { page: 0, size: 10 },
      headers: { Authorization: 'Bearer token' }
    }))
  })

  it('handles error in getPaginatedRequests gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('fail'))
    const result = await adminRequestService.getPaginatedRequests()
    expect(result).toEqual({ content: [], totalPages: 1 })
  })

  it('fetches single request by ID', async () => {
    axios.get.mockResolvedValueOnce(mockResponse({ id: 'abc' }))
    const result = await adminRequestService.getUserRequestAdmin('abc')
    expect(result).toEqual({ id: 'abc' })
  })

  it('handles error in getUserRequestAdmin gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('fail'))
    const result = await adminRequestService.getUserRequestAdmin('xyz')
    expect(result).toBe(null)
  })

  it('changes request status', async () => {
    axios.post.mockResolvedValueOnce(mockResponse({ success: true }))
    const result = await adminRequestService.changeUserRequestStatus('abc', 'REVIEWED')
    expect(result).toEqual({ success: true })
    expect(axios.post).toHaveBeenCalledWith('/api/admin/requests/change-status', {
      userRequestId: 'abc',
      newStatus: 'REVIEWED'
    }, expect.any(Object))
  })

  it('fetches count for status', async () => {
    axios.get.mockResolvedValueOnce(mockResponse(5))
    const result = await adminRequestService.getCountOfRequestFromStatus('REVIEWED')
    expect(result).toBe(5)
  })

  it('gets next request from queue', async () => {
    axios.get.mockResolvedValueOnce(mockResponse({ id: 'next' }))
    const result = await adminRequestService.getNextRequestFromQueue()
    expect(result).toEqual({ id: 'next' })
  })
})

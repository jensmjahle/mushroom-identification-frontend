import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from '@/config/axiosConfig'
import * as chatService from '@/services/chatService'
import { useToast } from 'vue-toastification'

vi.mock('@/config/axiosConfig', () => ({
  default: {
    get: vi.fn()
  }
}))

vi.mock('@/utils/authHeaders', () => ({
  getAuthHeaders: () => ({ Authorization: 'Bearer mock-token' })
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    error: vi.fn()
  })
}))

const mockedAxios = axios

describe('chatService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches chat messages successfully', async () => {
    const userRequestId = 'REQ123'
    const mockData = [{ message: 'Hello' }, { message: 'World' }]
    mockedAxios.get.mockResolvedValueOnce({ data: mockData })

    const result = await chatService.fetchChatMessages(userRequestId)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/messages/${userRequestId}`,
      expect.any(Object)
    )
    expect(result).toEqual(mockData)
  })

  it('returns empty array and shows toast on error', async () => {
    const userRequestId = 'REQ456'
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))

    const result = await chatService.fetchChatMessages(userRequestId)

    expect(result).toEqual([])
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendNewUserRequest, getUserRequest } from '@/services/rest/userRequestService'
import axios from '@/config/axiosConfig.js'

vi.mock('@/config/axiosConfig.js', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

describe('userRequestService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('sends a new user request with images', async () => {
    const file = new File(['abc'], 'test.jpg')
    const mushrooms = [{ images: [file] }]
    const text = 'Test request'
    const response = { referenceCode: 'ABC123' }

    axios.post.mockResolvedValue({ data: response })

    const result = await sendNewUserRequest(text, mushrooms)

    expect(axios.post).toHaveBeenCalledWith(
      '/api/requests/create',
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'multipart/form-data'
        })
      })
    )
    expect(result).toEqual(response)
  })

  it('gets user request successfully', async () => {
    axios.get.mockResolvedValue({ data: { id: 'REQ123' } })

    const result = await getUserRequest()

    expect(axios.get).toHaveBeenCalledWith('/api/requests/me')
    expect(result).toEqual({ id: 'REQ123' })
  })
})

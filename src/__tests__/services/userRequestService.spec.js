import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendNewUserRequest, getUserRequest } from '@/services/userRequestService'

// Mock axios and toastification
vi.mock('@/config/axiosConfig', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

const toastError = vi.fn()
vi.mock('vue-toastification', () => ({
  useToast: () => ({ error: toastError })
}))

describe('userRequestService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error output during tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('sends a new user request with images', async () => {
    const file = new File(['abc'], 'test.jpg')
    const mushrooms = [{ images: [file] }]
    const text = 'Test request'
    const response = { referenceCode: 'ABC123' }

    const axios = (await import('@/config/axiosConfig')).default
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

  it('shows toast on failure to send request', async () => {
    const axios = (await import('@/config/axiosConfig')).default
    axios.post.mockRejectedValue(new Error('Fail'))

    try {
      await sendNewUserRequest('fail', [{ images: [] }])
    } catch (e) {
      expect(toastError).toHaveBeenCalledWith('Error sending new user request')
      expect(e.message).toBe('Fail')
    }
  })

  it('gets user request successfully', async () => {
    const axios = (await import('@/config/axiosConfig')).default
    axios.get.mockResolvedValue({ data: { id: 'REQ123' } })

    const result = await getUserRequest()

    expect(axios.get).toHaveBeenCalledWith('/api/requests/me')
    expect(result).toEqual({ id: 'REQ123' })
  })

  it('shows toast on failure to get user request', async () => {
    const axios = (await import('@/config/axiosConfig')).default
    axios.get.mockRejectedValue(new Error('fail'))
    const result = await getUserRequest()

    expect(result).toBeNull()
    expect(toastError).toHaveBeenCalledWith('Error fetching user request')
  })
})

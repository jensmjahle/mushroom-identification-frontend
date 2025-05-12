import { describe, it, expect, vi } from 'vitest'
import axios from '@/config/axiosConfig'
import * as authService from '@/services/rest/authService'

vi.mock('@/config/axiosConfig', () => ({
  default: {
    post: vi.fn()
  }
}))

const mockedAxios = axios

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls /auth/admin/login with username and password', async () => {
    const username = 'admin'
    const password = 'secret'
    const mockResponse = { data: { token: 'abc123' } }
    mockedAxios.post.mockResolvedValueOnce(mockResponse)

    const result = await authService.loginAdmin(username, password)

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/admin/login', { username, password })
    expect(result).toEqual(mockResponse)
  })

  it('calls /auth/user/login with referenceCode', async () => {
    const referenceCode = 'REF123'
    const mockResponse = { data: { token: 'xyz789' } }
    mockedAxios.post.mockResolvedValueOnce(mockResponse)

    const result = await authService.loginUser(referenceCode)

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/user/login', { referenceCode })
    expect(result).toEqual(mockResponse)
  })
})

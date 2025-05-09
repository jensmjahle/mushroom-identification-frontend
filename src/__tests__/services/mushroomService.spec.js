import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as mushroomService from '@/services/mushroomService'
import api from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

vi.mock('@/config/axiosConfig')
vi.mock('@/utils/authHeaders', () => ({ getAuthHeaders: vi.fn(() => ({ Authorization: 'Bearer test' })) }))

describe('mushroomService', () => {
  const userRequestId = 'REQ123'
  const mushroomId = 'm1'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getUserRequestMushrooms fetches mushroom list', async () => {
    const mockData = [{ mushroomId: 'm1' }, { mushroomId: 'm2' }]
    api.get.mockResolvedValue({ data: mockData })

    const result = await mushroomService.getUserRequestMushrooms(userRequestId)
    expect(api.get).toHaveBeenCalledWith(`/api/mushrooms/${userRequestId}`, { headers: { Authorization: 'Bearer test' } })
    expect(result).toEqual(mockData)
  })

  it('getMushroomById fetches a single mushroom', async () => {
    const mockData = { mushroomId: 'm1', name: 'Fly Agaric' }
    api.get.mockResolvedValue({ data: mockData })

    const result = await mushroomService.getMushroomById(mushroomId)
    expect(api.get).toHaveBeenCalledWith(`/api/mushroom/${mushroomId}`, { headers: { Authorization: 'Bearer test' } })
    expect(result).toEqual(mockData)
  })

  it('addImageToMushroom uploads files', async () => {
    const mockFile = new File(['img'], 'image.jpg', { type: 'image/jpeg' })
    api.post.mockResolvedValue({ data: 'ok' })

    const result = await mushroomService.addImageToMushroom(userRequestId, mushroomId, [mockFile])
    expect(api.post).toHaveBeenCalled()
    const [url, formData, config] = api.post.mock.calls[0]
    expect(url).toBe(`/api/mushrooms/${userRequestId}/image`)
    expect(formData instanceof FormData).toBe(true)
    expect(config.headers['Content-Type']).toBe('multipart/form-data')
    expect(result).toBe('ok')
  })

  it('changeMushroomStatus sends new status', async () => {
    const status = 'IDENTIFIED'
    const mockData = { success: true }
    api.post.mockResolvedValue({ data: mockData })

    const result = await mushroomService.changeMushroomStatus(userRequestId, mushroomId, status)
    expect(api.post).toHaveBeenCalledWith(
      `/api/admin/mushrooms/${userRequestId}/status`,
      { mushroomId, status },
      { headers: { Authorization: 'Bearer test' } }
    )
    expect(result).toEqual(mockData)
  })
})

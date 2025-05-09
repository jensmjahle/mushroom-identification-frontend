import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from '@/config/axiosConfig'
import * as adminService from '@/services/adminService'
import { getAuthHeaders } from '@/utils/authHeaders'

vi.mock('@/config/axiosConfig')
vi.mock('@/utils/authHeaders', () => ({
  getAuthHeaders: vi.fn(() => ({ Authorization: 'Bearer token' }))
}))

describe('adminService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getPaginatedAdmins returns data', async () => {
    axios.get.mockResolvedValueOnce({ data: { content: ['admin1'], totalPages: 1 } })
    const result = await adminService.getPaginatedAdmins(0, 10)
    expect(axios.get).toHaveBeenCalledWith('/api/admin', {
      params: { page: 0, size: 10 },
      headers: getAuthHeaders()
    })
    expect(result).toEqual({ content: ['admin1'], totalPages: 1 })
  })

  it('updateAdminProfile sends PUT request', async () => {
    axios.put.mockResolvedValueOnce()
    const data = { firstName: 'A', lastName: 'B', email: 'test@example.com' }
    await adminService.updateAdminProfile(data)
    expect(axios.put).toHaveBeenCalledWith('/api/admin/profile', data, {
      headers: getAuthHeaders()
    })
  })

  it('changeAdminPassword sends PUT request', async () => {
    axios.put.mockResolvedValueOnce()
    const data = { oldPassword: 'old', newPassword: 'new', confirmPassword: 'new' }
    await adminService.changeAdminPassword(data)
    expect(axios.put).toHaveBeenCalledWith('/api/admin/password', data, {
      headers: getAuthHeaders()
    })
  })

  it('deleteAdminAccount sends DELETE request', async () => {
    axios.delete.mockResolvedValueOnce()
    await adminService.deleteAdminAccount()
    expect(axios.delete).toHaveBeenCalledWith('/api/admin/delete', {
      headers: getAuthHeaders()
    })
  })

  it('getAdminMe returns profile', async () => {
    axios.get.mockResolvedValueOnce({ data: { id: 'admin123' } })
    const result = await adminService.getAdminMe()
    expect(axios.get).toHaveBeenCalledWith('/api/admin/me', {
      headers: getAuthHeaders()
    })
    expect(result).toEqual({ id: 'admin123' })
  })
})
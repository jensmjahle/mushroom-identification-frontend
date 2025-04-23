import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

/**
 * Fetches a paginated list of admins.
 * @param {number} page - The current page number (starts at 0).
 * @param {number} size - Number of items per page.
 * @returns {Promise<Page<AdminDTO>>}
 */
export const getPaginatedAdmins = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/admin', {
      params: { page, size },
      headers: getAuthHeaders()
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch admin list:', error)
    throw error
  }
}

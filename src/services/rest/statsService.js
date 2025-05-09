import axios from '@/config/axiosConfig.js'
import { getAuthHeaders } from '@/utils/authHeaders.js'

export const fetchMushroomCategoryStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats/categories', {
      headers: getAuthHeaders()
    })
    return response?.data || []
  } catch (error) {
    console.error('Failed to fetch mushroom category stats:', error)
    return []
  }
}

export const fetchOverviewStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats/overview', {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error('Failed to fetch overview stats:', error)
    return null
  }
}

export const fetchCompletedStats = async ({ interval, from, to }) => {
  try {
    const response = await axios.get('/api/admin/stats/rate', {
      headers: getAuthHeaders(),
      params: { interval, from, to }
    })
    return response?.data || []
  } catch (error) {
    console.error('Failed to fetch completed stats:', error)
    return []
  }
}

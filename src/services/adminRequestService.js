import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

export const getPaginatedRequests = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/admin/requests', {
      params: { page, size },
      headers: getAuthHeaders()
    })
    return response?.data || { content: [], totalElements: 0 }
  } catch (error) {
    console.error('Error fetching paginated requests:', error)
    return { content: [], totalElements: 0 }
  }
}

export const getUserRequestAdmin = async (id) => {
  try {
    const response = await axios.get(`/api/admin/requests/${id}`, {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error(`Error fetching request ${id}:`, error)
    return null
  }
}

export const changeUserRequestStatus = async (userRequestId, newStatus) => {
  try {
    const response = await axios.post('/api/admin/requests/change-status', {
      userRequestId,
      newStatus
    }, {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error(`Error changing status for ${userRequestId}:`, error)
    return null
  }
}

export const getCountOfRequestFromStatus = async (status) => {
  try {
    const response = await axios.get('/api/admin/requests/count', {
      params: { status },
      headers: getAuthHeaders()
    })
    return response?.data ?? 0
  } catch (error) {
    console.error(`Error fetching count for status ${status}:`, error)
    return 0
  }
}

import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'
import {useToast} from "vue-toastification";

export const getPaginatedRequests = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/admin/requests', {
      params: { page, size },
      headers: getAuthHeaders()
    })
    return response?.data || { content: [], totalElements: 0 }
  } catch (error) {
    console.error('Error fetching paginated requests:', error)
    useToast().error('Error fetching requests')
    return { content: [], totalElements: 0 }
  }
}
// Get NEW requests only
export const getPaginatedNewRequests = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/admin/requests', {
      params: { page, size, status: 'NEW' },
      headers: getAuthHeaders()
    })
    return response?.data || { content: [], totalPages: 1 }
  } catch (error) {
    console.error('Error fetching new requests:', error)
    useToast().error('Error fetching new requests')
    return { content: [], totalPages: 1 }
  }
}

// Get all requests EXCLUDING NEW
export const getPaginatedOtherRequests = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/admin/requests', {
      params: { page, size, status: 'NEW', exclude: true },
      headers: getAuthHeaders()
    })
    return response?.data || { content: [], totalPages: 1 }
  } catch (error) {
    console.error('Error fetching other requests:', error)
    useToast().error('Error fetching other requests')
    return { content: [], totalPages: 1 }
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
    useToast().error('Error fetching request details')
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
    useToast().error('Error changing request status')
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
    useToast().error('Error fetching request count')
    return 0
  }
}

export const getNextRequestFromQueue = async () => {
  try {
    const response = await axios.get('/api/admin/requests/next', {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error('Error fetching next request from queue:', error)
    useToast().error('Error fetching next request')
    return null
  }
}
// src/services/adminRequestService.js
import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

export const getPaginatedRequests = (page = 0, size = 10) => {
  return axios.get('/api/admin/requests', {
    params: { page, size },
    headers: getAuthHeaders()
  })
}

export const getUserRequestAdmin = (id) => {
  return axios.get(`/api/admin/requests/${id}`, {
    headers: getAuthHeaders()
  })
}

export const changeUserRequestStatus = (userRequestId, newStatus) => {
  return axios.post('/api/admin/requests/change-status', {
    userRequestId,
    newStatus
  }, {
    headers: getAuthHeaders()
  })
}

export const getCountOfRequestFromStatus = (status) => {
  return axios.get('/api/admin/requests/count', {
    params: { status },
    headers: getAuthHeaders()
  })
}

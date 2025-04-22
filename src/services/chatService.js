// src/services/chatService.js
import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

export const fetchChatMessages = (userRequestId) => {
  return axios.get(`/api/messages/${userRequestId}`, {
    headers: getAuthHeaders()
  })
}

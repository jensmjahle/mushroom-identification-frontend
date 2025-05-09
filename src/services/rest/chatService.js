import axios from '@/config/axiosConfig.js'
import { getAuthHeaders } from '@/utils/authHeaders.js'
import {useToast} from "vue-toastification";

export const fetchChatMessages = async (userRequestId) => {
  try {
    const response = await axios.get(`/api/messages/${userRequestId}`, {
      headers: getAuthHeaders()
    })
    return response?.data || []
  } catch (error) {
    console.error(`Error fetching chat messages for request ${userRequestId}:`, error)
    useToast().error('Error fetching chat history')
    return []
  }
}

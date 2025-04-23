import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'
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

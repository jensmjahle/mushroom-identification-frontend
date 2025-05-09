// src/services/rest/websocketService.js

import axios from '@/config/axiosConfig.js'
import { useToast } from 'vue-toastification'

export const getOnlineAdminCount = async () => {
  try {
    const response = await axios.get('/api/websocket/admins/online-count')
    console.log('Online admin count:', response.data)
    return response?.data ?? 0
  } catch (error) {
    console.error('Error fetching online admin count:', error)
    return 0
  }
}

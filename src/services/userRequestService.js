import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

export const sendNewUserRequest = async (text, images) => {
  const formData = new FormData()
  formData.append('text', text)
  images.forEach(img => formData.append('images', img))

  try {
    const response = await axios.post('/api/requests/create', formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })
    return response?.data || null
  } catch (error) {
    console.error('Error sending new user request:', error)
    return null
  }
}

export const getUserRequest = async () => {
  try {
    const response = await axios.get('/api/requests/me', {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error('Error fetching user request:', error)
    return null
  }
}

import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

export const sendNewUserRequest = (text, images) => {
  const formData = new FormData()
  formData.append('text', text)
  images.forEach(img => formData.append('images', img))

  return axios.post('/api/requests/create', formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getUserRequest = () => {
  return axios.get('/api/requests/me', {
    headers: getAuthHeaders()
  })
}

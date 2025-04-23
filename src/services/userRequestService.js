import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'
import {useToast} from "vue-toastification";

/**
 * Send a new user request. 
 *
 * @example
 * const text = 'This mushroom was found near the woods.';
 * const mushrooms = [
 *   { images: [file1, file2] },
 *   { images: [file3] }
 * ];
 *
 * @param text the text of the request
 * @param mushrooms the mushrooms to send, each with images
 * @returns {Promise<*|null>} the response data or null if an error occurred
 */
export const sendNewUserRequest = async (text, mushrooms) => {
  const formData = new FormData()

  formData.append('text', text)
  
  mushrooms.forEach((mushroom, mIndex) => {
    mushroom.images.forEach((img, iIndex) => {
      formData.append(`mushrooms[${mIndex}].images`, img)
    })
  })

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
    useToast().error('Error sending new user request')
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
    useToast().error('Error fetching user request')
    return null
  }
}

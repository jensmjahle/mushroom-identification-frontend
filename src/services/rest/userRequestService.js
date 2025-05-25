import axios from '@/config/axiosConfig.js'

/**
 * Send a new user request (no auth required).
 *
 * @param text the text of the request
 * @param mushrooms the mushrooms to send, each with images
 * @returns {Promise<*|null>} the response data or null if an error occurred
 */
export const sendNewUserRequest = async (text, mushrooms) => {
  const formData = new FormData()
  const { t } = usei18n()

  formData.append('text', text)

  mushrooms.forEach((mushroom, mIndex) => {
    mushroom.images.forEach((img) => {
      formData.append(`mushrooms[${mIndex}].images`, img)
    })
  })

  try {
    const response = await axios.post('/api/requests/create', formData, {
      headers: {
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
  const { t } = usei18n()
  try {
    const response = await axios.get('/api/requests/me')
    return response?.data || null
  } catch (error) {
    console.error('Error fetching user request')
    return null
  }
}

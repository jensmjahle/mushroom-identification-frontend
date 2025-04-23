// src/services/mushroomService.js
import api from '@/config/axiosConfig.js'
import { getAuthHeaders } from '@/utils/authHeaders.js'

/**
 * Fetches all mushrooms related to a user request.
 * @param {string} userRequestId - The ID of the user request.
 * @returns {Promise<Array>} - A list of mushroom DTOs.
 */
export const getUserRequestMushrooms = async (userRequestId) => {
  try {
    const response = await api.get(`/api/mushrooms/${userRequestId}`, {
      headers: getAuthHeaders()
    })
    return response.data
  } catch (error) {
    console.error('Error fetching mushrooms for request:', error)
    throw error
  }
}

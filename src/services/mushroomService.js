// src/services/mushroomService.js
import api from '@/config/axiosConfig.js';
import { getAuthHeaders } from '@/utils/authHeaders.js';

/**
 * Fetches all mushrooms related to a user request.
 * @param {string} userRequestId - The ID of the user request.
 * @returns {Promise<Array>} - A list of mushroom DTOs.
 */
export const getUserRequestMushrooms = async (userRequestId) => {
  try {
    const response = await api.get(`/api/mushrooms/${userRequestId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching mushrooms for request:', error);
    throw error;
  }
};

/**
 * Fetches updated mushroom by ID.
 * @param {string} mushroomId - The mushroom ID.
 * @returns {Promise<Object>} - The updated mushroom object.
 */
export const getMushroomById = async (mushroomId) => {
  try {
    const response = await api.get(`/api/mushroom/${mushroomId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching mushroom by ID:', error);
    throw error;
  }
};

/**
 * Uploads images to a specific mushroom in a user request.
 * @param {string} userRequestId
 * @param {string} mushroomId
 * @param {File[]} imageFiles
 * @returns {Promise<void>}
 */
export async function addImageToMushroom(userRequestId, mushroomId, imageFiles) {
  const formData = new FormData();
  formData.append('mushroomId', mushroomId);

  imageFiles.forEach((file) => {
    formData.append('images', file); // Use same key to form a list
  });

  try {
    const response = await api.post(
      `/api/mushrooms/${userRequestId}/image`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading image to mushroom:', error);
    throw error;
  }
}

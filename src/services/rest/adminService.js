import axios from '@/config/axiosConfig.js'
import { getAuthHeaders } from '@/utils/authHeaders.js'
import api from "@/config/axiosConfig.js";

/**
 * Fetches a paginated list of admins.
 * @param {number} page - The current page number (starts at 0).
 * @param {number} size - Number of items per page.
 * @returns {Promise<Page<AdminDTO>>}
 */
export const getPaginatedAdmins = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/admin', {
      params: { page, size },
      headers: getAuthHeaders()
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch admin list:', error)
    throw error
  }
}

/**
 * Updates the current admin's profile information.
 * @param {Object} profileData - An object with { firstName, lastName, email }
 * @returns {Promise<void>}
 */
export const updateAdminProfile = async (profileData) => {
  try {
    await axios.put('/api/admin/profile', profileData, {
      headers: getAuthHeaders()
    })
  } catch (error) {
    console.error('Failed to update admin profile:', error)
    throw error
  }
}

/**
 * Changes the current admin's password.
 * @param {Object} passwordData - An object with { oldPassword, newPassword, confirmPassword }
 * @returns {Promise<void>}
 */
export const changeAdminPassword = async (passwordData) => {
  try {
    await axios.put('/api/admin/password', passwordData, {
      headers: getAuthHeaders()
    })
  } catch (error) {
    console.error('Failed to change admin password:', error)
    throw error
  }
}

/**
 * Deletes the current admin account.
 * @returns {Promise<void>}
 */
export const deleteAdminAccount = async () => {
  try {
    await axios.delete('/api/admin/delete', {
      headers: getAuthHeaders()
    })
  } catch (error) {
    console.error('Failed to delete admin account:', error)
    throw error
  }
}

/**
 * Fetches the current admin's profile from the /me endpoint.
 * @returns {Promise<AdminDTO>}
 */
export const getAdminMe = async () => {
  try {
    const response = await axios.get('/api/admin/me', {
      headers: getAuthHeaders()
    })
    return response.data
  } catch (error) {
    console.error('Failed to load admin profile:', error)
    throw error
  }
}
export async function createAdmin(adminData) {
  const response = await api.post('/api/admin/superuser/create', adminData);
  return response.data;
}
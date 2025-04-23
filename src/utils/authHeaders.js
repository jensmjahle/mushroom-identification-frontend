/**
 * @description This function retrieves the JWT token from session storage and returns an object with the Authorization header.
 * @returns {{Authorization: string}}
 */
export function getAuthHeaders() {
  const token = sessionStorage.getItem('jwt')
  if (!token) throw new Error('No authentication token found')
  return {
    Authorization: `Bearer ${token}`
  }
}

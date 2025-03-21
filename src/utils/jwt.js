/**
 * Parse a JWT token and return the payload as an object.
 *
 * @param token - JWT token
 * @returns {any|null} - Decoded JWT token payload
 */
export function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const jsonPayload = atob(base64Payload);
    return JSON.parse(jsonPayload); 
  } catch (e) {
    return null;
  }
}

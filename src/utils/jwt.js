export function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const jsonPayload = atob(base64Payload);
    return JSON.parse(jsonPayload); 
  } catch (e) {
    return null;
  }
}

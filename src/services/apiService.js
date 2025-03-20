import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const sendNewUserRequest = async (text,  images) => {
  const requestBody = {
    text: text,
    images: images
  };
  
  try {
    const response = await axios.post(`${API_URL}/api/requests/create`,
        requestBody);
    return response.data;
  } catch (error) {
      console.error('Error while sending new user request', error);
      throw error;
    }
  }

export const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/admin/login`, {
      username,
      password,
    });
    console.log("Login request successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login request failed:", error);
    throw error;
  }
};

export const fetchProtectedData = async () => {
  try {
    const token = sessionStorage.getItem("jwt"); 
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(`${API_URL}/api/protected-endpoint`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Protected request failed:", error);
    throw error;
  }
};
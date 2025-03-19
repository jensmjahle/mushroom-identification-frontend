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

    return response.data;
  } catch (error) {
    console.error("Login request failed:", error);
    throw error;
  }
};
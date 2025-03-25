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


export const fetchChatMessages = async (userRequestId) => {
  try {
    const token = sessionStorage.getItem("jwt");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(`${API_URL}/api/messages/${userRequestId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Chat messages request failed:", error);
    throw error;
  }
};

export const getPaginatedRequests = async (page = 0, size = 10, token = null) => {
  const response = await axios.get(`${API_URL}/admin/requests/paginated`, {
    params: { page, size },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getUserRequestAdmin = async (userRequestId, token = null) => {
  const response = await axios.get(`${API_URL}/admin/requests/${userRequestId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getUserRequestImages = async (userRequestId, token = null) => {
  const response = await axios.get(`${API_URL}/admin/requests/${userRequestId}/images`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
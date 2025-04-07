import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const sendNewUserRequest = async (text, images) => {
  const formData = new FormData();
  formData.append('text', text);
  images.forEach(image => formData.append('images', image)); // multiple images

  try {
    const response = await axios.post(`${API_URL}/api/requests/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error while sending new user request', error);
    throw error;
  }
};


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
export const loginUser = async (referenceCode) => {
  try {
    const response = await axios.post(`${API_URL}/auth/user/login`, {
      referenceCode,
    });
    console.log("Login request successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login request failed:", error);
    throw error;
  }
}

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
export const getUserRequest = async (userRequestId, token = null) => {
  const response = await axios.get(`${API_URL}/api/requests/retrieve`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getUserRequestMushrooms = async (userRequestId, token = null) => {
  const response = await axios.get(`${API_URL}/api/mushrooms/${userRequestId}/all`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(response.data)
  return response.data;
};

export const getCountOfRequestFromStatus = async (requestStatus, token = null) => {
  const response = await axios.get(`${API_URL}/admin/requests/count`, {
    params: { status: requestStatus },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};



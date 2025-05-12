import axios from '@/config/axiosConfig.js'
import { getAuthHeaders } from '@/utils/authHeaders.js'
import {useToast} from "vue-toastification";

export const getPaginatedRequests = async ({
  page = 0,
  size = 10,
  status = null,
  exclude = false
} = {}) => {
  try {
    const params = { page, size }

    if (status) params.status = status
    if (exclude) params.exclude = true

    const response = await axios.get('/api/admin/requests', {
      params,
      headers: getAuthHeaders()
    })

    return response?.data || { content: [], totalPages: 1 }
  } catch (error) {
    console.error('Error fetching requests:', error)
    useToast().error('Error fetching requests')
    return { content: [], totalPages: 1 }
  }
}


export const getUserRequestAdmin = async (id) => {
  try {
    const response = await axios.get(`/api/admin/requests/${id}`, {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error(`Error fetching request ${id}:`, error)
    useToast().error('Error fetching request details')
    return null
  }
}

export const changeUserRequestStatus = async (userRequestId, newStatus) => {
  const response = await axios.post('/api/admin/requests/change-status', {
    userRequestId,
    newStatus
  }, {
    headers: getAuthHeaders()
  });

  return response?.data || null;
};


export const getCountOfRequestFromStatus = async (status) => {
  try {
    const response = await axios.get('/api/admin/requests/count', {
      params: { status },
      headers: getAuthHeaders()
    })
    return response?.data ?? 0
  } catch (error) {
    console.error(`Error fetching count for status ${status}:`, error)
    useToast().error('Error fetching request count')
    return 0
  }
}

export const getNextRequestFromQueue = async () => {
  try {
    const response = await axios.get('/api/admin/requests/next', {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error('Error fetching next request from queue:', error)
    useToast().error('Error fetching next request')
    return null
  }
}
export const getRequestsForMonth = async ({ year, month }) => {
  try {
    const response = await axios.get('/api/admin/stats/export/csv', {
      params: { year, month },
      headers: getAuthHeaders(),
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `requests_${year}_${month.toString().padStart(2, '0')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    useToast().success(`CSV file for ${month}/${year} downloaded successfully!`);
  } catch (error) {
    console.error(`Error exporting requests for ${month}/${year}:`, error);
    useToast().error('Error exporting requests');
  }
}

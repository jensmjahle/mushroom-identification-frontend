import axios from '@/config/axiosConfig.js'
import { getAuthHeaders } from '@/utils/authHeaders.js'
import api from "@/config/axiosConfig.js";

export const fetchMushroomCategoryStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats/categories', {
      headers: getAuthHeaders()
    })
    return response?.data || []
  } catch (error) {
    console.error('Failed to fetch mushroom category stats:', error)
    return []
  }
}

export const fetchOverviewStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats/overview', {
      headers: getAuthHeaders()
    })
    return response?.data || null
  } catch (error) {
    console.error('Failed to fetch overview stats:', error)
    return null
  }
}

export const fetchCompletedStats = async ({ interval, from, to }) => {
  try {
    const response = await axios.get('/api/admin/stats/rate', {
      headers: getAuthHeaders(),
      params: { interval, from, to }
    })
    return response?.data || []
  } catch (error) {
    console.error('Failed to fetch completed stats:', error)
    return []
  }
}

export const exportStatisticsPdf = async (year, month) => {
  try {
    const response = await axios.get('/api/admin/stats/export/pdf', {
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/pdf'
      },
      responseType: 'blob',
      params: { year, month }
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `statistics_${year}_${String(month).padStart(2, '0')}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success(`Downloaded statistics for ${year}-${String(month).padStart(2, '0')}`)
  } catch (error) {
    console.error('Failed to export statistics PDF:', error)
  }
}


export const logBecomeMemberPress = async () => {
  try {
    const response = await api.post('/api/stats/registration-button-press');
    return response.data;
  } catch (error) {
    console.error('Error logging become member button press:', error);
  }
};


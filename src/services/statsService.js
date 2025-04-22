// src/services/statsService.js
import axios from '@/config/axiosConfig'
import { getAuthHeaders } from '@/utils/authHeaders'

export const fetchMushroomCategoryStats = () =>
    axios.get('/api/admin/stats/categories', { headers: getAuthHeaders() })

export const fetchOverviewStats = () =>
    axios.get('/api/admin/stats/overview', { headers: getAuthHeaders() })

export const fetchCompletedStats = ({ interval, from, to }) =>
    axios.get('/api/admin/stats/rate', {
      headers: getAuthHeaders(),
      params: { interval, from, to }
    })

import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Fetch mushroom category statistics
export const fetchMushroomCategoryStats = async (token = null) => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/stats/categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch mushroom category stats:', error);
    throw error;
  }
};


export async function fetchCompletedStats({ interval = 'DAY', from, to }, token = null) {
  try {
    const response = await axios.get(`${API_URL}/api/admin/stats/rate`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        interval,
        from,
        to
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch completed stats:', error);
    throw error;
  }
}

// Dummy function for summary stats
export async function fetchSummaryStats() {
  return Promise.resolve({
    totalCompleted: 356,
    avgCompletionTime: '2d 6h'
  })
}

// Dummy function for mushroom type breakdown
export async function fetchMushroomTypeStats() {
  return Promise.resolve([
    { type: 'Fleinsopp', count: 127 },
    { type: 'Giftig', count: 45 },
    { type: 'Ukjent', count: 34 },
    { type: 'Spiselig', count: 82 },
    { type: 'Uidentifiserbar', count: 10 }
  ])
}



export async function fetchOverviewStats(token = null) {
  try {
    const response = await axios.get(`${API_URL}/api/admin/stats/overview`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch overview stats:', error);
    throw error;
  }
}

// Helper to generate an array of dates between from/to in YYYY-MM-DD
function getDateRange(fromStr, toStr) {
  const from = new Date(fromStr)
  const to = new Date(toStr)
  const dates = []

  while (from <= to) {
    dates.push(from.toISOString().split('T')[0])
    from.setDate(from.getDate() + 1)
  }

  return dates
}

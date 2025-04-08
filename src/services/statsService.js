// src/services/statsService.js

// Dummy function to simulate a completed requests graph endpoint
export async function fetchCompletedStats({ interval = 'DAY', from, to }) {
  const days = getDateRange(from, to)
  const points = days.map(date => ({
    date,
    count: Math.floor(Math.random() * 10) + 1 // Random number between 1-10
  }))

  return Promise.resolve({
    timeInterval: interval,
    from,
    to,
    points
  })
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

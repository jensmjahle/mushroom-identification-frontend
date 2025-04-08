<!-- StatsChart.vue -->
<template>
  <Card>
    <CardHeader>
      <h2 class="text-xl font-semibold">Completed Requests</h2>
      <select v-model="selectedInterval" @change="fetchStats">
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>
    </CardHeader>

    <CardContent>
      <LineChart :data="chartData" />
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchCompletedStats } from '@/services/statsService.js'
import LineChart from '@/components/charts/LineChart.vue'

const selectedInterval = ref(30)
const chartData = ref([])

const fetchStats = async () => {
  const now = new Date()
  const from = new Date()
  from.setDate(now.getDate() - selectedInterval.value)

  const response = await fetchCompletedStats({
    interval: 'DAY',
    from: from.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0]
  })

  chartData.value = response.points
}

onMounted(fetchStats)
</script>

<template>
  <div class="main-admin-component">
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-center">
      <h2>
        {{ t('admin.stats.completedTitle') }}
      </h2>
      <select
          v-model="selectedInterval"
          @change="fetchStats"
          class="mt-2 sm:mt-0 border border-gray-300 rounded px-2 py-1 text-sm"
      >
        <option value="7">{{ t('admin.stats.last7Days') }}</option>
        <option value="30">{{ t('admin.stats.last30Days') }}</option>
        <option value="90">{{ t('admin.stats.last90Days') }}</option>
      </select>
    </div>

    <div>
      <LineChart :data="chartData" />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchCompletedStats } from '@/services/statsService.js'
import LineChart from '@/components/charts/LineChart.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const selectedInterval = ref(30)
const chartData = ref([])

const fetchStats = async () => {
  const now = new Date()
  const from = new Date()
  from.setDate(now.getDate() - Number(selectedInterval.value))

  const response = await fetchCompletedStats({
    interval: 'DAY',
    from: from.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0]
  })

  chartData.value = response.points
}

onMounted(fetchStats)
watch(selectedInterval, fetchStats)
</script>

<template>
  <div class="main-admin-component space-y-6">
    <h2>{{ $t('admin.stats.overviewTitle') }}</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard :title="$t('admin.stats.totalRequests')" :value="stats.totalRequests" />
      <StatCard :title="$t('admin.stats.totalCompleted')" :value="stats.totalCompleted" />
      <StatCard :title="$t('admin.stats.weeklyRate')" :value="stats.weeklyRate + '/week'" />
      <StatCard :title="$t('admin.stats.ftrClicks')" :value="stats.ftrClicks" />
    </div>

    <ExportStatsCard @export="handleExport" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchOverviewStats } from '@/services/statsService'
import StatCard from '@/components/statistics/StatCard.vue'
import ExportStatsCard from '@/components/statistics/ExportStatsCard.vue'

const { t } = useI18n()
const stats = ref({
  totalRequests: 0,
  totalCompleted: 0,
  weeklyRate: 0,
  ftrClicks: 0
})

const loadStats = async () => {
  stats.value = await fetchOverviewStats()
}

const handleExport = ({ month, year }) => {
  console.log(`Export PDF for ${month}/${year}`)
  // Later: Call export endpoint or service
}

onMounted(loadStats)
</script>

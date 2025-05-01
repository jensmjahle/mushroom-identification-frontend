<template>
  <div class="main-admin-component">
    <Pie
        v-if="chartData.datasets.length"
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { ref, onMounted, watch } from 'vue'
import { fetchMushroomCategoryStats } from '@/services/statsService'
import { useI18n } from 'vue-i18n'
import { themeReady } from '@/composables/themeReady'
import {getStatusStyles} from "@/utils/mushroomStatusStyles.js";

ChartJS.register(ArcElement, Tooltip, Legend)


const token = sessionStorage.getItem('jwt')
const { t } = useI18n()
const chartData = ref({
  labels: [],
  datasets: []
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}

const loadChartData = async () => {
  const stats = await fetchMushroomCategoryStats(token)
  const filteredStats = stats.filter(s => s.status !== 'NOT_PROCESSED')

  chartData.value = {
    labels: filteredStats.map(s => getStatusStyles(s.status, t).label),
    datasets: [
      {
        label: t('admin.stats.mushroomCategories'),
        data: filteredStats.map(s => s.count),
        backgroundColor: filteredStats.map(s =>
            getComputedStyle(document.documentElement)
            .getPropertyValue(getStatusStyles(s.status).cssVar)
            .trim()
        )
      }
    ]
  }
}

// Wait for theme to be ready, prevent loading data before theme is ready
watch(themeReady, (ready) => {
  if (ready) loadChartData()
})

// If theme already ready, load immediately
onMounted(() => {
  if (themeReady.value) {
    loadChartData()
  }
})
</script>

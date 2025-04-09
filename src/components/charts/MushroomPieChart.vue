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

ChartJS.register(ArcElement, Tooltip, Legend)

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

const cssVarMap = {
  PSILOCYBIN: '--color-mushroom-psilocybin',
  NON_PSILOCYBIN: '--color-mushroom-non-psilocybin',
  TOXIC: '--color-mushroom-toxic',
  UNKNOWN: '--color-mushroom-unknown',
  UNIDENTIFIABLE: '--color-mushroom-unidentifiable'
}
function getCssVariableValue(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
}


const loadChartData = async () => {
  const stats = await fetchMushroomCategoryStats()

  chartData.value = {
    labels: stats.map(s => t(`mushroomStatus.${s.status}`)),
    datasets: [
      {
        label: t('admin.stats.mushroomCategories'),
        data: stats.map(s => s.count),
        backgroundColor: stats.map(s => getCssVariableValue(cssVarMap[s.status]))
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

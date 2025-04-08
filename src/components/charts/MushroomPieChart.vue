<template>
  <div class="main-admin-component">
    <h2>{{ t('admin.stats.mushroomCategories') }}</h2>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js'
import { onMounted, ref } from 'vue'
import { fetchMushroomCategoryStats } from '@/services/statsService'
import { useI18n } from 'vue-i18n'
import { resolveTailwindColor } from '@/utils/tailwindColors'

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


const colorMap = {
  PSILOCYBIN: 'bg-mushroom-psilocybin',
  NON_PSILOCYBIN: 'bg-mushroom-non-psilocybin',
  TOXIC: 'bg-mushroom-toxic',
  UNKNOWN: 'bg-mushroom-unknown',
  UNIDENTIFIABLE: 'bg-mushroom-unidentifiable'
}

onMounted(async () => {
  const stats = await fetchMushroomCategoryStats()

  chartData.value = {
    labels: stats.map(s => t(`mushroomStatus.${s.status}`)),
    datasets: [
      {
        label: t('admin.stats.mushroomCategories'),
        data: stats.map(s => s.count),
        backgroundColor: stats.map(s => resolveTailwindColor(colorMap[s.status]))
      }
    ]
  }
})
</script>

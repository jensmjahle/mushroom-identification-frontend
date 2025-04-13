<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
)

const props = defineProps({ data: Array })

const chartConfig = computed(() => ({
  labels: props.data.map(p => p.date),
  datasets: [{
    label: 'Completed Requests',
    data: props.data.map(p => p.count),
    fill: false,
    borderColor: '#4ade80',
    tension: 0.3
  }]
}))
</script>

<template>
  <Line :data="chartConfig" />
</template>

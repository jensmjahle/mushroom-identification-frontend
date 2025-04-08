<template>
  <div class="main-view">
    <StatsOverview></StatsOverview>
    <div class="vertical-box">
      <StatsChart></StatsChart>
      <div class="horizontal-box bg-bg2">
        <MushroomCategoryStats></MushroomCategoryStats>
        <MushroomPieChart></MushroomPieChart>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatsChart from "@/components/statistics/StatsChart.vue";
import MushroomCategoryStats from "@/components/statistics/MushroomCategoryStats.vue";
import MushroomPieChart from "@/components/charts/MushroomPieChart.vue";
import StatsOverview from "@/components/statistics/StatsOverview.vue";
</script>
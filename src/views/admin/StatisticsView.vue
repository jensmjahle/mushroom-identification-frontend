<template>
  <div class="main-view">
    <StatsOverview></StatsOverview>
    <div class="horizontal-box gap-2">
      <StatsChart class="w-1/2 shadow"></StatsChart>
      <div class="horizontal-box bg-bg2 w-1/2 shadow">
        <MushroomCategoryStats></MushroomCategoryStats>
        <MushroomPieChart></MushroomPieChart>
      </div>
    </div>
    <RequestsList></RequestsList>
  </div>
</template>

<script setup>
import StatsChart from "@/components/statistics/StatsChart.vue";
import MushroomCategoryStats from "@/components/statistics/MushroomCategoryStats.vue";
import MushroomPieChart from "@/components/charts/MushroomPieChart.vue";
import StatsOverview from "@/components/statistics/StatsOverview.vue";
import RequestsList from "@/components/RequestsList.vue";
</script>
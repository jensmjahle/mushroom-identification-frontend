<template>
  <div class="main-view">
    <StatsOverview></StatsOverview>
    <div class="horizontal-box gap-2 flex-col  md:flex-row">
      <StatsChart class="w-full md:w-1/2 shadow"></StatsChart>
      <div class="horizontal-box bg-bg2 w-full md:w-1/2 shadow">
        <MushroomCategoryStats></MushroomCategoryStats>
        <MushroomPieChart></MushroomPieChart>
      </div>
    </div>
    <div class="p-6 bg-bg rounded-lg">
      <div class="flex justify-end items-center gap-2 mb-2">
        <label class="text-sm text-text1-faded">{{ t('request.dateFilter.from') }}</label>
        <input type="date" v-model="dateFrom" class="p-2 rounded bg-bg3 text-text3 border border-border3" />
        <label class="text-sm text-text1-faded">{{ t('request.dateFilter.to') }}</label>
        <input type="date" v-model="dateTo" class="p-2 rounded bg-bg3 text-text3 border border-border3" />
      </div>
      <BaseList
          :items="otherRequests"
          :columns="columns"
          :sort-key="sortKey"
          :sort-direction="sortDirection"
          :clickable="false"
          @sort-change="toggleSort"
      >
        <template #default="{ item }">
          <RequestRow :item="item" @release="releaseRequest" />
        </template>
      </BaseList>
    </div>
  </div>
</template>


<script setup>
import StatsChart from "@/components/statistics/StatsChart.vue";
import MushroomCategoryStats from "@/components/statistics/MushroomCategoryStats.vue";
import MushroomPieChart from "@/components/charts/MushroomPieChart.vue";
import StatsOverview from "@/components/statistics/StatsOverview.vue";
import BaseList from "@/components/base/BaseList.vue";
import RequestRow from "@/components/base/rows/RequestRow.vue";
import { useFilteredRequestsTable } from "@/composables/useFilteredRequestsTable.js";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const {
  items: otherRequests,
  dateFrom,
  dateTo,
  sortKey,
  sortDirection,
  fetchItems,
  toggleSort,
  releaseRequest
} = useFilteredRequestsTable({ status: ref('NEW'), exclude: ref(true) })

const columns = [
  { label: t('request.id'), key: 'userRequestId', class: 'col-span-2' },
  { label: t('request.submitted'), key: 'createdAt', class: 'col-span-2', sortable: true },
  { label: t('request.lastUpdated'), key: 'updatedAt', class: 'col-span-2', sortable: true },
  { label: t('request.status'), key: 'status', class: 'col-span-1', sortable: true },
  { label: t('request.mushrooms'), key: 'numberOfMushrooms', class: 'col-span-1', sortable: true },
  { label: t('request.decision'), key: 'mushroomDecision', class: 'col-span-2', sortable: true },
  { label: t('request.owner'), key: 'username', class: 'col-span-2', sortable: true }
]

onMounted(fetchItems)
</script>

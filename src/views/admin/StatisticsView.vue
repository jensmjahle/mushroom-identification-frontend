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
      <BaseList
          :items="otherRequests"
          :columns="columns"
          :pagination="{ page: page, totalPages: totalPages }"
          :clickable="false"
          @next-page="() => page++"
          @prev-page="() => page--"
          
      >
        <template #default="{ item }">
          <RequestRow :item="item" />
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
import RequestsList from "@/components/RequestsList.vue";
import BaseList from "@/components/base/BaseList.vue";
import {getPaginatedOtherRequests} from "@/services/adminRequestService.js";
import RequestRow from "@/components/base/rows/RequestRow.vue";
import {onMounted, ref, watch} from "vue";
import {useToast} from "vue-toastification";

const columns = [
  { label: 'Request ID', key: 'userRequestId', class: 'col-span-6' },
  { label: 'Last Updated', key: 'updatedAt', class: 'col-span-3' },
  { label: 'Status', key: 'status', class: 'col-span-3' }
]
const page = ref(0)
const totalPages = ref(1)
const otherRequests = ref([])

const toast = useToast()

const fetchOtherRequests = async () => {
  try {
    const res = await getPaginatedOtherRequests(page.value)
    otherRequests.value = res.content
    totalPages.value = res.totalPages
  } catch (error) {
    toast.error('Failed to fetch other requests')
  }
}

onMounted(() => {
  fetchOtherRequests()
})

watch(page, fetchOtherRequests)
</script>
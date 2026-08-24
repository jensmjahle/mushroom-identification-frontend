<template>
  <div class="main-view">

    <!-- New Requests Section -->
    <div class="px-6 bg-bg rounded-lg">
      <BaseList
          :items="newRequests"
          :columns="newRequestColumns"
          :pagination="{ page: page1, totalPages: totalPages1 }"
          :clickable="true"
          @next-page="() => page1++"
          @prev-page="() => page1--"
          @item-click="handleClick"
      >
        <template #default="{ item }">
          <RequestRow :item="item" @release="handleRelease" />
        </template>
      </BaseList>
    </div>

    <!-- Other Requests Section -->
    <div class="p-6 bg-bg rounded-lg">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h2 class="text-lg font-bold">{{ t('request.otherRequests') }}</h2>
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div class="flex items-center gap-2">
            <label class="text-sm text-text1-faded">{{ t('request.dateFilter.from') }}</label>
            <input type="date" v-model="dateFrom" class="p-2 rounded bg-bg3 text-text3 border border-border3" />
            <label class="text-sm text-text1-faded">{{ t('request.dateFilter.to') }}</label>
            <input type="date" v-model="dateTo" class="p-2 rounded bg-bg3 text-text3 border border-border3" />
          </div>
          <select v-model="filterStatus" class="p-2 rounded bg-bg3 text-text3 border border-border3">
            <option value="ALL">{{ t('request.statusFilter.all') }}</option>
            <option value="PENDING">{{ t('request.statusFilter.pending') }}</option>
            <option value="IN_PROGRESS">{{ t('request.statusFilter.inProgress') }}</option>
            <option value="COMPLETED">{{ t('request.statusFilter.completed') }}</option>
          </select>
        </div>
      </div>

      <BaseList
          :items="otherRequests"
          :columns="otherRequestColumns"
          :sort-key="sortKey"
          :sort-direction="sortDirection"
          :clickable="true"
          @sort-change="toggleSort"
          @item-click="handleClick"
      >
        <template #default="{ item }">
          <RequestRow :item="item" @release="handleRelease" />
        </template>
      </BaseList>
    </div>

  </div>
</template>


<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import { useToast } from 'vue-toastification'
import BaseList from '@/components/base/BaseList.vue'
import RequestRow from '@/components/base/rows/RequestRow.vue'
import { getPaginatedRequests } from '@/services/rest/adminRequestService.js'
import { useFilteredRequestsTable } from '@/composables/useFilteredRequestsTable.js'
import { useAdminBroadcastStore } from '@/store/useAdminBroadcastStore.js'
import router from "@/router/index.js"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const page1 = ref(0)
const totalPages1 = ref(1)
const newRequests = ref([])

const filterStatus = ref('ALL')
const otherStatus = computed(() => filterStatus.value === 'ALL' ? 'NEW' : filterStatus.value)
const otherExclude = computed(() => filterStatus.value === 'ALL')

const {
  items: otherRequests,
  dateFrom,
  dateTo,
  sortKey,
  sortDirection,
  fetchItems: fetchOtherRequests,
  toggleSort,
  releaseRequest
} = useFilteredRequestsTable({ status: otherStatus, exclude: otherExclude })

const makeColumns = (sortable) => [
  { label: t('request.id'), key: 'userRequestId', class: 'col-span-2' },
  { label: t('request.submitted'), key: 'createdAt', class: 'col-span-2', sortable },
  { label: t('request.lastUpdated'), key: 'updatedAt', class: 'col-span-2', sortable },
  { label: t('request.status'), key: 'status', class: 'col-span-1', sortable },
  { label: t('request.mushrooms'), key: 'numberOfMushrooms', class: 'col-span-1', sortable },
  { label: t('request.decision'), key: 'mushroomDecision', class: 'col-span-2', sortable },
  { label: t('request.owner'), key: 'username', class: 'col-span-2', sortable }
]

const handleRelease = (userRequestId) => releaseRequest(userRequestId)

const newRequestColumns = computed(() => makeColumns(false))
const otherRequestColumns = computed(() => makeColumns(true))

const toast = useToast()

const handleClick = (item) => {
  if (!item?.userRequestId) return
  router.push({ name: 'admin-request', params: { userRequestId: item.userRequestId } })
}

const fetchNewRequests = async () => {
  try {
    const res = await getPaginatedRequests({ page: page1.value, status: 'NEW' })
    newRequests.value = res.content
    totalPages1.value = res.totalPages
  } catch (error) {
    toast.error('Failed to fetch new requests')
  }
}

onMounted(() => {
  fetchNewRequests()
  fetchOtherRequests()
})

watch(page1, fetchNewRequests)

// Refetch the queue when a new request comes in, instead of requiring a manual
// page refresh to see it.
const adminBroadcastStore = useAdminBroadcastStore()
watch(() => adminBroadcastStore.broadcastCounter, () => {
  if (adminBroadcastStore.lastBroadcastType === 'NEW_REQUEST_IN_QUEUE') {
    fetchNewRequests()
  }
})
</script>

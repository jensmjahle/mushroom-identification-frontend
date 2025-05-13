<template>
  <div class="main-view">

    <!-- New Requests Section -->
    <div class="px-6 bg-bg rounded-lg">
      <BaseList
          :items="newRequests"
          :columns="columns"
          :pagination="{ page: page1, totalPages: totalPages1 }"
          :clickable="true"
          @next-page="() => page1++"
          @prev-page="() => page1--"
          @item-click="handleClick"
      >
        <template #default="{ item }">
          <RequestRow :item="item" />
        </template>
      </BaseList>
    </div>

    <!-- Other Requests Section -->
    <div class="p-6 bg-bg rounded-lg">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h2 class="text-lg font-bold">{{ t('request.otherRequests') }}</h2>
        <div>
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
          :columns="columns"
          :pagination="{ page: page2, totalPages: totalPages2 }"
          :clickable="true"
          @next-page="() => page2++"
          @prev-page="() => page2--"
          @item-click="handleClick"
      >
        <template #default="{ item }">
          <RequestRow :item="item" />
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
import router from "@/router/index.js"
import { formatRelativeTime } from '@/utils/formatters.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const page1 = ref(0)
const totalPages1 = ref(1)
const newRequests = ref([])

const page2 = ref(0)
const totalPages2 = ref(1)
const otherRequests = ref([])
const filterStatus = ref('ALL')



const columns = computed(() => [
  { label: t('request.id'), key: 'userRequestId', class: 'col-span-5' },
  {
    label: t('request.lastUpdated'),
    key: 'updatedAt',
    class: 'col-span-3',
    format: formatRelativeTime
  },
  { label: t('request.status'), key: 'status', class: 'col-span-3' },
  { label: t('request.mushrooms'), key: 'numberOfMushrooms', class: 'col-span-1' }
])

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

const fetchOtherRequests = async () => {
  try {
    const status = filterStatus.value === 'ALL' ? 'NEW' : filterStatus.value
    const exclude = filterStatus.value === 'ALL'

    const res = await getPaginatedRequests({
      page: page2.value,
      status,
      exclude
    })

    otherRequests.value = res.content
    totalPages2.value = res.totalPages
  } catch (error) {
    toast.error('Failed to fetch other requests')
  }
}

onMounted(() => {
  fetchNewRequests()
  fetchOtherRequests()
})

watch(page1, fetchNewRequests)
watch(page2, fetchOtherRequests)

watch(filterStatus, () => {
  page2.value = 0
  fetchOtherRequests()
})
</script>


<template>
  <div class="w-full max-w-screen-xl mx-auto px-4 space-y-10">

    <!-- New Requests Section -->
    <div class="p-6 bg-bg rounded-lg">
      <h2 class="text-xl font-bold text-chat-other mb-4">New Requests</h2>
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
    <div class="p-6 bg-bg rounded-lg shadow-md">
      <h2 class="text-xl font-bold text-chat-other mb-4">All Other Requests</h2>
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
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import BaseList from '@/components/base/BaseList.vue'
import RequestRow from '@/components/base/rows/RequestRow.vue' 
import { getPaginatedNewRequests, getPaginatedOtherRequests } from '@/services/adminRequestService.js'

const page1 = ref(0)
const totalPages1 = ref(1)
const newRequests = ref([])

const page2 = ref(0)
const totalPages2 = ref(1)
const otherRequests = ref([])

const columns = [
  { label: 'Request ID', key: 'userRequestId', class: 'col-span-4' },
  { label: 'Username', key: 'username', class: 'col-span-4' },
  { label: 'Status', key: 'status', class: 'col-span-4' }
]

const toast = useToast()
const handleClick = (item) => {
  toast.info(`Clicked request ID: ${item.userRequestId}`)
  
}


const fetchNewRequests = async () => {
  try {
    const res = await getPaginatedNewRequests(page1.value)
    newRequests.value = res.content
    totalPages1.value = res.totalPages
  } catch (error) {
    toast.error('Failed to fetch new requests')
  }
}

const fetchOtherRequests = async () => {
  try {
    const res = await getPaginatedOtherRequests(page2.value)
    otherRequests.value = res.content
    totalPages2.value = res.totalPages
  } catch (error) {
    toast.error('Failed to fetch other requests')
  }
}

// Init + reactivity
onMounted(() => {
  fetchNewRequests()
  fetchOtherRequests()
})

watch(page1, fetchNewRequests)
watch(page2, fetchOtherRequests)
</script>



<style scoped>

</style>
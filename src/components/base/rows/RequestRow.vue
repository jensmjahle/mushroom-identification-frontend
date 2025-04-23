<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1 px-1 bg-bg1 hover:bg-bg2 cursor-pointer transition rounded-md">
    <p class="col-span-6 break-all">{{ item.userRequestId }}</p>
    <p class="col-span-3">{{ formatDate(item.updatedAt) }}</p>
    <div class="col-span-3">
      <RequestStatusBadge :status="item.status" />
    </div>
  </div>

  <!-- Mobile layout (unchanged) -->
  <div class="sm:hidden bg-bg1 p-4 rounded-md shadow-sm text-sm text-text1 space-y-1">
    <p><span class="font-semibold">Request ID:</span> {{ item.userRequestId }}</p>
    <p><span class="font-semibold">Last updated:</span> {{ formatDate(item.updatedAt) }}</p>
    <p><span class="font-semibold">Status:</span> <RequestStatusBadge :status="item.status" /></p>
  </div>
</template>

<script setup>
import RequestStatusBadge from "@/components/badges/RequestStatusBadge.vue";
import { formatDate } from '@/utils/formatters'

defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

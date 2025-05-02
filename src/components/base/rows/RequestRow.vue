<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1 px-1 bg-bg1 hover:bg-bg2 cursor-pointer transition rounded-md">
    <p class="col-span-5 break-all">{{ item.userRequestId }}</p>
    <p class="col-span-3">{{ formatDate(item.updatedAt) }}</p>
    <div class="col-span-3">
      <RequestStatusBadge :status="item.status" />
    </div>
    <p class="col-span-1 text-center">{{ item.numberOfMushrooms }}</p>
  </div>

  <!-- Mobile layout -->
  <div class="sm:hidden bg-bg1 p-2 rounded-md shadow-sm text-sm text-text1 space-y-0.5">
    <p><span class="font-semibold">Request ID:</span> {{ item.userRequestId }}</p>
    <p><span class="font-semibold">Last updated:</span> {{ formatDate(item.updatedAt) }}</p>
    <p><span class="font-semibold">Status:</span> <RequestStatusBadge :status="item.status" /></p>
    <p><span class="font-semibold">Mushrooms:</span> {{ item.numberOfMushrooms }}</p>
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

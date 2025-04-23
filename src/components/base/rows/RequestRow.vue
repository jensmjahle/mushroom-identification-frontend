<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1 bg-bg1">
    <p class="col-span-4 break-all">{{ item.userRequestId }}</p>
    <p class="col-span-4 truncate">{{ item.username || 'Unclaimed' }}</p>
    <div class="col-span-4">
      <StatusBadge :status="item.status" />
    </div>
  </div>

  <!-- Mobile layout -->
  <div class="sm:hidden bg-bg1 p-4 rounded-md shadow-sm text-sm text-text1 space-y-1">
    <p><span class="font-semibold">Request ID:</span> {{ item.userRequestId }}</p>
    <p><span class="font-semibold">Username:</span> {{ item.username || 'Unclaimed' }}</p>
    <p><span class="font-semibold">Status:</span> <StatusBadge :status="item.status" /></p>
  </div>
</template>

<script setup>
import StatusBadge from '@/components/badges/StatusBadge.vue'

defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

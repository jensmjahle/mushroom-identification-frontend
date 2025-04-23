<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1 bg-bg1 p-4 rounded-md shadow-sm">
    <p class="col-span-4 break-all">{{ item.userRequestId }}</p>
    <p class="col-span-4">{{ item.username || 'Unclaimed' }}</p>
    <p class="col-span-4 capitalize">{{ item.status.toLowerCase() }}</p>
  </div>

  <!-- Mobile layout -->
  <div class="sm:hidden bg-bg1 p-4 rounded-md shadow-sm text-sm text-text1 space-y-1">
    <p><span class="font-semibold">Request ID:</span> {{ item.userRequestId }}</p>
    <p><span class="font-semibold">Username:</span> {{ item.username || 'Unclaimed' }}</p>
    <p><span class="font-semibold">Status:</span> {{ item.status.toLowerCase() }}</p>
  </div>
</template>

<script setup>
defineProps({ item: Object })
</script>

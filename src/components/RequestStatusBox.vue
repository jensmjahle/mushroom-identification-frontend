<template>
  <div class=" border border-chat-border text-left rounded-lg shadow p-4 w-full max-w-screen-md mx-auto">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <!-- Info Block -->
      <div class="flex-1 space-y-1">
        <p class="text-sm text-gray-500">
          <span class="font-semibold text-chat-other">ID:</span> {{ request.userRequestId }}
        </p>
        <p class="text-sm text-gray-500">
          <span class="font-semibold text-chat-other">Created:</span> {{ formatDate(request.createdAt) }}
        </p>
        <p class="text-sm text-gray-500">
          <span class="font-semibold text-chat-other">Updated:</span> {{ formatDate(request.updatedAt) }}
        </p>
        <p class="text-sm text-gray-500">
          <span class="font-semibold text-chat-other">Moderator:</span> {{ request.username || 'Unclaimed' }}
        </p>
      </div>

      <!-- Status Badge -->
      <div
          :class="[
          'text-sm font-semibold px-3 py-1 rounded-full capitalize self-start',
          getStatusClass(request.status)
        ]"
      >
        {{ request.status.toLowerCase() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../utils/formatters';

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
});

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-status-pending text-white';
    case 'APPROVED':
      return 'bg-status-approved text-white';
    case 'REJECTED':
      return 'bg-status-rejected text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};
</script>

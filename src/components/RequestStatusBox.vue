<template>
  <div class="text-left pb-2 w-full space-y-1">
    <!-- ID at the top -->
    <p class="text-sm text-text1">
      <span class="font-semibold text-chat-other">ID:</span> {{ request.userRequestId }}
    </p>

    <!-- Created/Updated row -->
    <div class="flex justify-between text-sm text-text1-faded">
      <p><span class="font-semibold">Sent In:</span></p>
      <p>{{ formatDate(request.createdAt) }}</p>
    </div>
    <div class="flex justify-between text-sm text-textAltFaded">
      <p><span class="font-semibold">Last Updated:</span></p>
      <p>{{ formatDate(request.updatedAt) }}</p>
    </div>

    <!-- Status Badge -->
    <div
        :class="[
        'text-sm font-semibold px-2 py-1 rounded-full capitalize w-full text-center',
        getStatusClass(request.status)
      ]"
    >
      {{ request.status.toLowerCase() }}
    </div>

    <!-- Mushroom Basket Summary -->
    <div class="mt-4 space-y-2" v-if="request.basketSummaryBadges?.length">
      <BasketBadge
          v-for="(badge, index) in request.basketSummaryBadges"
          :key="index"
          :badge="badge"
      />

    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../utils/formatters';
import { useI18n } from 'vue-i18n';
import BasketBadge from "@/components/badges/BasketBadge.vue";

const { t } = useI18n();

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
});

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-status-pending text-status-pending-text border border-status-pending-border';
    case 'COMPLETED':
      return 'bg-status-completed text-status-completed-text border border-status-completed-border';
    case 'REJECTED':
      return 'bg-status-rejected text-status-rejected-text border border-status-rejected-border';
    case 'NEW':
      return 'bg-status-new text-status-new-text border border-status-new-border';
    case 'IN_REVIEW':
      return 'bg-status-in-review text-status-in-review-text border border-status-in-review-border';
    default:
      return 'bg-gray-400 text-white';
  }
};
</script>

<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1 px-1 bg-bg1 hover:bg-bg2 cursor-pointer transition rounded-md">
    <p class="col-span-5 break-all">{{ item.userRequestId }}</p>
    <p class="col-span-3">{{ formatRelativeTime(item.updatedAt, locale) }}</p>
    <div class="col-span-3">
      <RequestStatusBadge :status="item.status" />
    </div>
    <p class="col-span-1 text-center">{{ item.numberOfMushrooms }}</p>
  </div>

  <!-- Mobile layout -->
  <div class="sm:hidden bg-bg1 p-2 rounded-md shadow-sm text-sm text-text1 space-y-0.5">
    <p><span class="font-semibold">{{ $t('request.id') }}:</span> {{ item.userRequestId }}</p>
    <p><span class="font-semibold">{{ $t('request.lastUpdated') }}:</span> {{ formatRelativeTime(item.updatedAt, locale) }}</p>
    <p><span class="font-semibold">{{ $t('request.status') }}:</span> <RequestStatusBadge :status="item.status" /></p>
    <p><span class="font-semibold">{{ $t('request.mushrooms') }}:</span> {{ item.numberOfMushrooms }}</p>
  </div>
</template>

<script setup>
import RequestStatusBadge from "@/components/badges/RequestStatusBadge.vue";
import { formatRelativeTime } from '@/utils/formatters'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1 px-1 bg-bg1 hover:bg-bg2 cursor-pointer transition rounded-md items-center">
    <p class="col-span-2 break-all">{{ item.userRequestId }}</p>
    <p class="col-span-2">{{ formatRelativeTime(item.createdAt, locale) }}</p>
    <p class="col-span-2">{{ formatRelativeTime(item.updatedAt, locale) }}</p>
    <div class="col-span-1 flex items-center gap-1">
      <RequestStatusBadge :status="item.status" />
      <MessageCircleWarning
        v-if="item.hasFollowUp"
        class="w-4 h-4 text-danger shrink-0"
        :title="t('request.hasFollowUp')"
      />
    </div>
    <p class="col-span-1 text-center">{{ item.numberOfMushrooms }}</p>
    <div class="col-span-2">
      <MushroomDecisionBadge :mushroom-status-counts="item.mushroomStatusCounts" />
    </div>
    <div class="col-span-2 flex items-center gap-2">
      <p class="truncate">{{ item.username || t('request.unassigned') }}</p>
      <button
        v-if="isSuperuser && item.username"
        type="button"
        class="text-xs text-danger hover:underline shrink-0"
        @click.stop="$emit('release', item.userRequestId)"
      >
        {{ t('request.release') }}
      </button>
    </div>
  </div>

  <!-- Mobile layout -->
  <div class="sm:hidden bg-bg1 p-2 rounded-md shadow-sm text-sm text-text1 space-y-0.5">
    <p><span class="font-semibold">{{ $t('request.id') }}:</span> {{ item.userRequestId }}</p>
    <p><span class="font-semibold">{{ $t('request.submitted') }}:</span> {{ formatRelativeTime(item.createdAt, locale) }}</p>
    <p><span class="font-semibold">{{ $t('request.lastUpdated') }}:</span> {{ formatRelativeTime(item.updatedAt, locale) }}</p>
    <p class="flex items-center gap-1">
      <span class="font-semibold">{{ $t('request.status') }}:</span>
      <RequestStatusBadge :status="item.status" />
      <MessageCircleWarning
        v-if="item.hasFollowUp"
        class="w-4 h-4 text-danger shrink-0"
        :title="t('request.hasFollowUp')"
      />
    </p>
    <p><span class="font-semibold">{{ $t('request.mushrooms') }}:</span> {{ item.numberOfMushrooms }}</p>
    <p><span class="font-semibold">{{ $t('request.decision') }}:</span> <MushroomDecisionBadge :mushroom-status-counts="item.mushroomStatusCounts" /></p>
    <p class="flex items-center gap-2">
      <span class="font-semibold">{{ $t('request.owner') }}:</span>
      {{ item.username || t('request.unassigned') }}
      <button
        v-if="isSuperuser && item.username"
        type="button"
        class="text-xs text-danger hover:underline"
        @click.stop="$emit('release', item.userRequestId)"
      >
        {{ t('request.release') }}
      </button>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MessageCircleWarning } from 'lucide-vue-next'
import RequestStatusBadge from "@/components/badges/RequestStatusBadge.vue";
import MushroomDecisionBadge from "@/components/badges/MushroomDecisionBadge.vue";
import { formatRelativeTime } from '@/utils/formatters'
import { parseJwt } from '@/utils/jwt.js'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['release'])

const isSuperuser = computed(() => {
  const token = sessionStorage.getItem('jwt')
  return parseJwt(token)?.role === 'SUPERUSER'
})
</script>

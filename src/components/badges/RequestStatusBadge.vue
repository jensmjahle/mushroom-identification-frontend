<template>
  <div class="status-badge" :class="statusClass">
    <component :is="icon" class="w-4 h-4" />
    <span class="capitalize">{{ t(`statuses.${status.toLowerCase()}`) }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clock, Loader, CheckCircle2, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const { t } = useI18n()

const statusClass = computed(() => {
  switch (props.status) {
    case 'NEW':
      return 'bg-status-new text-status-new-meta border border-status-new-border'
    case 'PENDING':
      return 'bg-status-pending text-status-pending-meta border border-status-pending-border'
    case 'IN_PROGRESS':
      return 'bg-status-in-progress text-status-in-progress-meta border border-status-in-progress-border'
    case 'COMPLETED':
      return 'bg-status-completed text-status-completed-meta border border-status-completed-border'
    default:
      return 'bg-gray-400 text-white border border-gray-400'
  }
})

const icon = computed(() => {
  switch (props.status) {
    case 'NEW':
      return Sparkles
    case 'PENDING':
      return Clock
    case 'IN_PROGRESS':
      return Loader
    case 'COMPLETED':
      return CheckCircle2
    default:
      return Clock
  }
})
</script>

<style scoped>
.status-badge {
  @apply text-xs px-2 py-1 rounded-full w-fit flex items-center gap-1 shadow z-10;
}
</style>

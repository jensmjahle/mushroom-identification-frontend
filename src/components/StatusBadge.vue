<template>
  <div class="status-badge" :class="[bg, text, border]">
    <component :is="icon" class="w-4 h-4" />
    <span class="capitalize">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, Check, HelpCircle, AlertCircle, Circle } from 'lucide-vue-next'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusKey = computed(() =>
    props.status.toLowerCase().replace(/_/g, '-')
)

const label = computed(() =>
    props.status.toLowerCase().replace(/_/g, ' ')
)

const bg = computed(() => ({
  toxic: 'bg-mushroom-toxic',
  psilocybin: 'bg-mushroom-psilocybin',
  'non-psilocybin': 'bg-mushroom-non-psilocybin',
  unknown: 'bg-mushroom-unknown',
  unidentifiable: 'bg-mushroom-unidentifiable',
  'not-processed': 'bg-mushroom-not-processed'
}[statusKey.value] || 'bg-gray-300'))

const text = computed(() => ({
  toxic: 'text-mushroom-toxic-text',
  psilocybin: 'text-mushroom-psilocybin-text',
  'non-psilocybin': 'text-mushroom-non-psilocybin-text',
  unknown: 'text-mushroom-unknown-text',
  unidentifiable: 'text-mushroom-unidentifiable-text',
  'not-processed': 'text-mushroom-not-processed-text'
}[statusKey.value] || 'text-black'))

const border = computed(() => ({
  toxic: 'border-mushroom-toxic-border',
  psilocybin: 'border-mushroom-psilocybin-border',
  'non-psilocybin': 'border-mushroom-non-psilocybin-border',
  unknown: 'border-mushroom-unknown-border',
  unidentifiable: 'border-mushroom-unidentifiable-border',
  'not-processed': 'border-mushroom-not-processed-border'
}[statusKey.value] || 'border-gray-300'))

const icon = computed(() => {
  switch (props.status) {
    case 'TOXIC': return X
    case 'PSILOCYBIN': return HelpCircle
    case 'NON_PSILOCYBIN': return Check
    case 'UNKNOWN': return HelpCircle
    case 'UNIDENTIFIABLE': return AlertCircle
    case 'NOT_PROCESSED': return Circle
    default: return Circle
  }
})
</script>

<style scoped>
.status-badge {
  @apply text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow border z-10;
}
</style>

<template>
  <div class="text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow border z-10"
       :class="[bg, text, border]">
    <component :is="icon" class="w-4 h-4" />
    <span class="capitalize">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, Check, HelpCircle, AlertCircle, Circle } from 'lucide-vue-next'

const props = defineProps({
  status: String
})

const label = computed(() =>
    props.status?.toLowerCase().replace(/_/g, ' ')
)

const statusKey = computed(() =>
    props.status?.toLowerCase().replace(/_/g, '-')
)

const bg = computed(() => `bg-mushroom-${statusKey.value}`)
const text = computed(() => `text-mushroom-${statusKey.value}-text`)
const border = computed(() => `border-mushroom-${statusKey.value}-border`)

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

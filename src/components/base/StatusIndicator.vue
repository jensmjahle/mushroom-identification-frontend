<template>
  <div class="flex items-center space-x-4">
    <div
        class="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-semibold shadow border-2"
        :class="[bgClass, textClass, borderClass]"
    >
      {{ count }}
    </div>
    <h3 class="text-text4 capitalize">{{ label }}</h3>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: Number,
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

const bgClass = computed(() => ({
  new: 'bg-status-new',
  pending: 'bg-status-pending',
  completed: 'bg-status-completed'
}[statusKey.value] || 'bg-gray-300'))

const textClass = computed(() => ({
  new: 'text-status-new-text',
  pending: 'text-status-pending-text',
  completed: 'text-status-completed-text'
}[statusKey.value] || 'text-black'))

const borderClass = computed(() => ({
  new: 'border-status-new-border',
  pending: 'border-status-pending-border',
  completed: 'border-status-completed-border'
}[statusKey.value] || 'border-gray-300'))
</script>

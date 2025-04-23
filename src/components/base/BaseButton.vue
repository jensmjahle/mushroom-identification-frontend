<template>
  <button
      :type="type"
      :disabled="disabled || loading"
      :class="[
      baseClass,
      block ? 'w-full' : '',
    ]"
  >
    <span v-if="loading" class="animate-spin mr-2">
      <Loader class="w-4 h-4" />
    </span>
    <slot />
  </button>
</template>

<script setup>
import { Loader } from 'lucide-vue-next'
import {computed} from "vue";

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: {
    type: String, Number,
    default: '1', // Default variant
  },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
})

const baseClass = computed(() => {
  const variants = {
    '1': 'btn-1',
    '2': 'btn-2',
    '3': 'btn-3',
    '4': 'btn-4',
    'icon-1': 'btn-icon-1',
    'icon-2': 'btn-icon-2',
    'icon-3': 'btn-icon-3',
    'icon-4': 'btn-icon-4',
    'icon-transparent-1': 'btn-icon-transparent-1',
  }
  return variants[props.variant] ?? 'btn-1'
})
</script>

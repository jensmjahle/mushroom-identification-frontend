<template>
  <div :class="['flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full text-text1', roleClass]">
    <ShieldCheck class="w-4 h-4" />
    <span class="capitalize">{{ role.toLowerCase() }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
})

const roleClass = computed(() => {
  switch (props.role) {
    case 'SUPERUSER':
      return 'bg-role-superuser'
    case 'MODERATOR':
      return 'bg-role-moderator'
    default:
      return 'bg-gray-400'
  }
})
</script>

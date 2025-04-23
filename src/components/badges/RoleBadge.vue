<template>
  <div class="role-badge" :class="roleClass">
    <component :is="icon" class="w-4 h-4" />
    <span class="capitalize hidden sm:inline">{{ role.toLowerCase() }}</span>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { User, ShieldUser } from 'lucide-vue-next'

const props = defineProps({
  role: {
    type: String,
    required: true
  }
})

const roleClass = computed(() => {
  switch (props.role) {
    case 'SUPERUSER':
      return 'bg-role-superuser text-role-superuser-meta border border-role-superuser-border'
    case 'MODERATOR':
      return 'bg-role-moderator text-role-superuser-meta border border-role-moderator-border'
    default:
      return 'bg-gray-400 text-text1 border border-gray-400'
  }
})

const icon = computed(() => {
  switch (props.role) {
    case 'SUPERUSER':
      return ShieldUser
    case 'MODERATOR':
      return User
    default:
      return User
  }
})
</script>

<style scoped>
.role-badge {
  @apply text-xs p-0 sm:px-0.5 sm:py-0.5 md:px-1 md:py-0.5 lg:px-2 lg:py-1 rounded-full w-auto flex items-center gap-1 shadow z-10;
}
</style>

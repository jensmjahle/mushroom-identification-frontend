<template>
  <div class="role-badge" :class="roleClass">
    <component :is="icon" class="w-4 h-4" />
    <span class="capitalize">{{ t(`roles.${role.toLowerCase()}`) }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { User, ShieldUser } from 'lucide-vue-next'

const props = defineProps({
  role: {
    type: String,
    required: true
  }
})

const { t } = useI18n()

const roleClass = computed(() => {
  switch (props.role) {
    case 'SUPERUSER':
      return 'bg-role-superuser text-role-superuser-meta border border-role-superuser-border'
    case 'MODERATOR':
      return 'bg-role-moderator text-role-moderator-meta border border-role-moderator-border'
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
  @apply text-xs px-2 py-1 rounded-full w-fit flex items-center gap-1 shadow z-10;
}
</style>

<template>
  <div class="basket-badge" :class="badgeClass">
    <component :is="icon" class="w-4 h-4" />
    <span class="capitalize">{{ t(`basketBadge.${badge}`) }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  Info,
  Circle
} from 'lucide-vue-next'

const props = defineProps({
  badge: {
    type: String,
    required: true
  }
})

const { t } = useI18n()

const badgeClass = computed(() => {
  switch (props.badge) {
    case 'TOXIC_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_TOXIC':
      return 'bg-mushroom-toxic text-mushroom-toxic-text border border-mushroom-toxic-border'
    case 'PSYCHOACTIVE_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_PSILOCYBIN':
      return 'bg-mushroom-psilocybin text-mushroom-psilocybin-text border border-mushroom-psilocybin-border'
    case 'NON_PSILOCYBIN_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_NON_PSILOCYBIN':
      return 'bg-mushroom-non-psilocybin text-mushroom-non-psilocybin-text border border-mushroom-non-psilocybin-border'
    case 'UNKNOWN_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_UNKNOWN':
      return 'bg-mushroom-unknown text-mushroom-unknown-text border border-mushroom-unknown-border'
    case 'UNIDENTIFIABLE_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_UNIDENTIFIABLE':
      return 'bg-mushroom-unidentifiable text-mushroom-unidentifiable-text border border-mushroom-unidentifiable-border'
    case 'ALL_MUSHROOMS_PROCESSED':
      return 'bg-button3 text-button3-meta border border-button3-border'
    case 'NO_MUSHROOMS_PROCESSED':
      return 'bg-button2 text-button2-meta border border-button2-border'
    default:
      return 'bg-gray-300 text-black border border-gray-300'
  }
})

const icon = computed(() => {
  switch (props.badge) {
    case 'TOXIC_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_TOXIC':
      return AlertTriangle
    case 'PSYCHOACTIVE_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_PSILOCYBIN':
      return HelpCircle
    case 'NON_PSILOCYBIN_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_NON_PSILOCYBIN':
      return CheckCircle
    case 'UNKNOWN_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_UNKNOWN':
      return Info
    case 'UNIDENTIFIABLE_MUSHROOM_PRESENT':
    case 'ALL_MUSHROOMS_ARE_UNIDENTIFIABLE':
      return HelpCircle
    case 'ALL_MUSHROOMS_PROCESSED':
      return CheckCircle
    case 'NO_MUSHROOMS_PROCESSED':
      return Circle
    default:
      return Circle
  }
})
</script>

<style scoped>
.basket-badge {
  @apply text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow;
}
</style>

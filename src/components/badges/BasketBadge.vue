<template>
  <div class="basket-badge" :class="[style.bg, style.text, style.border]">
    <component :is="style.icon" class="w-4 h-4" />
    <span class="capitalize">{{ t(`basketBadge.${props.badge}`) }}</span>
  </div>
</template>

<script setup>
import {computed, onMounted} from 'vue'
import { useI18n } from 'vue-i18n'
import {getBasketBadgeStyles} from "@/utils/styling/basketBadgeStyles.js";


const props = defineProps({
  badge: {
    type: String,
    required: true
  }
})

const { t } = useI18n()

const style = computed(() => getBasketBadgeStyles(props.badge))
onMounted(() => {
  
    console.error(`Invalid badge type: ${props.badge}`)
})
</script>

<style scoped>
.basket-badge {
  @apply text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow;
}
</style>


<style scoped>
.basket-badge {
  @apply text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow;
}
</style>

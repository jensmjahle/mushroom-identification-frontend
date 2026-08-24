<template>
  <div v-if="info" class="decision-badge" :class="[bg, text, border]">
    <span>{{ summary }}</span>
  </div>
  <span v-else class="text-text1-faded">{{ t('request.mushroomDecisionNone') }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getMushroomDecisionInfo, formatMushroomDecisionSummary } from '@/utils/formatters.js'
import { getStatusStyles } from '@/utils/styling/mushroomStatusStyles.js'

const props = defineProps({
  mushroomStatusCounts: Object
})

const { t } = useI18n()

const info = computed(() => getMushroomDecisionInfo(props.mushroomStatusCounts))
const summary = computed(() => formatMushroomDecisionSummary(props.mushroomStatusCounts, t))
const styles = computed(() => info.value ? getStatusStyles(info.value.dominantStatus) : null)
const bg = computed(() => styles.value?.bg)
const text = computed(() => styles.value?.text)
const border = computed(() => styles.value?.border)
</script>

<style scoped>
.decision-badge {
  @apply text-xs px-2 py-1 rounded-full w-fit flex items-center gap-1 shadow border z-10;
}
</style>

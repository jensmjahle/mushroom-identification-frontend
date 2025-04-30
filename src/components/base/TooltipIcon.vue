<template>
  <div ref="iconRef" class="relative inline-block">
    <HelpCircle
        class="w-4 h-4 cursor-pointer"
        :class="iconColorClass"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        @click.stop="toggleTooltip"
    />

    <div
        v-if="showTooltip"
        class="absolute top-1/2 -translate-y-1/2 px-3 py-2 text-sm bg-bg3 text-text3 rounded shadow border border-border3 z-[9999] w-max max-w-xs"
        :class="tooltipPositionClass"
    >
      {{ t(`sideMenu.tooltips.${tooltipKey}`) }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { HelpCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  tooltipKey: { type: String, required: true },
  variant: { type: String, default: '1' },
  position: { type: String, default: 'right' }
})

const { t } = useI18n()
const showTooltip = ref(false)
const iconRef = ref(null)

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value
}

const iconColorClass = computed(() => {
  const map = {
    '1': 'text-button1',
    '2': 'text-button2',
    '3': 'text-button3',
    '4': 'text-button4'
  }
  return map[props.variant] || 'text-button1'
})

const tooltipPositionClass = computed(() => {
  return props.position === 'left'
      ? 'right-full mr-2'
      : 'left-full ml-2'
})

const handleClickOutside = (event) => {
  if (iconRef.value && !iconRef.value.contains(event.target)) {
    showTooltip.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

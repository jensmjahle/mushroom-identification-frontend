<template>
  <div ref="iconRef" class="relative inline-block">
    <HelpCircle
        class="w-4 h-4 cursor-pointer"
        :class="iconColorClass"
        @mouseenter="onHover"
        @mouseleave="onLeave"
        @click.stop="toggleTooltip"
    />

    <Teleport to="body">
      <div
          v-if="showTooltip"
          ref="tooltipRef"
          class="fixed px-3 py-2 text-sm bg-bg3 text-text3 rounded shadow border border-border3 z-[9999] w-max max-w-xs pointer-events-none"
          :style="tooltipStyles"
      >
        {{ t(`sideMenu.tooltips.${tooltipKey}`) }}
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { HelpCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  tooltipKey: { type: String, required: true },
  variant: { type: String, default: '1' },
  position: { type: String, default: 'auto' } // auto | left | right
})

const { t } = useI18n()

const showTooltip = ref(false)
const iconRef = ref(null)
const tooltipRef = ref(null)
const tooltipStyles = ref({})
const currentSide = ref('right')

const iconColorClass = computed(() => {
  const map = {
    '1': 'text-button1',
    '2': 'text-button2',
    '3': 'text-button3',
    '4': 'text-button4'
  }
  return map[props.variant] || 'text-button1'
})

const updateTooltipPosition = () => {
  if (!iconRef.value || !tooltipRef.value) return

  const rect = iconRef.value.getBoundingClientRect()
  const scrollY = window.scrollY
  const scrollX = window.scrollX
  const tooltipWidth = tooltipRef.value.offsetWidth

  const spaceRight = window.innerWidth - rect.right
  const spaceLeft = rect.left

  if (props.position === 'auto') {
    currentSide.value = (spaceRight < tooltipWidth + 16 && spaceLeft > tooltipWidth + 16) ? 'left' : 'right'
  } else {
    currentSide.value = props.position
  }

  tooltipStyles.value = {
    top: `${rect.top + rect.height / 2 + scrollY}px`,
    left: currentSide.value === 'left'
        ? `${rect.left + scrollX - tooltipWidth - 8}px`
        : `${rect.right + scrollX + 8}px`,
    transform: 'translateY(-50%)'
  }
}

const showAndPositionTooltip = async () => {
  showTooltip.value = true
  await nextTick()
  updateTooltipPosition()
}

const onHover = () => {
  showAndPositionTooltip()
}
const onLeave = () => {
  showTooltip.value = false
}
const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value
  if (showTooltip.value) nextTick(() => updateTooltipPosition())
}

const handleClickOutside = (event) => {
  if (
      iconRef.value &&
      !iconRef.value.contains(event.target) &&
      tooltipRef.value &&
      !tooltipRef.value.contains(event.target)
  ) {
    showTooltip.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', updateTooltipPosition, true)
  window.addEventListener('resize', updateTooltipPosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateTooltipPosition, true)
  window.removeEventListener('resize', updateTooltipPosition)
})
</script>

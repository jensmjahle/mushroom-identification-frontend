<template>
  <div class="relative w-full">
    <BaseButton
        :type="type"
        :variant="variant"
        :loading="loading"
        :disabled="disabled"
        :block="block"
        @click="toggleTooltip"
        ref="buttonRef"
    >
      <slot />
    </BaseButton>

    <div
        v-if="showTooltip"
        class="absolute top-1/2 left-full ml-2 -translate-y-1/2 z-50 px-3 py-2 text-sm bg-bg3 text-text3 rounded shadow border border-border3 w-max max-w-xs"
    >
      {{ t(`sideMenu.tooltips.${tooltipKey}`) }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  tooltipKey: { type: String, required: true },
  type: { type: String, default: 'button' },
  variant: { type: String, default: '1' },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean
})

const { t } = useI18n()
const showTooltip = ref(false)
const buttonRef = ref(null)

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value
}

const handleClickOutside = (event) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target)) {
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

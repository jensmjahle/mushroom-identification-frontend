<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-2xl font-semibold">{{ t('submit.reference') }}</h2>
    <p class="text-center max-w-md">{{ t('submit.referenceHint') }}</p>

    <!-- Referansekode + Kopier-knapp -->
    <div class="px-4 py-6 w-full rounded border-2 border-bg1 bg-bg2 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="font-mono text-lg break-words text-text1 text-center sm:text-left">
        {{ referenceCode }}
      </div>
      <BaseButton variant="2" size="sm" @click="copyToClipboard">
        {{ copied ? t('submit.copied') : t('submit.copy') }}
      </BaseButton>
    </div>

    <div class="flex gap-4">
      <BaseButton class="px-5 py-3 text-base" @click="$emit('next')">
        {{ t('submit.next') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'

const { t } = useI18n()
const props = defineProps({
  referenceCode: {
    type: String,
    required: true
  }
})
defineEmits(['next'])

const copied = ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(props.referenceCode)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

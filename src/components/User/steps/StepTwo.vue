<template>
  <div class="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto">
    <h2 class="text-2xl font-semibold text-text1">{{ t('submit.reference') }}</h2>
    <p class="text-text1-faded">{{ t('submit.referenceHint') }}</p>

    <div class="w-full border border-border1 rounded bg-bg2 py-8 px-4">
      <div class="text-xl font-mono text-button1">{{ referenceCode }}</div>
    </div>

    <BaseButton class="w-full max-w-xs mt-6" @click="$emit('next')">
      {{ t('submit.next') }}
    </BaseButton>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'

const { t } = useI18n()

defineProps({
  referenceCode: {
    type: String,
    required: true
  }
})

defineEmits(['next'])
</script>

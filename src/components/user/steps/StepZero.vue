<template>
    <div class="flex flex-col items-center justify-center gap-6 p-6 text-center bg-bg1 text-text1 rounded-2xl border border-border1 shadow-md max-w-2xl mx-auto">
      <h1 class="text-2xl font-semibold">
        {{ t('submit.introTitle') }}
      </h1>
      <p class="text-base text-text1-faded">
        {{ t('submit.introText') }}
      </p>
      <ul class="text-left text-text1-faded list-disc pl-6">
        <li>{{ t('submit.introBullet1') }}</li>
        <li>{{ t('submit.introBullet2') }}</li>
        <li>{{ t('submit.introBullet3') }}</li>
        <li>{{ t('submit.introBullet4') }}</li>
        <li>{{ t('submit.introBullet5') }}</li>
      </ul>
      <BaseButton @click="$emit('next')" class="mt-4">
        {{ t('submit.startButton') }}
      </BaseButton>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  import BaseButton from '@/components/base/BaseButton.vue'
  
  const { t } = useI18n()
  </script>
  
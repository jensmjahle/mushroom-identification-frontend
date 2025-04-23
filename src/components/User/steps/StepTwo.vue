<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-2xl font-semibold">{{ t('submit.reference') }}</h2>
    <p class="text-center max-w-md">{{ t('submit.referenceHint') }}</p>
    <div class="font-mono text-lg p-2 bg-gray-200 rounded">{{ userCode }}</div>
    <div class="flex gap-4">
      <button @click="$emit('back')" class="user-button bg-gray-400 hover:bg-gray-500">{{ t('submit.back') }}</button>
      <button @click="$emit('next')" class="user-button">{{ t('submit.next') }}</button>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineProps({ userCode: String });
defineEmits(['next', 'back']);
</script>
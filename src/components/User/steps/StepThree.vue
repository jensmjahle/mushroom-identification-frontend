<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-2xl font-semibold">{{ t('submit.thankYou') }}</h2>
    <p class="text-center max-w-md">{{ t('submit.thankYouHint') }}</p>
    <div class="flex gap-4">
      <router-link to="/user" class="user-button">{{ t('submit.toFront') }}</router-link>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineEmits(['back']);
</script>
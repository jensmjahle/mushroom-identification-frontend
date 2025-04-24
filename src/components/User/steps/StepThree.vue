<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-2xl font-semibold">{{ t('submit.thankYou') }}</h2>
    <p class="text-center max-w-md">{{ t('submit.thankYouHint') }}</p>
    <div class="flex gap-4">
      <BaseButton
        as="router-link"
        to="/user"
        class="px-5 py-3 text-base"
      >
        {{ t('submit.toFront') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import BaseButton from '@/components/base/BaseButton.vue';

const { t } = useI18n();
defineEmits(['back']);
</script>

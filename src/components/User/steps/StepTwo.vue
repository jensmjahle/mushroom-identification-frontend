<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-2xl font-semibold">{{ t('submit.reference') }}</h2>
    <p class="text-center max-w-md">{{ t('submit.referenceHint') }}</p>
    <div class="font-mono text-lg p-2 bg-gray-200 rounded">{{ userCode }}</div>
    <div class="flex gap-4">
      <BaseButton
        :variant="'4'"
        class="px-5 py-3 text-base"
        @click="$emit('back')"
      >
        {{ t('submit.back') }}
      </BaseButton>
      <BaseButton
        class="px-5 py-3 text-base"
        @click="$emit('next')"
      >
        {{ t('submit.next') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import BaseButton from '@/components/base/BaseButton.vue';

const { t } = useI18n();
defineProps({ userCode: String });
defineEmits(['next', 'back']);
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full p-6 text-center">
    <img src="/assets/logo.svg" class="w-48 mb-6" alt="Fleinsoppkontroll logo" />

    <p class="text-text1 text-md font-semibold mb-6 max-w-lg w-[60%]">
      {{ t('home.description') }}
    </p>
    <div class="flex flex-row gap-4">
      <RouterLink :to="{ name: 'new-request' }" class="flex-1">
      <BaseButton variant="1" class="w-[180px] h-[40px]">
        {{ t('home.sendRequest') }}
      </BaseButton>
      </RouterLink>

      <RouterLink :to="{ name: 'become-member' }" class="flex-1">
      <BaseButton variant="2" class="w-[180px] h-[40px]">
        {{ t('home.becomeMember') }}
      </BaseButton>
      </RouterLink>
    </div>

    <p class="text-text1 text-sm mt-6">
      {{ t('home.or') }}
      <RouterLink to="/support" class="underline text-text1 hover:text-text1">
        {{ t('home.getSupport') }}
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import BaseButton from '@/components/base/BaseButton.vue';

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full p-6 text-center">
    <img src="/assets/logo.svg" class="w-48 mb-6" alt="Fleinsoppkontroll logo" />

    <p class="text-text1 text-md font-semibold mb-6 max-w-lg w-[60%]">
      {{ t('home.description') }}
    </p>

    <div class="flex flex-row gap-4">
      <RouterLink class="user-button" :to="{ name: 'new-request' }">
        {{ t('home.sendRequest') }}
      </RouterLink>
      <RouterLink class="user-button bg-button2" :to="{ name: 'become-member' }">
        {{ t('home.becomeMember') }}
      </RouterLink>
    </div>

    <p class="text-text1 text-sm mt-6">
      {{ t('home.or') }} <RouterLink to="user/support" class="underline text-text1 hover:text-text1">
        {{ t('home.getSupport') }}
      </RouterLink>
    </p>
  </div>
</template>

  <script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { RouterLink } from 'vue-router';
  
  const { t } = useI18n();
  </script>
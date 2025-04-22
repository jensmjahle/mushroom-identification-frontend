<template>
    <div class="w-full h-full flex items-center justify-center">
      <div class="w-full max-w-3xl px-6 py-10 text-center flex flex-col items-center overflow-y-auto max-h-[90vh]">
        <h1 class="text-3xl font-bold text-text1 mb-4">{{ t('membership.title') }}</h1>
  
        <p class="text-base text-text1-faded mb-6 max-w-xl">
          {{ t('membership.intro') }}
        </p>
  
        <h2 class="text-xl font-semibold text-text1 mb-2">{{ t('membership.whyTitle') }}</h2>
        <div class="text-text1-faded mb-6 space-y-2 text-left max-w-xl w-full">
          <p v-html="t('membership.why1')" class="leading-relaxed" />
          <p v-html="t('membership.why2')" class="leading-relaxed" />
          <p v-html="t('membership.why3')" class="leading-relaxed" />
        </div>
  
        <h2 class="text-xl font-semibold text-text1 mb-2">{{ t('membership.typesTitle') }}</h2>
        <div class="text-text1-faded mb-6 space-y-2 text-left max-w-xl w-full">
          <p v-html="t('membership.type1')" class="leading-relaxed" />
          <p v-html="t('membership.type2')" class="leading-relaxed" />
        </div>
  
        <p class="text-text1 font-medium mb-10 max-w-xl">
          {{ t('membership.closing') }}
        </p>
  
        <RouterLink
          to="/membership"
          class="btn-1 px-6 py-3 text-lg font-medium rounded-lg shadow hover:bg-button1-hover transition duration-300"
        >
          {{ t('membership.cta') }}
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  import { RouterLink } from 'vue-router';
  
  const { t } = useI18n();
  </script>
  
<template>
    <div>
      <label class="block text-sm font-medium text-text1 mb-1">
        {{ $t('settings.language') }}
      </label>
      <select
        v-model="locale"
        @change="changeLanguage"
        class="w-full p-2 rounded border border-border2 bg-bg2 text-sm text-text2"
      >
        <option
          v-for="lang in availableLocales"
          :key="lang"
          :value="lang"
        >
          {{ $t(`settings.languages.${lang}`) }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  import { useLanguageStore } from '@/store/useLanguageStore';
  import { updateI18nLocale } from '@/locales/i18n';
  
  const { locale } = useI18n();
  const languageStore = useLanguageStore();
  const availableLocales = Object.keys(languageStore.messages);
  
  function changeLanguage() {
    languageStore.setLanguage(locale.value);
    updateI18nLocale();
  }
  </script>
  
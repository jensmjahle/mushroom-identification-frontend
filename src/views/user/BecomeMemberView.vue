<template>
  <div class="w-full h-full flex items-center justify-center px-4 py-6">
    <div
      class="w-full max-w-3xl flex flex-col items-center text-center px-4 py-6 sm:py-10 sm:px-8 rounded-lg overflow-hidden"
    >
      <div class="flex flex-col items-center gap-5 w-full max-w-xl">
        <!-- Title -->
        <h1 class="text-xl sm:text-2xl font-bold text-text1">
          {{ t('membership.title') }}
        </h1>

        <!-- Intro -->
        <p class="text-xs sm:text-sm text-text1-faded leading-snug">
          {{ t('membership.intro') }}
        </p>

        <!-- Why Join -->
        <div class="text-left w-full space-y-2">
          <h2 class="text-lg font-semibold text-text1">
            {{ t('membership.whyTitle') }}
          </h2>
          <p v-html="t('membership.why1')" class="text-text1-faded text-xs sm:text-sm leading-snug" />
          <p v-html="t('membership.why2')" class="text-text1-faded text-xs sm:text-sm leading-snug" />
          <p v-html="t('membership.why3')" class="text-text1-faded text-xs sm:text-sm leading-snug" />
        </div>

        <!-- Membership Types -->
        <div class="text-left w-full space-y-2">
          <h2 class="text-lg font-semibold text-text1">
            {{ t('membership.typesTitle') }}
          </h2>
          <p v-html="t('membership.type1')" class="text-text1-faded text-xs sm:text-sm leading-snug" />
          <p v-html="t('membership.type2')" class="text-text1-faded text-xs sm:text-sm leading-snug" />
        </div>

        <!-- Closing Text -->
        <p class="text-text1 text-xs sm:text-sm font-medium text-center">
          {{ t('membership.closing') }}
        </p>

        <!-- CTA Button (with font-bold) -->
        <a
          href="https://portal.smartorg.no/action/reg/7fd64a16"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-1 px-4 py-2 text-sm font-bold rounded shadow hover:bg-button1-hover transition duration-300"
        >
          {{ t('membership.cta') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

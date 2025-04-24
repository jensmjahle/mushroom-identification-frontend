<template>
  <div class="mt-6">
    <h3 class="text-lg font-semibold text-danger">
      {{ $t('settings.danger.title') }}
    </h3>
    <p class="text-sm text-text1 mb-2">
      {{ $t('settings.danger.description') }}
    </p>
    <BaseButton
        variant="2"
        @click="confirmDelete"
        class="bg-danger hover:bg-danger-hover text-text3 border border-danger-border"
    >
      {{ $t('settings.danger.button') }}
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const confirmDelete = () => {
  if (confirm(t('settings.danger.confirm'))) {
    // Call your account deletion logic here
  }
}
</script>

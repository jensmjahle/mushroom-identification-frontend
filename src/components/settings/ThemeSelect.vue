<template>
  <div>
    <p class="text-sm font-medium text-text1 mb-1">
      {{ $t('settings.theme') }}
    </p>
    <div class="flex gap-2">
      <BaseButton
      block
      :variant="theme === 'light' ? '1' : '4'"
      @click="updateTheme('light')"
      >
        {{ $t('settings.themes.light') }}
      </BaseButton>
      <BaseButton
      block
      :variant="theme === 'dark' ? '1' : '4'"
      @click="updateTheme('dark')"
      >
        {{ $t('settings.themes.dark') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import BaseButton from '@/components/base/BaseButton.vue'
  import { setTheme, detectInitialTheme } from '@/utils/themeUtils'

  const theme = ref('light')

  onMounted(() => {
    const stored = detectInitialTheme()
    theme.value = stored
    setTheme(stored)
  })

  function updateTheme(value) {
    theme.value = value
    setTheme(value)
  }
</script>

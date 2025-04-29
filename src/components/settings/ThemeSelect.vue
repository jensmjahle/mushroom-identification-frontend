<template>
  <div>
    <p class="text-sm font-medium text-text1 mb-1">
      {{ $t('settings.theme') }}
    </p>
    <div class="flex gap-2">
      <BaseButton
        block
        :variant="theme === 'light' ? '1' : '4'"
        @click="setTheme('light')"
      >
        {{ $t('settings.themes.light') }}
      </BaseButton>
      <BaseButton
        block
        :variant="theme === 'dark' ? '1' : '4'"
        @click="setTheme('dark')"
      >
        {{ $t('settings.themes.dark') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

const theme = ref('light')

function setTheme(value) {
  theme.value = value
  const themePath = `/themes/${value}.css`
  let link = document.getElementById('theme-style')
  if (!link) {
    link = document.createElement('link')
    link.id = 'theme-style'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  link.href = themePath
  localStorage.setItem('theme', value)
}

onMounted(() => {
  const stored = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  setTheme(stored)
})
</script>

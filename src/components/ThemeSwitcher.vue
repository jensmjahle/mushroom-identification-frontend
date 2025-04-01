<template>
  <div class="relative w-full">
    <select
        v-model="currentTheme"
        @change="applyTheme"
        class="w-full bg-bgAlt2 text-text px-4 py-2 rounded shadow"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ formatThemeName(theme) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentTheme = ref('light')


const themes = ['light', 'dark', 'highcontrast'] 

const formatThemeName = (theme) => {
  
  return theme.charAt(0).toUpperCase() + theme.slice(1)
}

const applyTheme = () => {
  const themePath = `/themes/${currentTheme.value}.css`

  let link = document.getElementById('theme-stylesheet')
  if (!link) {
    link = document.createElement('link')
    link.id = 'theme-stylesheet'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  link.href = themePath
  localStorage.setItem('theme', currentTheme.value)
}

onMounted(() => {
  currentTheme.value = localStorage.getItem('theme') || 'light'
  applyTheme()
})
</script>

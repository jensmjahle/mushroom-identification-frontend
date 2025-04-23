<template>
    <div>
      <p class="text-sm font-medium text-text1 mb-1">
        🌓 {{ $t('settings.theme') }}
      </p>
      <div class="flex gap-2">
        <button
          class="flex-1 p-2 rounded border text-sm"
          :class="theme === 'light' ? activeClass : inactiveClass"
          @click="setTheme('light')"
        >
          {{ $t('settings.themes.light') }}
        </button>
        <button
          class="flex-1 p-2 rounded border text-sm"
          :class="theme === 'dark' ? activeClass : inactiveClass"
          @click="setTheme('dark')"
        >
          {{ $t('settings.themes.dark') }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const theme = ref(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  
  function setTheme(value) {
    theme.value = value;
    const themePath = `/themes/${value}.css`;
    let link = document.getElementById('theme-style');
    if (!link) {
      link = document.createElement('link');
      link.id = 'theme-style';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = themePath;
    localStorage.setItem('theme', value);
  }
  
  watch(theme, setTheme);
  
  const activeClass = 'bg-button1 text-button1-meta border-button1-border';
  const inactiveClass = 'bg-bg2 text-text2 border-border2 hover:bg-button1 hover:text-button1-meta';
  </script>
  
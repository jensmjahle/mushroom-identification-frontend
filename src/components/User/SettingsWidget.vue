<template>
  <div class="fixed top-4 right-4 z-50" ref="settingsRef">
    <div class="relative w-max">
      <!-- Expandable Settings Menu -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="scale-0 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-0 opacity-0"
      >
        <div
          v-if="isOpen"
          class="absolute top-0 right-0 w-72 p-4 bg-bg1 border-2 border-border2 rounded-lg shadow-lg z-10 origin-top-right"
        >
          <div class="flex flex-col gap-4 mt-4">
            <!-- Language Dropdown -->
            <div>
              <label class="block text-sm font-medium text-text1 mb-1">
                🌍 {{ $t('settings.language') }}
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

            <!-- Theme Buttons -->
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
          </div>
        </div>
      </Transition>

      <!-- Gear Icon Button -->
      <button
        @click="toggleOpen"
        class="p-2 rounded-full transition-transform duration-300 z-20 relative"
        :class="{ 'rotate-180': isOpen }"
      >
        <Settings class="w-6 h-6 text-text1" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Settings } from 'lucide-vue-next';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useI18n } from 'vue-i18n';
import { updateI18nLocale } from '@/locales/i18n';

const isOpen = ref(false);
const settingsRef = ref(null);

const toggleOpen = () => (isOpen.value = !isOpen.value);

function handleClickOutside(event) {
  if (settingsRef.value && !settingsRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Theme logic
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

const activeClass = 'bg-button1 text-button1-meta border-button1-border';
const inactiveClass = 'bg-bg2 text-text2 border-border2 hover:bg-button1 hover:text-button1-meta';

// Language
const { locale } = useI18n();
const languageStore = useLanguageStore();
const availableLocales = Object.keys(languageStore.messages);

function changeLanguage() {
  languageStore.setLanguage(locale.value);
  updateI18nLocale();
}
</script>

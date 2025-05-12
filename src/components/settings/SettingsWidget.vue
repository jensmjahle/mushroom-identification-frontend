<template>
  <div class="hidden fixed top-0 right-0 z-50 p-6 sm:block" ref="settingsRef">
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
            <LanguageSelect />
            <ThemeSelect />
            <ClearSession />
          </div>
        </div>
      </Transition>

      <!-- Gear Icon Button -->
      <button
        id="settings-button"
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
import LanguageSelect from '@/components/settings/LanguageSelect.vue';
import ThemeSelect from '@/components/settings/ThemeSelect.vue';
import ClearSession from '@/components/settings/ClearSession.vue'


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
</script>

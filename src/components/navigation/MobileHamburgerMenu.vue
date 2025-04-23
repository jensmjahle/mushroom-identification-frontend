<template>
  <div class="sm:hidden fixed top-4 right-4 z-50">
    <button ref="toggleRef" @click="menuOpen = !menuOpen" class="btn-icon-4">
      <Menu v-if="!menuOpen" />
      <X v-else />
    </button>

    <Transition name="slide">
      <div
          v-if="menuOpen"
          ref="menuRef"
          class="fixed top-0 right-0 w-64 h-full bg-bg4 text-text4 shadow-lg z-40 p-4 overflow-y-auto"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const menuOpen = ref(false)
const menuRef = ref(null)
const toggleRef = ref(null)

const handleClickOutside = (e) => {
  if (!menuRef.value?.contains(e.target) && !toggleRef.value?.contains(e.target)) {
    menuOpen.value = false
  }
}

watch(menuOpen, (open) => {
  if (open) {
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
:deep(.slide-enter-active),
:deep(.slide-leave-active) {
  transition: transform 0.3s ease;
}
:deep(.slide-enter-from) {
  transform: translateX(100%);
}
:deep(.slide-enter-to),
:deep(.slide-leave-from) {
  transform: translateX(0%);
}
:deep(.slide-leave-to) {
  transform: translateX(100%);
}
</style>

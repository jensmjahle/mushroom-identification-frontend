<template>
    <div :class="['user-display-card', collapsed ? 'collapsed' : '']">
      <button
        @click="$emit('toggle-sidebar')"
        class="collapse-button"
      >
        <img
          src="/assets/arrow.svg"
          alt="Toggle sidebar"
          class="w-5 h-5 transition-transform duration-300 light:invert"
          :class="{ 'rotate-180': collapsed }"

        />
      </button>
      
      <router-view />
    </div>
  </template>
  
<script setup>
    defineProps({ collapsed: Boolean });
    defineEmits(['toggle-sidebar']);
</script>
  
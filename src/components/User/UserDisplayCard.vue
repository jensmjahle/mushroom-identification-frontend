<template>
    <div :class="['user-display-card', collapsed ? 'collapsed' : '']">
      <button
        @click="$emit('toggle-sidebar')"
        class="absolute top-4 left-0 p-2 bg-bg1 rounded-none rounded-tr-lg rounded-br-lg transition focus:outline-none focus:ring-0 hover:border-bg1"
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
  
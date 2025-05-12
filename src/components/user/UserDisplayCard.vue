<template>
    <div :class="['user-display-card', collapsed ? 'collapsed' : '']">
      <button
        @click="$emit('toggle-sidebar')"
        class="collapse-button"
      >
        <component :is="collapsed ? ChevronRight : ChevronLeft" class="w-[40px] h-[40px]" />
      </button>
      
      <router-view />
    </div>
  </template>
  
<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
    defineProps({ collapsed: Boolean });
    defineEmits(['toggle-sidebar']);
</script>
  
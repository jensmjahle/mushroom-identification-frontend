<template>
    <div class="relative flex justify-between w-[60%] items-center gap-4 mb-6">
      <div class="absolute top-1/2 w-full h-0.5 bg-black z-0 transform -translate-y-1/2"></div>
      <div
        v-for="n in 3"
        :key="n"
        class="w-8 h-8 flex items-center justify-center rounded-md border text-center text-sm font-medium border-bg3 z-10"
        :class="step === n ? 'bg-button1 text-text1' : 'bg-bg2 text-text2'"
      >
        {{ n }}
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ step: Number });
  </script>
<template>
    <div class="flex flex-col items-center gap-4">
      <h2 class="text-2xl font-semibold">Referansekode</h2>
      <p class="text-center max-w-md">Bruk denne koden for å finne igjen forespørselen din senere:</p>
      <div class="font-mono text-lg p-2 bg-gray-200 rounded">{{ userCode }}</div>
      <div class="flex gap-4">
        <button @click="$emit('back')" class="user-button bg-gray-400 hover:bg-gray-500">Tilbake</button>
        <button @click="$emit('next')" class="user-button">Neste</button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ userCode: String });
  defineEmits(['next', 'back']);
  </script>
  
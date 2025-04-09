<template>
    <div class="flex flex-col items-center gap-4">
      <h2 class="text-2xl font-semibold">Takk!</h2>
      <p class="text-center max-w-md">Du vil få svar så snart en ekspert har vurdert bildet ditt.</p>
      <div class="flex gap-4">
        <button @click="$emit('back')" class="user-button bg-gray-400 hover:bg-gray-500">Tilbake</button>
        <router-link to="/user" class="user-button">Til forsiden</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  defineEmits(['back']);
  </script>
  
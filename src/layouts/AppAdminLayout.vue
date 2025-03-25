<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <main class="flex-grow pt-[72px] px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>

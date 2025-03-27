<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <div class="flex flex-1 pt-[72px]">
      <main class="flex-grow px-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>

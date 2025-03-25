<script setup>
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />
  </div>
</template>


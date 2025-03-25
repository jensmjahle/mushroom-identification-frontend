<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <div class="flex flex-1 pt-[72px]">
      <SideMenu />
      <main class="flex-grow px-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import SideMenu from "../components/SideMenu.vue";
</script>

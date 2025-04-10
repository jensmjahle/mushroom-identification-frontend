<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex flex-1">
      <SideMenu />
      <main class="flex w-full pt-[72px]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import SideMenu from "../components/SideMenu.vue";
</script>

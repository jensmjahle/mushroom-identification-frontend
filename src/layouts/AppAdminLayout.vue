<template>
  <div class="flex flex-col min-h-screen">
    <MobileHamburgerMenu>
      <AdminSideMenuContent />
    </MobileHamburgerMenu>
    
    <div class="flex flex-1">
      <SideMenu />
      <main class="flex w-full pt-[72px]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/navigation/NavBar.vue';
import SideMenu from "../components/navigation/AdminSideMenu.vue";
import MobileAdminHamburgerMenu from "@/components/navigation/MobileAdminHamburgerMenu.vue";
import MobileHamburgerMenu from "@/components/navigation/MobileHamburgerMenu.vue";
import AdminSideMenuContent from "@/components/navigation/AdminSideMenuContent.vue";
</script>

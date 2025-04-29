<template>
  <div class="flex flex-col min-h-screen">
    <MobileHamburgerMenu>
      <AdminSideMenuContent />
    </MobileHamburgerMenu>
    <NavBar />
    <div class="flex flex-1">
      <SideMenu />
      <main class="flex w-full pt-[72px] justify-center items-center">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SideMenu from "../components/navigation/AdminSideMenu.vue";
import MobileHamburgerMenu from "@/components/navigation/MobileHamburgerMenu.vue";
import AdminSideMenuContent from "@/components/navigation/AdminSideMenuContent.vue";
import NavBar from "@/components/navigation/NavBar.vue";
</script>

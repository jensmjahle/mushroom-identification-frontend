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

import {onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import {disconnectGlobalSocket, initGlobalSocket} from '@/services/globalSocket';

const router = useRouter();

onMounted(() => {
  const token = sessionStorage.getItem('jwt');
  if (!token) return;

  initGlobalSocket(
      token,

      (error) => {
        console.warn('Received WebSocket error for admin:', error);
        if (error.type === 'UNAUTHORIZED') {
          sessionStorage.removeItem('jwt');
          router.push({ name: 'admin-login' });
        }
      },

      (broadcast) => {
        console.log('Admin broadcast:', broadcast);
      },

      (notif) => {
        console.log('Notification received:', notif);
      }
  );
});


onUnmounted(() => {
  disconnectGlobalSocket();
});
</script>


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
import {useToast} from "vue-toastification";

const router = useRouter();
const toast = useToast();
const showToast = (message) => {
  toast.info(message, {
    timeout: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
onMounted(() => {
  const token = sessionStorage.getItem('jwt');
  if (!token) return;

  initGlobalSocket(
      token,
      (error) => {
        console.warn('Received WebSocket error for admin:', error);
        showToast(`${error}`);
      },
      (broadcast) => {
        console.log('Admin broadcast:', broadcast);
        showToast(`${broadcast.message}`);
      }
  );
});

onUnmounted(() => {
  disconnectGlobalSocket();
});
</script>


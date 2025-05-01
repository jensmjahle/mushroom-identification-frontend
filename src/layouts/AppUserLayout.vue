<template>
  <div class="user-layout">
    <SettingsWidget />
    <MobileHamburgerMenu>
      <UserSideMenuContent />
    </MobileHamburgerMenu>
    <div class="user-layout-inner">
      <UserSidebar :collapsed="collapsed" />
      <UserDisplayCard @toggle-sidebar="collapsed = !collapsed" :collapsed="collapsed"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import UserSidebar from '../components/User/UserSidebar.vue';
import UserDisplayCard from '../components/User/UserDisplayCard.vue';
import SettingsWidget from '../components/User/SettingsWidget.vue';
import MobileHamburgerMenu from '../components/navigation/MobileHamburgerMenu.vue';
import UserSideMenuContent from '../components/navigation/UserSideMenuContent.vue';

const collapsed = ref(false);

const handleResize = () => {
  collapsed.value = window.innerWidth < 1000;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

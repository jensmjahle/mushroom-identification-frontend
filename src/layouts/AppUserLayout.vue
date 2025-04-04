<template>
  <div class="user-layout">
    <div class="user-layout-inner">
      <UserSidebar :collapsed="collapsed" />
      <UserDisplayCard @toggle-sidebar="collapsed = !collapsed" :collapsed="collapsed"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserSidebar from '../components/User/UserSidebar.vue';
import UserDisplayCard from '../components/User/UserDisplayCard.vue';

const collapsed = ref(false);
</script>

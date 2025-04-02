<template>
  <div class="user-layout">
    <div class="user-layout-inner">
      <UserSidebar />
      <UserDisplayCard/>
    </div>
  </div>
</template>

<script setup>
  import UserSidebar from '../components/User/UserSidebar.vue';
  import UserDisplayCard from '../components/User/UserDisplayCard.vue';
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 text-text1 bg-bg1 gap-2 sm:gap-4">
    <p class="text-lg font-semibold">{{ username }}</p>
    <RoleBadge :role="role" />
  </div>
</template>

<script setup>
import { parseJwt } from "@/utils/jwt.js";
import RoleBadge from "@/components/badges/RoleBadge.vue";

const token = sessionStorage.getItem('jwt');
const parsedToken = parseJwt(token);
const username = parsedToken?.sub || 'Unknown';
const role = parsedToken?.role || 'User';
</script>


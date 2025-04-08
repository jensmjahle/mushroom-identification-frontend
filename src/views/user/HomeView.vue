<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full bg-gray-100 p-6 text-center">
    <img src="/assets/logo.svg" class="w-48 mb-6" alt="Fleinsoppkontroll logo" />

    <p class="text-black text-md font-semibold mb-6 max-w-lg w-[60%]">
      Usikker på om du har plukket fleinsopp? Send inn en gratis anonym forespørsel her:
    </p>

    <RouterLink class="user-button bg-[#F28F3B] hover:bg-[#2F3C2C] hover:text-white" :to="{ name: 'new-request' }">
        Send forespørsel
    </RouterLink>


    <p class="text-black text-sm mt-6">
      Eller <RouterLink to="/support" class="underline text-[#F28F3B] hover:text-[#2F3C2C]">sjekk ut vår FAQ</RouterLink>
    </p>
  </div>
</template>

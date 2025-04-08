<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full p-6 text-center">
    <img src="/assets/logo.svg" class="w-48 mb-6" alt="Fleinsoppkontroll logo" />

    <p class="text-text1 text-md font-semibold mb-6 max-w-lg w-[60%]">
      Usikker på om du har plukket fleinsopp? Send inn en gratis anonym forespørsel her:
    </p>

    <RouterLink class="user-button" :to="{ name: 'new-request' }">
        Send forespørsel
    </RouterLink>


    <p class="text-text1 text-sm mt-6">
      Eller <RouterLink to="user/support" class="underline text-text1 hover:text-text1">få hjelp fra vår support</RouterLink>
    </p>
  </div>
</template>

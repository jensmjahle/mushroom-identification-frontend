<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full bg-bg1 p-6 text-center">
    <img src="/assets/logo.svg" class="w-48 mb-6" alt="Fleinsoppkontroll logo" />

    <p class="text-black text-md font-semibold mb-6 max-w-lg w-[60%]">
      Usikker på om du har plukket fleinsopp? Send inn en gratis anonym forespørsel her:
    </p>

    <RouterLink class="user-button bg-button3 hover:bg-button3-hover hover:text-white" :to="{ name: 'new-request' }">
        Send forespørsel
    </RouterLink>


    <p class="text-black text-sm mt-6">
      Eller <RouterLink to="user/support" class="underline text-button3] hover:text-button3-hover">få hjelp fra vår support</RouterLink>
    </p>
  </div>
</template>

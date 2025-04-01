<template>
 
  <div class="main-user-view">
    <ChatBox :userRequestId="userRequestId" />
    <MushroomBasket></MushroomBasket>
  </div>
</template>

<script setup>
import ChatBox from '../../components/ChatBox.vue';
import { useRoute } from 'vue-router';
import MushroomBasket from "@/components/MushroomBasket.vue";

const route = useRoute();
const userRequestId = route.params.userRequestId;
</script>

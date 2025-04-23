<template>
  <div class=" main-view flex-row flex">
  <div class="mr-2 min-w-[50%]">
    <RequestStatusBox v-if="userRequest" :request="userRequest" />
    <ChatBox v-if="userRequestId" :userRequestId="userRequestId" />
  </div>
    <MushroomBasket v-if="userRequestId" :user-request-id="userRequestId" />
  </div>
</template>

<script setup>
import ChatBox from '../../components/ChatBox.vue';

import { useRoute } from 'vue-router';
import RequestStatusBox from "../../components/RequestStatusBox.vue";
import {onMounted, ref} from "vue";
import MushroomBasket from "../../components/MushroomBasket.vue";
import {getUserRequestAdmin} from "@/services/adminRequestService.js";

const route = useRoute();
const userRequestId = route.params.userRequestId;
const userRequest = ref(null);

onMounted(() => {
  console.log('User Request ID:', userRequestId);
  getUserRequestAdmin(userRequestId).then((data) => {
    userRequest.value = data;
  });
})
</script>

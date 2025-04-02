<template>
 
  <div class="main-user-view relative">
    <div class="vertical-box">
      <RequestStatusBox v-if="userRequest" :request="userRequest" />
      <ChatBox :userRequestId="userRequestId" />
    </div>
    <MushroomBasket></MushroomBasket>
  </div>
</template>

<script setup>
import ChatBox from '../../components/ChatBox.vue';
import { useRoute } from 'vue-router';
import MushroomBasket from "@/components/MushroomBasket.vue";
import RequestStatusBox from "@/components/RequestStatusBox.vue";
import {onMounted, ref} from "vue";
import {getUserRequest} from "@/services/apiService.js";

const route = useRoute();
const userRequestId = route.params.userRequestId;
const userRequest = ref(null);
const token = sessionStorage.getItem('jwt');

onMounted(() => {
  console.log('User Request ID:', userRequestId);
  getUserRequest(userRequestId, token).then((data) => {
    userRequest.value = data;
  });
})
</script>

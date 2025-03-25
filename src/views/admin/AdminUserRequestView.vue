<template>
  <div>
    <RequestStatusBox v-if="userRequest" :request="userRequest" />
    <ChatBox v-if="userRequestId" :userRequestId="userRequestId" />
  </div>
</template>

<script setup>
import ChatBox from '../../components/ChatBox.vue';

import { useRoute } from 'vue-router';
import RequestStatusBox from "../../components/RequestStatusBox.vue";
import {onMounted, ref} from "vue";
import {getUserRequestAdmin} from "../../services/apiService.js";

const route = useRoute();
const userRequestId = route.params.userRequestId;
const userRequest = ref(null);
const token = sessionStorage.getItem('jwt');

onMounted(() => {
  console.log('User Request ID:', userRequestId);
  getUserRequestAdmin(userRequestId, token).then((data) => {
    userRequest.value = data;
  });
})
</script>

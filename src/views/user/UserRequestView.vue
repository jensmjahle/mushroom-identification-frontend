<template>
 
  <div>
    <ChatBox :userRequestId="userRequestId" />
  </div>
</template>

<script setup>
import ChatBox from '../../components/ChatBox.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userRequestId = route.params.referenceCode;
</script>

<template>
  <div class="w-1/6 bg-bg text-textAlt ml-2 rounded-lg">
    <ul class="p-4 space-y-2 w-fill">
      <button class="block w-full text-left px-4 py-2 hover:bg-button-hover bg-button">Next from Que</button>
      <button class="block w-full text-left px-4 py-2 hover:bg-button2-hover bg-button2">Put Back into Que</button>
      <button class="block w-full text-left px-4 py-2 hover:bg-button2-hover bg-button2">Close Request</button>
      <button class="block w-full text-left px-4 py-2 hover:bg-gray-100">Statistics</button>
      <button @click="allRequests" class="block w-full text-left px-4 py-2 hover:bg-gray-100">All Requests</button>
      <button class="block w-full text-left px-4 py-2 hover:bg-gray-100">All Admins</button>
      <button class="block w-full text-left px-4 py-2 hover:bg-gray-100">Create new Moderator</button>
      
    </ul>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const allRequests = () => {
  router.push({ name: 'admin-all-requests' });
};
</script>
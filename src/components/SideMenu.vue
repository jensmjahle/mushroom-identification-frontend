<template>
  <div class="hidden sm:block w-1/6 bg-bg4 text-text4 roundedr-lg">
    <LogoButton></LogoButton>
    <div class="text-right m-4">
      <h2 class="text-xl font-semibold text-text4">
        {{$t('sideMenu.completedTitle')}}
      </h2>
      <div class="text-5xl font-bold text-text4">
        {{ completedCount }}
      </div>
    </div>
    <ul class="p-4 space-y-2 w-fill">
      <BaseButton v-if="route.name !== 'admin-request'" @click="nextFromQueue" block :variant="2">{{$t('sideMenu.nextFromQueue')}}</BaseButton>
      <BaseButton v-if="route.name !== 'admin-request'" @click="allRequests" block :variant="4">{{$t('sideMenu.allRequests')}}</BaseButton>
      <BaseButton v-if="route.name !== 'admin-request'" @click="statistics" block :variant="4">{{$t('sideMenu.statistics')}}</BaseButton>
      
      <BaseButton v-if="route.name === 'admin-request'" @click="completeRequest" block :variant="2">{{$t('sideMenu.completeRequest')}}</BaseButton>
      <BaseButton v-if="route.name === 'admin-request'" @click="putBackIntoQueue" block :variant="4">{{$t('sideMenu.putBackIntoQueue')}}</BaseButton>
      <BaseButton v-if="route.name === 'admin-request'" @click="placeOnHold" block :variant="4">{{$t('sideMenu.placeOnHold')}}</BaseButton>
    </ul>
    
    <ul class="p-4 space-y-2 w-full">
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 rounded-full bg-status-new text-white flex items-center justify-center text-2xl font-semibold shadow">
          {{ newCount }}
        </div>
        <h3 class="text-text4">New</h3>
      </div>
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 rounded-full bg-status-pending text-white flex items-center justify-center text-2xl font-semibold shadow">
          {{ pendingCount }}
        </div>
        <h3 class="text-text4">Pending</h3>
      </div>
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 rounded-full bg-status-completed text-white flex items-center justify-center text-2xl font-semibold shadow">
          {{ completedCount }}
        </div>
        <h3 class="text-text4">Completed</h3>
      </div>
    </ul>

    <ul class="p-4 space-y-2 w-fill text-left" v-if="route.name !== 'admin-request'">
      <h2 class="px-4 font-medium">Mushroom Admins</h2>
      <button class="block w-full text-text text-left px-4 py-2 hover:bg-button-hover bg-button">All Admins</button>
      <button class="block w-full text-text text-left px-4 py-2 hover:bg-button2-hover bg-button2">Moderator Statistics</button>
      <button class="block w-full text-text text-left px-4 py-2 hover:bg-button2-hover bg-button2">Create new Moderator</button>
    </ul>
  </div>
</template>
<script setup>
import {useRoute, useRouter} from 'vue-router';
import {getCountOfRequestFromStatus} from "../services/apiService.js";
import {onMounted, ref} from "vue";
import LogoButton from "@/components/LogoButton.vue";
import BaseButton from "@/components/base/BaseButton.vue";
const router = useRouter();
const route = useRoute();

const token = sessionStorage.getItem('jwt');
const newCount = ref(null)
const pendingCount = ref(null)
const inProgressCount = ref(null)
const completedCount = ref(null)

onMounted(async () => {
  try {
    newCount.value = await getCountOfRequestFromStatus("NEW", token);
    pendingCount.value = await getCountOfRequestFromStatus("PENDING", token)
    inProgressCount.value = await getCountOfRequestFromStatus("IN_PROGRESS", token)
    completedCount.value = await getCountOfRequestFromStatus("COMPLETED", token)
  } catch (error) {
    console.error("Failed to fetch counts:", error);
    newCount.value = '?';
  }
});


const allRequests = () => {
  router.push({ name: 'admin-all-requests' });
};




</script>
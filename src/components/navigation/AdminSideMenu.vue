<template>
  <div class="hidden sm:block w-1/6 bg-bg4 text-text4 rounded-br-lg">
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
      <StatusIndicator label="New" :count="newCount" status="NEW" />
      <StatusIndicator label="Pending" :count="pendingCount" status="PENDING" />
      <StatusIndicator label="Completed" :count="completedCount" status="COMPLETED" />
    </ul>

    <div class="p-4 space-y-2 w-fill" v-if="route.name !== 'admin-request'">
      <h3 class="text-left text-text4">{{$t('sideMenu.admins')}}</h3>
      <BaseButton @click="allAdmins" block :variant="2">{{$t('sideMenu.allAdmins')}}</BaseButton>
      <BaseButton @click="createNewAdmin" block :variant="4">{{$t('sideMenu.createNewAdmin')}}</BaseButton>
    </div>
  </div>
</template>
<script setup>
import {useRoute, useRouter} from 'vue-router';
import {getCountOfRequestFromStatus} from "../../services/apiService.js";
import {onMounted, ref} from "vue";
import LogoButton from "@/components/LogoButton.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import StatusIndicator from "@/components/base/StatusIndicator.vue";
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
const statistics = () => {
  router.push({ name: 'admin-statistics' });
};




</script>
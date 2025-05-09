<template>
  <div class="relative w-full h-full flex justify-center items-center p-4 px-14 overflow-hidden">

    <!-- Blur overlay (only when basket open on mobile) -->
    <div
      v-if="isBasketOpen && isMobile"
      class="fixed inset-0 z-[10] bg-black/20 backdrop-blur-md transition-opacity duration-300"
      @click="isBasketOpen = false"
    ></div>

    <div class="flex w-full h-full relative">
      
      <!-- Main content -->
      <div
        :class="[
          'flex flex-col justify-start items-center transition-all duration-300 ease-in-out',
          isBasketOpen ? 'sm:w-[calc(100%-300px)] sm:mr-6 w-full' : 'w-full'
        ]"
      >
        <div :class="['max-w-3xl flex flex-col overflow-y-auto max-h-[85vh] p-2', isMobile ? 'w-[100vw]' : 'w-full']">
            <RequestStatusBox 
            v-if="userRequest" 
            :request="userRequest" 
            :class="['mb-2', isMobile ? 'top-0 left-0 w-[80vw]' : '']"
            />
          <ChatBox :userRequestId="userRequestId" />
        </div>
      </div>

      <!-- Mushroom Basket -->
      <MushroomBasket
        class="top-4 sm:-top-0 -right-1 sm:-right-16 mt-12 h-[80%] sm:mt-0 sm:h-full"
        :userRequestId="userRequestId"
        @basket-toggle="isBasketOpen = $event"
        @updated="reloadUserRequest"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch} from 'vue';
import { useRoute } from 'vue-router';
import RequestStatusBox from '@/components/RequestStatusBox.vue';
import ChatBox from '@/components/ChatBox.vue';
import MushroomBasket from '@/components/MushroomBasket.vue';
import { getUserRequest } from '@/services/rest/userRequestService.js';
import {useRequestSocketStore} from "@/store/useRequestSocketStore.js";

const route = useRoute();
const userRequestId = route.params.userRequestId;
const userRequest = ref(null);
const isBasketOpen = ref(false);
const isMobile = ref(false);
const socketStore = useRequestSocketStore();

onMounted(() => {
  getUserRequest(userRequestId).then((data) => {
    userRequest.value = data;
  });

  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});

function checkMobile() {
  isMobile.value = window.innerWidth < 640;
}
function reloadUserRequest() {
  getUserRequest(userRequestId).then((data) => {
    userRequest.value = data;
  });
}

watch(() => socketStore.lastNotification, (notif) => {
  if (!notif) return;
  const type = notif.split('-')[0];
  if (['MUSHROOM_BASKET_UPDATED', 'STATUS_CHANGED'].includes(type)) {
    console.log('[AdminView] Triggering reload due to:', type);
    reloadUserRequest();
  }
});

</script>

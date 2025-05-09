<template>
  <div class="relative w-full h-full flex justify-center items-center p-4 pl-14 pr-14 overflow-hidden">

    <!-- Blur overlay (only if basket open, and mobile) -->
    <div
      v-if="isBasketOpen && isMobile"
      class="fixed inset-0 z-20 bg-black/20 backdrop-blur-md transition-opacity duration-300"
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
        <div class="w-full max-w-3xl flex flex-col overflow-y-auto max-h-[85vh] p-2">
          <RequestStatusBox v-if="userRequest" :request="userRequest" />
          <ChatBox v-if="userRequestId" :userRequestId="userRequestId" />
        </div>
      </div>

      <!-- Mushroom Basket -->
      <MushroomBasket
        v-if="userRequestId"
        class="top-4 sm:-top-0 -right-1 sm:-right-14 mt-12 sm:mt-0 sm:h-full pb-6"
        :userRequestId="userRequestId"
        @basket-toggle="isBasketOpen = $event"
        @updated="reloadUserRequest"
      />
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRoute} from 'vue-router';
import ChatBox from '../../components/ChatBox.vue';
import RequestStatusBox from "../../components/RequestStatusBox.vue";
import MushroomBasket from "../../components/MushroomBasket.vue";
import {getUserRequestAdmin} from "@/services/rest/adminRequestService.js";
import {useMushroomStore} from "@/store/useMushroomStore.js";
import {useRequestSocketStore} from "@/store/useRequestSocketStore.js";
import {useI18n} from "vue-i18n";

const route = useRoute();
const userRequestId = route.params.userRequestId;
const userRequest = ref(null);
const isBasketOpen = ref(false); 
const isMobile = ref(false);
const mushroomStore = useMushroomStore()
const token = sessionStorage.getItem('jwt')
const { t } = useI18n()
const { connect, disconnect } = useRequestSocketStore()
const socketStore = useRequestSocketStore()


onMounted(() => {
  getUserRequestAdmin(userRequestId).then((data) => {
    userRequest.value = data;
  });

  checkMobile();
  window.addEventListener('resize', checkMobile);

  connect(userRequestId, token, t, null )
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
  disconnect();
});

function checkMobile() {
  isMobile.value = window.innerWidth < 640;
}

function reloadUserRequest() {
  getUserRequestAdmin(userRequestId).then((data) => {
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
watch(() => mushroomStore.mushrooms, () => {
  reloadUserRequest()
}, { deep: true })
</script>

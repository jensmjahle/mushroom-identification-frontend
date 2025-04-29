<template>
  <div class="relative w-full h-full flex justify-center items-center p-4 pl-14 pr-14 overflow-hidden">
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
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import ChatBox from '../../components/ChatBox.vue';
import RequestStatusBox from "../../components/RequestStatusBox.vue";
import MushroomBasket from "../../components/MushroomBasket.vue";
import { getUserRequestAdmin } from "@/services/adminRequestService.js";

const route = useRoute();
const userRequestId = route.params.userRequestId;
const userRequest = ref(null);
const isBasketOpen = ref(false); // 💬 Track if basket is open

onMounted(() => {
  getUserRequestAdmin(userRequestId).then((data) => {
    userRequest.value = data;
  });
});
</script>

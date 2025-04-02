<script setup>
import { onMounted, ref } from "vue";
import { getUserRequestMushrooms } from "../services/apiService.js";
import { ShoppingBasket } from "lucide-vue-next";
import Mushroom from "./Mushroom.vue";

const token = sessionStorage.getItem('jwt');

const props = defineProps({
  userRequestId: String
});

const mushrooms = ref([]);

onMounted(() => {
  getUserRequestMushrooms(props.userRequestId, token).then((data) => {
    mushrooms.value = data;
  });
});
</script>

<template>
  <div class="basket">
    <!-- Header -->
    <div class="mb-4 text-center">
      <div class="flex justify-center items-center space-x-2 text-chat-other">
        <ShoppingBasket class="w-5 h-5 text-button" />
        <h2 class="text-lg font-semibold">Mushroom Basket</h2>
      </div>
      <p class="text-xs text-button mt-1 font-medium">
        {{ mushrooms.length }} mushroom{{ mushrooms.length === 1 ? '' : 's' }} in the basket
      </p>
    </div>

    <!-- Scrollable image area with wide mushrooms -->
    <div class="overflow-y-auto max-h-[70vh] space-y-4">
      <div
          v-for="(mushroom, index) in mushrooms"
          :key="index"
          class="flex justify-center"
      >
        <Mushroom :mushroom="mushroom" />
      </div>
    </div>
  </div>
</template>

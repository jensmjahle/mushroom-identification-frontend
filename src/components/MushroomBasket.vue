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

    <!-- Scrollable image area with wide images -->
    <div class="overflow-y-auto max-h-[70vh] space-y-4">
      <div
          v-for="(image, index) in mushrooms"
          :key="index"
          class="w-full aspect-[4/3] mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
      >
        <img
            :src="image"
            alt="Mushroom"
            class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>



<script setup>
import { onMounted, ref } from "vue";
import {getUserRequestImages} from "../services/apiService.js";
import { ShoppingBasket } from "lucide-vue-next";

const token = sessionStorage.getItem('jwt');

const props = defineProps({
  userRequestId: String
});

const mushrooms = ref([]);

onMounted(() => {
  getUserRequestImages(props.userRequestId, token).then((data) => {
    console.log("raw data" + data);
    const BASE_URL = 'http://localhost:8080';
    const imageUrls = (data || [])
    .filter(msg => msg.messageType === "IMAGE")
    .map(msg => `${BASE_URL}/api/images?token=${msg.content}`);
    console.log("imageUrls " + imageUrls);
    mushrooms.value = imageUrls;
  });
});

</script>

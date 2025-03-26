<template>
  <div class="bg-white border border-chat-border rounded-lg shadow p-4 w-full max-w-screen-md mx-auto">
    <!-- Header -->
    <div class="mb-4 text-center">
      <div class="flex justify-center items-center space-x-2 text-chat-other">
        <ShoppingBasket class="w-6 h-6 text-button" />
        <h2 class="text-xl font-bold">Mushroom Basket</h2>
      </div>
      <p class="text-sm text-button mt-1 font-medium">
        {{ mushrooms.length }} mushroom{{ mushrooms.length === 1 ? '' : 's' }} in the basket
      </p>
    </div>

    <!-- Scrollable image list -->
    <div class="overflow-x-auto">
      <div class="flex space-x-4 pb-2">
        <div
            v-for="(image, index) in mushrooms"
            :key="index"
            class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-full overflow-hidden border border-gray-300"
        >
          <img
              :src="image"
              alt="Mushroom"
              class="w-full h-full object-cover"
          />
        </div>
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

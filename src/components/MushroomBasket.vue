<script setup>
import { onMounted, ref } from "vue";
import { getUserRequestMushrooms } from "../services/apiService.js";
import { ShoppingBasket, ChevronLeft, ChevronRight } from "lucide-vue-next";
import Mushroom from "./Mushroom.vue";

const token = sessionStorage.getItem('jwt');

const props = defineProps({
  userRequestId: String
});

const mushrooms = ref([]);
const isOpen = ref(true);

onMounted(() => {
  getUserRequestMushrooms(props.userRequestId, token).then((data) => {
    mushrooms.value = data;
  });
});
</script>

<template>
  <div class="relative flex h-full items-start">
    <!-- Toggle tab -->
    <button
        @click="isOpen = !isOpen"
        class="absolute top-10 -left-8  btn-icon-transparent-1 bg-bg1 rounded-l-md rounded-r-none z-20">
      <component :is="isOpen ? ChevronRight : ChevronLeft" class="w-6 h-6" /> <ShoppingBasket></ShoppingBasket>
    </button>

    <!-- Basket content wrapper -->
    <div
        :class="[
        'transition-all duration-300 h-full flex',
        isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden' ]">
      <div class="basket h-full flex flex-col">
        
        <!-- Header -->
        <div class="mb-2 text-center">
          <div class="flex justify-center items-center space-x-2 text-text1">
            <ShoppingBasket class="w-5 h-5 text-button3" />
            <h2 class="text-lg font-semibold">Mushroom Basket</h2>
          </div>
          <p class="text-xs text-text1-faded mt-1 font-medium">
            {{ mushrooms.length }} mushroom{{ mushrooms.length === 1 ? '' : 's' }} in the basket
          </p>
        </div>

        <!-- Mushrooms -->
        <div class="overflow-y-auto max-h-[70vh] space-y-6">
          <div
              v-for="(mushroom, index) in mushrooms"
              :key="index"
              class="flex justify-center">
            <Mushroom :mushroom="mushroom" :index="index + 1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

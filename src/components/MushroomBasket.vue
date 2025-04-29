<template>
  <div
    class="fixed sm:absolute z-30 flex items-start transition-transform duration-300 ease-in-out"
    :class="isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-42px)]'"
  >
    <!-- Toggle Button -->
    <button
      @click="toggleBasket"
      class="z-40 -translate-x-3 rounded-r-md sm:translate-x-0 flex flex-col items-center bg-bg1  border border-border2  sm:rounded-r-none rounded-l-md h-[80px] gap-1"
    >
      <component :is="isOpen ? ChevronRight : ChevronLeft" class="w-9 h-9" />
      <ShoppingBasket class="w-7 h-7" />
    </button>

    <!-- Basket Panel -->
    <div
      class="basket w-[280px] h-full flex flex-col bg-bg1 shadow-lg rounded-bl-lg"
    >
      <!-- Header -->
      <div class="mb-2 text-center px-4 pt-4">
        <div class="flex justify-center items-center space-x-2 text-text1">
          <ShoppingBasket class="w-5 h-5 text-button3" />
          <h2 class="text-lg font-semibold">Mushroom Basket</h2>
        </div>
        <p class="text-xs text-text1-faded mt-1 font-medium">
          {{ mushrooms.length }} mushroom{{ mushrooms.length === 1 ? '' : 's' }} in the basket
        </p>
      </div>

      <!-- Mushrooms -->
      <div class="overflow-y-auto px-4 pb-4 space-y-6 mt-2">
        <div
          v-for="(mushroom, index) in mushrooms"
          :key="index"
          class="flex justify-center"
        >
          <Mushroom :mushroom="mushroom" :index="index + 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ShoppingBasket, ChevronLeft, ChevronRight } from "lucide-vue-next";
import Mushroom from "./Mushroom.vue";
import { getUserRequestMushrooms } from "@/services/mushroomService.js";

const props = defineProps({ userRequestId: String });
const emit = defineEmits(["basket-toggle"]);

const mushrooms = ref([]);
const isOpen = ref(false);

function toggleBasket() {
  isOpen.value = !isOpen.value;
  emit("basket-toggle", isOpen.value);
}

onMounted(() => {
  getUserRequestMushrooms(props.userRequestId).then((data) => {
    mushrooms.value = data;
  });
});
</script>

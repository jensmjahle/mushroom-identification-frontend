<template>
  <div
      ref="basketRef"
      class="fixed sm:absolute z-30 flex items-start transition-transform duration-300 ease-in-out"
      :class="isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-42px)]'"
  >
    <!-- Toggle Button -->
    <button
      @click.stop="toggleBasket"
      class="z-40 -translate-x-3 rounded-r-md sm:translate-x-0 flex flex-col items-center justify-center bg-bg1 border border-border2 sm:border-r-0 sm:rounded-r-none rounded-l-md h-[80px] w-[40px]"
    >
      <component :is="isOpen ? ChevronRight : ChevronLeft" class="w-10 h-10 absolute top-0 right-0" />
      <ShoppingBasket class="w-7 h-7 absolute bottom-2" />
    </button>

    <!-- Basket Panel -->
    <div class="basket w-[280px] h-full min-h-[80vh] max-h-[80vh] flex flex-col bg-bg1 shadow-lg rounded-bl-lg">
      <!-- Header -->
      <div class="mb-2 text-center px-4 pt-4">
        <div class="flex justify-center items-center space-x-2 text-text1">
          <ShoppingBasket class="w-5 h-5 text-button3" />
          <h2 class="text-lg font-semibold">Mushroom Basket</h2>
        </div>
        <p class="text-xs text-text1-faded mt-1 font-medium">
          {{ mushroomStore.mushrooms?.length || 0 }} mushroom{{ mushroomStore.mushrooms?.length === 1 ? '' : 's' }} in the basket
        </p>

      </div>

      <!-- Mushrooms -->
      <div class="overflow-y-auto h-full min-h-[80vh] px-4 pb-4 space-y-6 pt-2">
        <Mushroom
            v-for="(mushroom, index) in mushroomStore.mushrooms"
            :key="mushroom.mushroomId"
            :mushroomId="mushroom.mushroomId"
            :index="index + 1"
            :userRequestId="props.userRequestId"
            @mushroom-status-updated="handleLocalUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {ChevronLeft, ChevronRight, ShoppingBasket} from 'lucide-vue-next';
import Mushroom from './Mushroom.vue';
import {useMushroomStore} from "@/store/useMushroomStore.js";
import {useRequestSocketStore} from "@/store/useRequestSocketStore.js";
import {getUserRequestMushrooms} from "@/services/rest/mushroomService.js";

const props = defineProps({ userRequestId: String });
const emit = defineEmits(['basket-toggle']);

const isOpen = ref(
  sessionStorage.getItem('isBasketPanelOpen') !== 'false'
)

watch(isOpen, (newVal) => {
  sessionStorage.setItem('isBasketPanelOpen', newVal.toString())
})

const basketRef = ref(null);

const mushroomStore = useMushroomStore();
const socketStore = useRequestSocketStore()


function toggleBasket() {
  isOpen.value = !isOpen.value;
  emit('basket-toggle', isOpen.value);
}

function closeBasket() {
  isOpen.value = false;
  emit('basket-toggle', false);
}

function handleClickOutside(event) {
  if (
    isOpen.value &&
    basketRef.value &&
    !basketRef.value.contains(event.target) &&
    typeof window !== 'undefined' &&
    window.innerWidth <= 640
  ) {
    closeBasket();
  }
}


async function loadMushrooms() {
  if (!props.userRequestId) return
  const data = await getUserRequestMushrooms(props.userRequestId);
  mushroomStore.setMushrooms(data);
}

function handleLocalUpdate(source) {
  if (source !== 'updated-locally') {
    mushroomStore.fetchMushrooms(props.userRequestId)
  }
}


watch(() => socketStore.lastNotification, (notif) => {
  if (notif.startsWith('MUSHROOM_BASKET_UPDATED')) {
    mushroomStore.fetchMushrooms(props.userRequestId)
  }
})



onMounted(() => {
  loadMushrooms();
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

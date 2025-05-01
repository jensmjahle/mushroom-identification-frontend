<template>
  <div class="relative w-full aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto">
    <!-- Headline -->
    <div
      class="absolute -top-2 left-1/2 -translate-x-1/2 z-10 text-sm font-semibold text-text1 bg-bg1 px-2 py-0.5 rounded-full shadow border border-border1"
    >
      {{ $t('mushroom.title') }} {{ props.index }}
    </div>

    <!-- Circular mushroom container -->
    <div
      class="mushroom transition duration-200 border-2 sm:border-4 md:border-6 lg:border-8 w-full h-full rounded-full overflow-hidden"
      :class="borderClass"
    >
      <!-- Image -->
      <img
        :src="imageUrls[currentIndex]"
        alt="Mushroom"
        class="w-full h-full object-cover cursor-pointer"
        @click="popupVisible = true"
      />

      <!-- Navigation arrows -->
      <button
        v-if="imageUrls.length > 1"
        @click.stop="prev"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 btn-icon-transparent-1"
      >
        <ArrowLeft />
      </button>
      <button
        v-if="imageUrls.length > 1"
        @click.stop="next"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 btn-icon-transparent-1"
      >
        <ArrowRight />
      </button>
    </div>

    <!-- Status badge -->
    <div
      class="absolute 
        bottom-[-8px] right-1/2 
        sm:bottom-[-6px] sm:right-[20%] 
        md:bottom-[8px] md:right-[12%] 
        lg:bottom-[14px] lg:right-[6%]"
    >
      <StatusBadge :status="props.mushroom.mushroomStatus" :user-request-id="props.userRequestId" :mushroom-id="props.mushroom.mushroomId"/>
    </div>

    <!-- Popup -->
    <MushroomPopup
      v-if="popupVisible"
      :mushroom="props.mushroom"
      :userRequestId="props.userRequestId"
      @close="popupVisible = false"
      @updated="$emit('updated')"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import StatusBadge from './badges/MushroomStatusBadge.vue';
import MushroomPopup from './MushroomPopup.vue';

const BASE_URL = import.meta.env.VITE_API_URL;
const props = defineProps({
  mushroom: Object,
  index: Number,
  userRequestId: String
});

const imageUrls = ref([]);
const currentIndex = ref(0);
const popupVisible = ref(false);

function refreshImages() {
  imageUrls.value = props.mushroom.imageUrls.map(
    token => `${BASE_URL}/api/images?token=${token}`
  );
}

onMounted(() => {
  refreshImages();
});

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + imageUrls.value.length) % imageUrls.value.length;
};

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % imageUrls.value.length;
};

const status = computed(() => props.mushroom.mushroomStatus?.toLowerCase().replace(/_/g, '-'));

const borderClass = computed(() => {
  return {
    'psilocybin': 'border-mushroom-psilocybin',
    'non-psilocybin': 'border-mushroom-non-psilocybin',
    'toxic': 'border-mushroom-toxic',
    'unknown': 'border-mushroom-unknown',
    'unidentifiable': 'border-mushroom-unidentifiable',
    'not-processed': 'border-mushroom-not-processed'
  }[status.value] || 'border-gray-300';
});
</script>

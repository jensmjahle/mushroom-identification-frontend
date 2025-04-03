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
          @click="prev"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 text-text1 px-1 bg-bg1/60 rounded-full"
      >
        <ArrowLeft></ArrowLeft>
      </button>
      <button
          v-if="imageUrls.length > 1"
          @click="next"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 text-text1 px-1 bg-bg1/60 rounded-full"
      >
        <ArrowRight></ArrowRight>
      </button>
    </div>

    <!-- Status badge positioned above the image -->
    <div
        class="absolute 
      bottom-[-8px] right-1/2 
      sm:bottom-[-6px] sm:right-[20%] 
      md:bottom-[8px] md:right-[12%] 
      lg:bottom-[14px] lg:right-[6%] 
      text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow border z-10"
        :class="[badgeBg, badgeText, badgeBorder]"
    >

    <component :is="statusIcon" class="w-4 h-4" />
      <span class="capitalize">
        {{ props.mushroom.mushroomStatus.toLowerCase().replace(/_/g, ' ') }}
      </span>
    </div>
    
    <!-- Popup Modal -->
    <MushroomPopup
        v-if="popupVisible"
        :mushroom="props.mushroom"
        @close="popupVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  X,
  Check,
  HelpCircle,
  AlertCircle,
  Circle,
  ArrowLeft,
  ArrowRight
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import MushroomPopup from "@/components/MushroomPopup.vue";

const { t } = useI18n()
const BASE_URL = 'http://localhost:8080'
const props = defineProps({
  mushroom: Object,
  index: Number
})

const imageUrls = ref([])
const currentIndex = ref(0)
const popupVisible = ref(false)

onMounted(() => {
  imageUrls.value = props.mushroom.imageUrls.map(
      token => `${BASE_URL}/api/images?token=${token}`
  )
})

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + imageUrls.value.length) % imageUrls.value.length
}
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % imageUrls.value.length
}

const status = computed(() =>
    props.mushroom.mushroomStatus?.toLowerCase().replace(/_/g, '-')
)

const borderClass = computed(() => {
  return {
    'psilocybin': 'border-mushroom-psilocybin',
    'non-psilocybin': 'border-mushroom-non-psilocybin',
    'toxic': 'border-mushroom-toxic',
    'unknown': 'border-mushroom-unknown',
    'unidentifiable': 'border-mushroom-unidentifiable',
    'not-processed': 'border-mushroom-not-processed'
  }[status.value] || 'border-gray-300'
})

const badgeBg = computed(() => {
  return {
    'psilocybin': 'bg-mushroom-psilocybin',
    'non-psilocybin': 'bg-mushroom-non-psilocybin',
    'toxic': 'bg-mushroom-toxic',
    'unknown': 'bg-mushroom-unknown',
    'unidentifiable': 'bg-mushroom-unidentifiable',
    'not-processed': 'bg-mushroom-not-processed'
  }[status.value] || 'bg-gray-300'
})

const badgeText = computed(() => {
  return {
    'psilocybin': 'text-mushroom-psilocybin-text',
    'non-psilocybin': 'text-mushroom-non-psilocybin-text',
    'toxic': 'text-mushroom-toxic-text',
    'unknown': 'text-mushroom-unknown-text',
    'unidentifiable': 'text-mushroom-unidentifiable-text',
    'not-processed': 'text-mushroom-not-processed-text'
  }[status.value] || 'text-black'
})

const badgeBorder = computed(() => {
  return {
    'psilocybin': 'border-mushroom-psilocybin-border',
    'non-psilocybin': 'border-mushroom-non-psilocybin-border',
    'toxic': 'border-mushroom-toxic-border',
    'unknown': 'border-mushroom-unknown-border',
    'unidentifiable': 'border-mushroom-unidentifiable-border',
    'not-processed': 'border-mushroom-not-processed-border'
  }[status.value] || 'border-gray-300'
})

const statusIcon = computed(() => {
  switch (props.mushroom.mushroomStatus) {
    case 'TOXIC':
      return X
    case 'PSILOCYBIN':
      return HelpCircle
    case 'NON_PSILOCYBIN':
      return Check
    case 'UNKNOWN':
      return HelpCircle
    case 'UNIDENTIFIABLE':
      return AlertCircle
    case 'NOT_PROCESSED':
      return Circle
    default:
      return Circle
  }
})
</script>

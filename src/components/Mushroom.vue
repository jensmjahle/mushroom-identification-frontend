<template>
  <div
      class="mushroom transition duration-200 border-4 w-full aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto"
      :class="borderClass"
  >
    <!-- Image -->
    <img
        :src="imageUrls[currentIndex]"
        alt="Mushroom"
        class="w-full h-full object-cover rounded-full"
    />

    <!-- Status badge -->
    <div
        class="absolute bottom-1 right-1 text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow border"
        :class="[badgeBg, badgeText, badgeBorder]"
    >
      <component :is="statusIcon" class="w-4 h-4" />
      <span class="capitalize">
        {{ props.mushroom.mushroomStatus.toLowerCase().replace(/_/g, ' ') }}
      </span>
    </div>

    <!-- Navigation arrows -->
    <button
        v-if="imageUrls.length > 1"
        @click="prev"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 text-white px-1 bg-black/30 rounded-full"
    >
      ‹
    </button>
    <button
        v-if="imageUrls.length > 1"
        @click="next"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 text-white px-1 bg-black/30 rounded-full"
    >
      ›
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  X,
  Check,
  HelpCircle,
  AlertCircle,
  Circle
} from 'lucide-vue-next'

const BASE_URL = 'http://localhost:8080'

const props = defineProps({
  mushroom: Object
})

const imageUrls = ref([])
const currentIndex = ref(0)

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
    'psilocybin': 'border-mushroom-psilocybin-border',
    'non-psilocybin': 'border-mushroom-non-psilocybin-border',
    'toxic': 'border-mushroom-toxic-border',
    'unknown': 'border-mushroom-unknown-border',
    'unidentifiable': 'border-mushroom-unidentifiable-border',
    'not-processed': 'border-mushroom-not-processed-border'
  }[status.value] || 'border-gray-300'
})

const badgeBg = computed(() => `bg-mushroom-${status.value}`)
const badgeText = computed(() => `text-mushroom-${status.value}-text`)
const badgeBorder = computed(() => `border-mushroom-${status.value}-border`)

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

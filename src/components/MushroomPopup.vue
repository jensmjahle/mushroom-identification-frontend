<template>
  <!-- Backdrop that listens for outside clicks -->
  <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="handleOutsideClick"
  >
    <!-- Modal content -->
    <div
        class="bg-bg1 rounded-lg shadow-lg p-4 max-w-4xl w-full relative"
        @click.stop
    >
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-2 right-2 text-text1 hover:text-danger">
        ✕
      </button>

      <!-- Status -->
      <div
          class="absolute top-2 left-2 text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow border z-10"
          :class="[badgeBg, badgeText, badgeBorder]"
      >
        <component :is="statusIcon" class="w-4 h-4" />
        <span class="capitalize">{{ statusLabel }}</span>
      </div>

      <!-- Image viewer -->
      <div class="flex flex-col items-center">
        <div class="relative overflow-hidden w-full h-[400px] sm:h-[500px] mb-4 bg-black/5 rounded-md">
          <img
              :src="imageUrls[currentIndex]"
              :style="imageStyle"
              class="mx-auto max-h-full transition-transform duration-200"
              alt="Selected Mushroom"
          />
        </div>

        <!-- Zoom & Rotate -->
        <div class="flex gap-4 mb-4">
          <button @click="zoomIn" class="btn-1"><ZoomIn></ZoomIn></button>
          <button @click="zoomOut" class="btn-1"><ZoomOut></ZoomOut></button>
          <button @click="rotate" class="btn-2"><RotateCw></RotateCw></button>
        </div>

        <!-- Thumbnails -->
        <div class="flex gap-2 overflow-x-auto">
          <img
              v-for="(img, idx) in imageUrls"
              :key="idx"
              :alt="'thumbnail-' + idx"
              :src="img"
              @click="currentIndex = idx"
              class="w-16 h-16 object-cover rounded-md cursor-pointer border-2"
              :class="idx === currentIndex ? 'border-button1' : 'border-transparent'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { X, Check, HelpCircle, AlertCircle, Circle, ZoomOut, ZoomIn, RotateCw } from 'lucide-vue-next'

const BASE_URL = 'http://localhost:8080'
const props = defineProps({ mushroom: Object })
const emit = defineEmits(['close'])

const imageUrls = ref([])
const currentIndex = ref(0)
const zoom = ref(1)
const rotation = ref(0)

onMounted(() => {
  imageUrls.value = props.mushroom.imageUrls.map(
      (token) => `${BASE_URL}/api/images?token=${token}`
  )
})

const zoomIn = () => (zoom.value = Math.min(zoom.value + 0.1, 3))
const zoomOut = () => (zoom.value = Math.max(zoom.value - 0.1, 1))
const rotate = () => (rotation.value = (rotation.value + 90) % 360)

const imageStyle = computed(() => ({
  transform: `scale(${zoom.value}) rotate(${rotation.value}deg)`
}))

const status = computed(() =>
    props.mushroom.mushroomStatus?.toLowerCase().replace(/_/g, '-')
)
const statusLabel = computed(() =>
    props.mushroom.mushroomStatus.toLowerCase().replace(/_/g, ' ')
)

const badgeBg = computed(() => ({
  'psilocybin': 'bg-mushroom-psilocybin',
  'non-psilocybin': 'bg-mushroom-non-psilocybin',
  'toxic': 'bg-mushroom-toxic',
  'unknown': 'bg-mushroom-unknown',
  'unidentifiable': 'bg-mushroom-unidentifiable',
  'not-processed': 'bg-mushroom-not-processed'
}[status.value] || 'bg-gray-300'))

const badgeText = computed(() => ({
  'psilocybin': 'text-mushroom-psilocybin-text',
  'non-psilocybin': 'text-mushroom-non-psilocybin-text',
  'toxic': 'text-mushroom-toxic-text',
  'unknown': 'text-mushroom-unknown-text',
  'unidentifiable': 'text-mushroom-unidentifiable-text',
  'not-processed': 'text-mushroom-not-processed-text'
}[status.value] || 'text-black'))

const badgeBorder = computed(() => ({
  'psilocybin': 'border-mushroom-psilocybin-border',
  'non-psilocybin': 'border-mushroom-non-psilocybin-border',
  'toxic': 'border-mushroom-toxic-border',
  'unknown': 'border-mushroom-unknown-border',
  'unidentifiable': 'border-mushroom-unidentifiable-border',
  'not-processed': 'border-mushroom-not-processed-border'
}[status.value] || 'border-gray-300'))

const statusIcon = computed(() => {
  switch (props.mushroom.mushroomStatus) {
    case 'TOXIC': return X
    case 'PSILOCYBIN': return HelpCircle
    case 'NON_PSILOCYBIN': return Check
    case 'UNKNOWN': return HelpCircle
    case 'UNIDENTIFIABLE': return AlertCircle
    case 'NOT_PROCESSED': return Circle
    default: return Circle
  }
})

// Handle click outside
const handleOutsideClick = () => {
  emit('close')
}
</script>

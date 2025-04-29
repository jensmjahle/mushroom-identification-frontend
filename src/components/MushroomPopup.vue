<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-overlay/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="handleOutsideClick">
      <div class="bg-bg1 rounded-lg shadow-lg p-4 max-w-4xl w-full relative" @click.stop>
        <!-- Close -->
        <button @click="$emit('close')" class="absolute -top-10 right-0 btn-icon-transparent-1 hover:text-danger"><x></x></button>

        <!-- Status badge -->
        <StatusBadge class="absolute top-2 left-2" :status="props.mushroom.mushroomStatus"></StatusBadge>

        <!-- Image viewer -->
        <div class="flex flex-col items-center">
          <div
              class="relative overflow-hidden w-full h-[400px] sm:h-[500px] mb-4 bg-black/5 rounded-md"
              :class="{ 'cursor-grabbing': dragging, 'cursor-grab': !dragging }"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="stopDrag"
              @mouseleave="stopDrag"
              @touchstart.prevent="startTouch"
              @touchmove.prevent="onTouchMove"
              @touchend="stopDrag">
            <img
                :src="imageUrls[currentIndex]"
                class="w-full h-full object-contain pointer-events-none select-none absolute top-0 left-0"
                :style="imageStyle"
                alt="Selected Mushroom"/>
          </div>

          <!-- Controls -->
          <div class="flex gap-4 mb-4">
            <button @click="zoomIn" class="btn-1"><ZoomIn /></button>
            <button @click="zoomOut" class="btn-1"><ZoomOut /></button>
            <button @click="rotate" class="btn-2"><RotateCw /></button>
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-2 overflow-x-auto">
            <img
                v-for="(img, idx) in imageUrls"
                :key="idx"
                :src="img"
                alt="Mushroom Thumbnail"
                @click="currentIndex = idx"
                class="w-16 h-16 object-cover rounded-md cursor-pointer border-2"
                :class="idx === currentIndex ? 'border-button1' : 'border-transparent'"/>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  X, Check, HelpCircle, AlertCircle, Circle,
  ZoomOut, ZoomIn, RotateCw
} from 'lucide-vue-next'
import StatusBadge from "@/components/badges/StatusBadge.vue";

const BASE_URL = 'http://100.98.99.38:8080'
const props = defineProps({ mushroom: Object })
const emit = defineEmits(['close'])

const imageUrls = ref([])
const currentIndex = ref(0)
const zoom = ref(1) // Start fully zoomed out (1)
const rotation = ref(0)
const offset = ref({ x: 0, y: 0 })
const dragging = ref(false)
const start = ref({ x: 0, y: 0 })

onMounted(() => {
  imageUrls.value = props.mushroom.imageUrls.map(
      token => `${BASE_URL}/api/images?token=${token}`
  )
})

watch(zoom, (value) => {
  if (value === 1) {
    offset.value = { x: 0, y: 0 }
  }
})

// Mouse drag
const startDrag = (e) => {
  if (zoom.value === 1) return
  dragging.value = true
  start.value = { x: e.clientX, y: e.clientY }
}
const onDrag = (e) => {
  if (!dragging.value || zoom.value === 1) return
  const dx = e.clientX - start.value.x
  const dy = e.clientY - start.value.y
  offset.value.x += dx
  offset.value.y += dy
  start.value = { x: e.clientX, y: e.clientY }
}
const stopDrag = () => {
  dragging.value = false
}

// Touch drag
const startTouch = (e) => {
  if (zoom.value === 1) return
  dragging.value = true
  start.value = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  }
}
const onTouchMove = (e) => {
  if (!dragging.value || zoom.value === 1) return
  const dx = e.touches[0].clientX - start.value.x
  const dy = e.touches[0].clientY - start.value.y
  offset.value.x += dx
  offset.value.y += dy
  start.value = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  }
}

// Zoom and Rotate
const zoomIn = () => zoom.value = Math.min(zoom.value + 0.1, 3)
const zoomOut = () => zoom.value = Math.max(zoom.value - 0.1, 1)
const rotate = () => rotation.value = (rotation.value + 90) % 360

const imageStyle = computed(() => {
  const translate = `translate(${offset.value.x}px, ${offset.value.y}px)`
  return {
    transform: `${translate} scale(${zoom.value}) rotate(${rotation.value}deg)`,
    transformOrigin: 'center center'
  }
})


const handleOutsideClick = () => {
  emit('close')
}
</script>

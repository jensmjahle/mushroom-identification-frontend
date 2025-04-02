<template>
  <div
      class="relative w-40 h-40 rounded-full border-4 shadow-lg overflow-hidden"
      :class="borderColor"
  >
    <!-- Image -->
    <img
        :src="imageUrls[currentIndex]"
        alt="Mushroom"
        class="w-full h-full object-cover"
    />

    <!-- Status badge -->
    <div
        class="absolute bottom-1 right-1 bg-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow"
    >
      <component :is="statusIcon" class="w-4 h-4 text-danger" />
      <span class="capitalize">{{ mushroom.mushroomStatus.toLowerCase() }}</span>
    </div>

    <!-- Navigation arrows -->
    <button
        v-if="imageUrls.length > 1"
        @click="prev"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 text-white px-1"
    >‹</button>
    <button
        v-if="imageUrls.length > 1"
        @click="next"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 text-white px-1"
    >›</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X } from 'lucide-vue-next' // Example icon
const BASE_URL = 'http://localhost:8080'

const props = defineProps({
  mushroom: Object
})

const imageUrls = ref([])
const currentIndex = ref(0)

// Convert image tokens to full URLs
onMounted(() => {
  imageUrls.value = props.mushroom.imageUrls.map(
      (token) => `${BASE_URL}/api/images?token=${token}`
  )
})

// Navigation
const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + imageUrls.value.length) % imageUrls.value.length
}
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % imageUrls.value.length
}

// Status-based styles and icon
const borderColor = computed(() => {
  switch (props.mushroom.mushroomStatus) {
    case 'TOXIC':
      return 'border-danger'
    case 'EDIBLE':
      return 'border-success'
    default:
      return 'border-gray-300'
  }
})
const statusIcon = computed(() => {
  switch (props.mushroom.mushroomStatus) {
    case 'TOXIC':
      return X
    default:
      return X
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-overlay/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="handleOutsideClick"
    >
      <div
        class="bg-bg1 rounded-lg shadow-lg p-4 max-w-4xl w-full relative"
        @click.stop
      >
        <!-- Close -->
        <button
          @click="$emit('close')"
          class="absolute -top-10 right-0 btn-icon-transparent-1 hover:text-danger"
        >
          <X />
        </button>

        <!-- Status badge -->
        <StatusBadge class="absolute top-2 left-2" :status="props.mushroom.mushroomStatus" />

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
            @touchend="stopDrag"
          >
            <img
              :src="imageUrls[currentIndex]"
              class="w-full h-full object-contain pointer-events-none select-none absolute top-0 left-0"
              :style="imageStyle"
              alt="Selected Mushroom"
            />
          </div>

          <!-- Controls -->
          <div class="flex gap-4 mb-4">
            <button @click="zoomIn" class="btn-1"><ZoomIn /></button>
            <button @click="zoomOut" class="btn-1"><ZoomOut /></button>
            <button @click="rotate" class="btn-2"><RotateCw /></button>
            <button @click="triggerFileInput" class="btn-3"><Plus /></button>
            <input
              type="file"
              accept="image/*"
              ref="fileInput"
              class="hidden"
              multiple
              @change="handleImageUpload"
            />
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
              :class="idx === currentIndex ? 'border-button1' : 'border-transparent'"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { X, ZoomOut, ZoomIn, RotateCw, Plus } from 'lucide-vue-next';
import StatusBadge from '@/components/badges/MushroomStatusBadge.vue';
import { processImageFiles } from '@/utils/imageUtils';
import { addImageToMushroom, getMushroomById, getUserRequestMushrooms } from '@/services/mushroomService';

const props = defineProps({
  mushroom: Object,
  userRequestId: String
});

const emit = defineEmits(['close', 'updated']);

const BASE_URL = 'http://100.98.99.38:8080';
const imageUrls = ref([]);
const currentIndex = ref(0);
const zoom = ref(1);
const rotation = ref(0);
const offset = ref({ x: 0, y: 0 });
const dragging = ref(false);
const start = ref({ x: 0, y: 0 });
const fileInput = ref(null);

onMounted(() => {
  refreshImages();
});

function refreshImages() {
  imageUrls.value = props.mushroom.imageUrls.map(
    token => `${BASE_URL}/api/images?token=${token}`
  );
}

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleImageUpload(e) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const { processedFiles } = await processImageFiles(
    files,
    [],
    files.map((_, i) => `extra_mushroom_image${i + 1}.jpg`)
  );
  if (!processedFiles.length) return;

  try {
    await addImageToMushroom(props.userRequestId, props.mushroom.mushroomId, processedFiles);
    
    const mushrooms = await getUserRequestMushrooms(props.userRequestId);
    const updated = mushrooms.find(m => m.mushroomId === props.mushroom.mushroomId);
    props.mushroom.imageUrls = updated.imageUrls;

    imageUrls.value = updated.imageUrls.map(
      token => `${BASE_URL}/api/images?token=${token}`
    );
    currentIndex.value = imageUrls.value.length - 1; // Vis nyeste bilde

    emit('updated');
  } catch (err) {
    console.error('Failed to upload image', err);
  }
}


const zoomIn = () => (zoom.value = Math.min(zoom.value + 0.1, 3));
const zoomOut = () => (zoom.value = Math.max(zoom.value - 0.1, 1));
const rotate = () => (rotation.value = (rotation.value + 90) % 360);

const imageStyle = computed(() => {
  const translate = `translate(${offset.value.x}px, ${offset.value.y}px)`;
  return {
    transform: `${translate} scale(${zoom.value}) rotate(${rotation.value}deg)`
  };
});

const startDrag = (e) => {
  if (zoom.value === 1) return;
  dragging.value = true;
  start.value = { x: e.clientX, y: e.clientY };
};
const onDrag = (e) => {
  if (!dragging.value || zoom.value === 1) return;
  const dx = e.clientX - start.value.x;
  const dy = e.clientY - start.value.y;
  offset.value.x += dx;
  offset.value.y += dy;
  start.value = { x: e.clientX, y: e.clientY };
};
const stopDrag = () => (dragging.value = false);

const startTouch = (e) => {
  if (zoom.value === 1) return;
  dragging.value = true;
  start.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
};
const onTouchMove = (e) => {
  if (!dragging.value || zoom.value === 1) return;
  const dx = e.touches[0].clientX - start.value.x;
  const dy = e.touches[0].clientY - start.value.y;
  offset.value.x += dx;
  offset.value.y += dy;
  start.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
};

const handleOutsideClick = () => emit('close');
</script>

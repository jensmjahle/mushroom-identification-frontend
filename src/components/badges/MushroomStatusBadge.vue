
<template>
  <div class="inline-block relative">
    <div
        class="status-badge inline-flex"
        :class="[bg, text, border, isAdmin ? 'hover:brightness-90 cursor-pointer' : 'cursor-default']"
        @click="toggleDropdown"
    >
      <component :is="icon" class="w-4 h-4" />
      <span class="capitalize">{{ label }}</span>
    </div>

    <!-- Dropdown -->
    <div
        v-if="showDropdown && isAdmin"
        class="absolute right-0 mt-1 min-w-max bg-bg3 text-text3 border-border3 border shadow z-50 rounded text-sm whitespace-nowrap"
    >
      <div
          v-for="option in statusOptions"
          :key="option"
          @click="selectStatus(option)"
          class="px-3 py-1 hover:bg-gray-100 cursor-pointer capitalize"
      >
        {{ option.replace(/_/g, ' ').toLowerCase() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { X, Check, HelpCircle, AlertCircle, Circle } from 'lucide-vue-next';
import {parseJwt} from "@/utils/jwt.js";

const props = defineProps({
  status: String,
  mushroomId: [String, Number],
});

const emit = defineEmits(['status-updated']);
const isAdmin = ref(false);
const statusKey = computed(() => props.status.toLowerCase().replace(/_/g, '-'));
const label = computed(() => props.status.replace(/_/g, ' ').toLowerCase());
const token = sessionStorage.getItem('jwt');
const userRole = parseJwt(token)?.role;

onMounted(() => {
      isAdmin.value = userRole === 'SUPERUSER' || userRole === 'MODERATOR';
});

const bg = computed(() => ({
  toxic: 'bg-mushroom-toxic',
  psilocybin: 'bg-mushroom-psilocybin',
  'non-psilocybin': 'bg-mushroom-non-psilocybin',
  unknown: 'bg-mushroom-unknown',
  unidentifiable: 'bg-mushroom-unidentifiable',
  'not-processed': 'bg-mushroom-not-processed',
}[statusKey.value] || 'bg-gray-300'));

const text = computed(() => ({
  toxic: 'text-mushroom-toxic-text',
  psilocybin: 'text-mushroom-psilocybin-text',
  'non-psilocybin': 'text-mushroom-non-psilocybin-text',
  unknown: 'text-mushroom-unknown-text',
  unidentifiable: 'text-mushroom-unidentifiable-text',
  'not-processed': 'text-mushroom-not-processed-text',
}[statusKey.value] || 'text-black'));

const border = computed(() => ({
  toxic: 'border-mushroom-toxic-border',
  psilocybin: 'border-mushroom-psilocybin-border',
  'non-psilocybin': 'border-mushroom-non-psilocybin-border',
  unknown: 'border-mushroom-unknown-border',
  unidentifiable: 'border-mushroom-unidentifiable-border',
  'not-processed': 'border-mushroom-not-processed-border',
}[statusKey.value] || 'border-gray-300'));

const icon = computed(() => {
  switch (props.status) {
    case 'TOXIC': return X;
    case 'PSILOCYBIN': return HelpCircle;
    case 'NON_PSILOCYBIN': return Check;
    case 'UNKNOWN': return HelpCircle;
    case 'UNIDENTIFIABLE': return AlertCircle;
    case 'NOT_PROCESSED': return Circle;
    default: return Circle;
  }
});

const showDropdown = ref(false);
const statusOptions = [
  'PSILOCYBIN',
  'NON_PSILOCYBIN',
  'TOXIC',
  'UNKNOWN',
  'UNIDENTIFIABLE',
  'NOT_PROCESSED'
];

function toggleDropdown() {
  if (isAdmin) showDropdown.value = !showDropdown.value;
}

async function selectStatus(newStatus) {
  showDropdown.value = false;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mushrooms/${props.mushroomId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      emit('status-updated', newStatus);
    } else {
      console.error('Failed to update status');
    }
  } catch (err) {
    console.error('Error updating status:', err);
  }
}
</script>

<style scoped>
.status-badge {
  @apply text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow border z-10;
}
</style>


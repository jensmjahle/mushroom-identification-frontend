<template>
  <div class="inline-block relative">
    <div
        class="status-badge inline-flex"
        :class="[bg, text, border, isAdmin ? 'hover:brightness-90 cursor-pointer' : 'cursor-default']"
        @click="toggleDropdown"
    >
      <component :is="icon" class="w-4 h-4" />
      <span class="capitalize">{{ t(`mushroom.status.${statusKey}`) }}</span>
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
          class="px-3 py-1 hover:bg-text3-faded cursor-pointer capitalize"
      >
        {{ t(`mushroom.status.${option.toLowerCase().replace(/_/g, '-')}`) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { parseJwt } from '@/utils/jwt.js';
import { useToast } from 'vue-toastification';
import {getStatusStyles} from "@/utils/styling/mushroomStatusStyles.js";

const props = defineProps({
  status: String,
  mushroomId: [String, Number],
});

const emit = defineEmits(['status-updated']);
const { t } = useI18n();
const toast = useToast();

const isAdmin = ref(false);
const showDropdown = ref(false);
const token = sessionStorage.getItem('jwt');
const userRole = parseJwt(token)?.role;

const statusStyles = computed(() => getStatusStyles(props.status));

const bg = computed(() => statusStyles.value.bg);
const text = computed(() => statusStyles.value.text);
const border = computed(() => statusStyles.value.border);
const icon = computed(() => statusStyles.value.icon);
const statusKey = computed(() => statusStyles.value.key);

onMounted(() => {
  isAdmin.value = userRole === 'SUPERUSER' || userRole === 'MODERATOR';
});

const statusOptions = [
  'PSILOCYBIN',
  'NON_PSILOCYBIN',
  'TOXIC',
  'UNKNOWN',
  'UNIDENTIFIABLE',
  'NOT_PROCESSED'
];

function toggleDropdown() {
  if (isAdmin.value) showDropdown.value = !showDropdown.value;
}

async function selectStatus(newStatus) {
  showDropdown.value = false;
  toast.info(t(`mushroom.status.${newStatus.toLowerCase().replace(/_/g, '-')}`), {
    timeout: 2000,
    closeOnClick: true,
    pauseOnHover: true,
  });

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mushrooms/${props.mushroomId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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

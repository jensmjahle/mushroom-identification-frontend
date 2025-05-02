<template>
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <div class="p-6 bg-bg rounded-lg shadow-md">
      <!-- Headline and filter -->
      <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 class="text-xl font-bold text-chat-other">User Requests</h2>
        <select v-model="filterStatus" class="px-2 py-2 border rounded-md w-full sm:w-auto">
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <!-- Queue -->
      <div class="space-y-2">
        <router-link
            v-for="request in filteredRequests"
            :key="request.userRequestId"
            :to="{ name: 'admin-request', params: { userRequestId: request.userRequestId } }"
            class="block"
        >
          <div
              class="p-3 bg-white rounded border border-chat-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow transition cursor-pointer hover:bg-bgAlt"
          >
            <div class="text-left flex-1">
              <h4 class="text-md text-chat-other break-words">ID: {{ request.userRequestId }}</h4>
              <h1 class="text-lg text-textAlt">
                Last updated: {{ formatDate(request.updatedAt) }}
              </h1>
            </div>
            <p class="text-pr text-chat-other font-semibold whitespace-nowrap">
              {{ request.username || 'Unclaimed' }}
            </p>
            <span
                :class="[
                'text-sm font-semibold px-3 py-1 rounded-full capitalize whitespace-nowrap',
                getStatusClass(request.status)
              ]"
            >
              {{ request.status.toLowerCase() }}
            </span>
          </div>
        </router-link>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <button
            class="px-4 py-2 bg-button hover:bg-button-hover text-white rounded disabled:opacity-50 w-full sm:w-auto"
            @click="prevPage"
            :disabled="page === 0"
        >
          Previous
        </button>
        <p class="text-sm text-chat-other text-center">Page {{ page + 1 }}</p>
        <button
            class="px-4 py-2 bg-button hover:bg-button-hover text-white rounded disabled:opacity-50 w-full sm:w-auto"
            @click="nextPage"
            :disabled="page >= totalPages - 1"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {formatDate} from '../utils/formatters';
import {getPaginatedRequests} from "@/services/adminRequestService.js";

const token = sessionStorage.getItem('jwt');
const page = ref(0);
const size = 10;
const requests = ref([]);
const totalPages = ref(1);
const filterStatus = ref('');

const loadData = async () => {
  const result = await getPaginatedRequests(page.value, size, token);
  requests.value = result.content;
  totalPages.value = result.totalPages;
};

onMounted(loadData);
watch(page, loadData);

const filteredRequests = computed(() => {
  if (!filterStatus.value) return requests.value;
  return requests.value.filter(r => r.status === filterStatus.value);
});

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value++;
};

const prevPage = () => {
  if (page.value > 0) page.value--;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-status-pending text-white';
    case 'APPROVED':
      return 'bg-status-approved text-white';
    case 'REJECTED':
      return 'bg-status-rejected text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};


</script>

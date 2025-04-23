<template>
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <div class="p-6 bg-bg rounded-lg shadow-md">

      <!-- Optional Column Headers -->
      <div v-if="columns?.length" class="grid grid-cols-12 font-semibold text-sm text-text3 mb-4 px-2">
        <div
            v-for="col in columns"
            :key="col.key"
            :class="col.class || 'col-span-4'"
        >
          {{ col.label }}
        </div>
      </div>

      <!-- List Rows -->
      <div v-if="items?.length" class="space-y-2">
        <div v-for="item in items" :key="item.id || item.userRequestId">
          <slot name="default" :item="item">
            <!-- Fallback rendering if no custom slot provided -->
            <div class="p-4 bg-white rounded-md shadow-sm">
              {{ JSON.stringify(item) }}
            </div>
          </slot>
        </div>
      </div>
      <p v-else class="text-sm text-text2 italic">No data available</p>

      <!-- Pagination Controls -->
      <div
          v-if="pagination"
          class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
      >
        <button
            class="px-4 py-2 bg-button hover:bg-button-hover text-white rounded disabled:opacity-50 w-full sm:w-auto"
            :disabled="pagination.page === 0"
            @click="$emit('prev-page')"
        >
          Previous
        </button>

        <p class="text-sm text-text2 text-center">
          Page {{ pagination.page + 1 }} of {{ pagination.totalPages }}
        </p>

        <button
            class="px-4 py-2 bg-button hover:bg-button-hover text-white rounded disabled:opacity-50 w-full sm:w-auto"
            :disabled="pagination.page >= pagination.totalPages - 1"
            @click="$emit('next-page')"
        >
          Next
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  items: Array,
  columns: Array,
  pagination: Object
})

defineEmits(['next-page', 'prev-page'])
</script>

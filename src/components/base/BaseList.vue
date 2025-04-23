<template>
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <div class="p-6 bg-bg1 rounded-lg shadow">

      <!-- Column Headers -->
      <div
          v-if="columns?.length"
          class="grid gap-4 font-semibold text-sm text-text2 mb-2"
          :style="{ gridTemplateColumns: gridTemplate }"
      >
        <div v-for="col in columns" :key="col.key">
          {{ col.label }}
        </div>
      </div>

      <!-- Items -->
      <div v-if="items?.length" class="space-y-2">
        <div
            v-for="(item, index) in items"
            :key="item.id || index"
            class="grid gap-4 items-center bg-white px-4 py-3 rounded"
            :style="{ gridTemplateColumns: gridTemplate }"
        >
          <slot name="row" :item="item">
            <!-- Default rendering if no slot is used -->
            <div v-for="col in columns" :key="col.key">
              {{ item[col.key] }}
            </div>
          </slot>
        </div>
      </div>

      <p v-else class="text-sm text-text2 italic mt-2">No data available</p>

      <!-- Pagination -->
      <div v-if="pagination" class="mt-6 flex justify-between items-center">
        <button
            class="btn-1"
            @click="$emit('prev-page')"
            :disabled="pagination.page === 0"
        >
          Previous
        </button>

        <span class="text-sm">
          Page {{ pagination.page + 1 }} of {{ pagination.totalPages }}
        </span>

        <button
            class="btn-1"
            @click="$emit('next-page')"
            :disabled="pagination.page >= pagination.totalPages - 1"
        >
          Next
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";

defineProps({
  items: Array,
  columns: Array,
  pagination: Object
})
defineEmits(['next-page', 'prev-page'])

const gridTemplate = computed(() =>
    `repeat(${(columns?.length || 1)}, minmax(0, 1fr))`
)
</script>

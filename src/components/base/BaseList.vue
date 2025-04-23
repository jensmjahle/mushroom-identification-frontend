<template>
  <div class="w-full max-w-screen-xl mx-auto">
    <div class="p-2 bg-bg1 rounded-lg">

      <!-- Optional Column Headers (desktop only) -->
      <div v-if="columns?.length" class="hidden sm:grid grid-cols-12 font-semibold text-sm text-text1-faded px-2">
        <div
            v-for="col in columns"
            :key="col.key"
            :class="col.class || 'col-span-4'"
        >
          {{ col.label }}
        </div>
      </div>

      <!-- Divider -->
      <hr class="my-2 border-button2-border" />

      <!-- List Rows -->
      <div v-if="items?.length" class="space-y-2 px-2">
        <div v-for="item in items" :key="item.id || item.userRequestId">
          <slot name="default" :item="item" />
        </div>
      </div>

      <!-- No data message -->
      <p v-else class="text-sm text-text1 italic">{{ t('common.noData') }}</p>

      <!-- Pagination Controls -->
      <div
          v-if="pagination"
          class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
      >
        <BaseButton
            :disabled="pagination.page === 0"
            @click="$emit('prev-page')"
            variant="3"
        >
          {{ t('common.previous') }}
        </BaseButton>

        <p class="text-sm text-text2 text-center">
          {{ t('common.page') }} {{ pagination.page + 1 }} {{ t('common.of') }} {{ pagination.totalPages }}
        </p>

        <BaseButton
            :disabled="pagination.page >= pagination.totalPages - 1"
            @click="$emit('next-page')"
            variant="3"
        >
          {{ t('common.next') }}
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps({
  items: Array,
  columns: Array,
  pagination: Object
})

defineEmits(['next-page', 'prev-page'])

const { t } = useI18n()
</script>

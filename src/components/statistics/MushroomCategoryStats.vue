<template>
  <div class="main-admin-component">
    <h2>{{ t('admin.stats.mushroomCategories') }}</h2>
    <ul class="space-y-2">
      <li
          v-for="(item, index) in stats"
          :key="index"
          class="flex justify-between p-3 rounded bg-bg1 shadow border"
      >
        <span>{{ t(`mushroomStatus.${item.status}`) }}</span>
        <span class="font-semibold text-button3">{{ item.count }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchMushroomCategoryStats } from '@/services/rest/statsService.js'

const stats = ref([])
const { t } = useI18n()
const token = sessionStorage.getItem('jwt')

onMounted(async () => {
  stats.value = await fetchMushroomCategoryStats(token)
  stats.value = stats.value.filter(s => s.status !== 'NOT_PROCESSED')
})
</script>

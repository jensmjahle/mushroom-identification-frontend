<template>
  <div class="bg-bg1 border border-border1 rounded-lg p-4 shadow">
    <h3 class="text-sm text-text2-faded font-medium mb-2">
      {{ $t('admin.stats.exportTitle') }}
    </h3>
    <div class="flex items-center gap-4">
      <select v-model="selectedMonth" class="border border-border1 rounded p-1 text-sm">
        <option v-for="(m, i) in months" :key="i" :value="i + 1">
          {{ m }}
        </option>
      </select>
      <select v-model="selectedYear" class="border border-border1 rounded p-1 text-sm">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <BaseButton variant="1" @click="emitExport">
        {{ $t('admin.stats.exportButton') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['export'])
const { t } = useI18n()

const months = [
  t('month.jan'), t('month.feb'), t('month.mar'),
  t('month.apr'), t('month.may'), t('month.jun'),
  t('month.jul'), t('month.aug'), t('month.sep'),
  t('month.oct'), t('month.nov'), t('month.dec')
]

const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

const emitExport = () => {
  emit('export', {
    month: selectedMonth.value,
    year: selectedYear.value
  })
}
</script>

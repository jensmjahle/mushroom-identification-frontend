<template>
  <div class="bg-bg1 border border-border1 rounded-lg p-4 shadow">
    <h3 class="text-sm text-text2-faded font-medium mb-2">
      {{ t('admin.stats.exportTitle') }}
    </h3>

    <div class="flex flex-col sm:flex-row items-center gap-4">
      <select v-model="selectedMonth" class="border border-border1 rounded p-1 text-sm bg-bg2">
        <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
      </select>
      <select v-model="selectedYear" class="border border-border1 rounded p-1 text-sm bg-bg2">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>

      <!-- CSV Export Button -->
      <BaseButton variant="1" @click="openConfirm" :disabled="loadingCsv">
        <span v-if="loadingCsv">{{ t('common.loading') }}</span>
        <span v-else>{{ t('admin.stats.exportButton') }}</span>
      </BaseButton>

      <!-- PDF Export Button -->
      <BaseButton variant="2" @click="openConfirmPdf" :disabled="loadingPdf">
        <span v-if="loadingPdf">{{ t('common.loading') }}</span>
        <span v-else>{{ t('admin.stats.exportPdfButton') }}</span>
      </BaseButton>
    </div>

    <!-- Confirm Dialog for CSV -->
    <ConfirmDialog
        v-if="showConfirm"
        :visible="showConfirm"
        :title="t('admin.stats.confirmDownloadTitle')"
        :message="`${t('admin.stats.confirmDownloadShort')} (${months[selectedMonth - 1]} ${selectedYear})`"
        :confirmText="t('admin.stats.downloadCsv')"
        :cancelText="t('common.cancel')"
        @cancel="showConfirm = false"
        @confirm="handleExportCsv"
    />

    <!-- Confirm Dialog for PDF -->
    <ConfirmDialog
        v-if="showConfirmPdf"
        :visible="showConfirmPdf"
        :title="t('admin.stats.confirmDownloadTitle')"
        :message="`${t('admin.stats.confirmDownloadShort')} (${months[selectedMonth - 1]} ${selectedYear})`"
        :confirmText="t('admin.stats.downloadPdf')"
        :cancelText="t('common.cancel')"
        @cancel="showConfirmPdf = false"
        @confirm="handleExportPdf"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import { useToast } from 'vue-toastification'
import { getRequestsForMonth } from '@/services/rest/adminRequestService.js'
import { exportStatisticsPdf } from '@/services/rest/statsService.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())
const years = Array.from({ length: 5 }, (_, i) => selectedYear.value - i)
const months = [
t('month.jan'), t('month.feb'), t('month.mar'),
t('month.apr'), t('month.may'), t('month.jun'),
t('month.jul'), t('month.aug'), t('month.sep'),
t('month.oct'), t('month.nov'), t('month.dec')
]

const loadingCsv = ref(false)
const loadingPdf = ref(false)
const showConfirm = ref(false)
const showConfirmPdf = ref(false)

function openConfirm() {
showConfirm.value = true
}

function openConfirmPdf() {
showConfirmPdf.value = true
}

async function handleExportCsv() {
loadingCsv.value = true
showConfirm.value = false
try {
await getRequestsForMonth({
month: selectedMonth.value,
year: selectedYear.value
})
} catch (e) {
toast.error(t('errors.exportFailed'))
console.error(e)
} finally {
loadingCsv.value = false
}
}

async function handleExportPdf() {
loadingPdf.value = true
showConfirmPdf.value = false
try {
await exportStatisticsPdf(selectedYear.value, selectedMonth.value)
} catch (e) {
toast.error(t('errors.exportFailed'))
console.error(e)
} finally {
loadingPdf.value = false
}
}
</script>
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
      <BaseButton variant="1" @click="openConfirm" :disabled="loading">
        <span v-if="loading">{{ t('common.loading') }}</span>
        <span v-else>{{ t('admin.stats.exportButton') }}</span>
      </BaseButton>
    </div>

    <!-- Simple confirm dialog -->
    <ConfirmDialog
      v-if="showConfirm"
      :visible="showConfirm"
      :title="t('admin.stats.confirmDownloadTitle')"
      :message="`${t('admin.stats.confirmDownloadShort')} (${months[selectedMonth - 1]} ${selectedYear})`"
      :confirmText="t('admin.stats.downloadCsv')"
      :cancelText="t('common.cancel')"
      @cancel="showConfirm = false"
      @confirm="handleExport"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import { useToast } from 'vue-toastification'
import { getRequestsForMonth } from '@/services/adminRequestService.js'
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

const loading = ref(false)
const showConfirm = ref(false)

function openConfirm() {
  showConfirm.value = true
}

async function handleExport() {
  loading.value = true
  showConfirm.value = false

  try {
    const res = await getRequestsForMonth({
      month: selectedMonth.value,
      year: selectedYear.value
    })

    const rows = (res?.content || []).map(r => [
      r.userRequestId,
      r.updatedAt,
      r.status,
      r.numberOfMushrooms
    ])

    if (!rows.length) {
      toast.info(t('common.noData'))
      return
    }

    const csv = [
      ['Request ID', 'Updated At', 'Status', 'Mushrooms'],
      ...rows
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `requests_${selectedYear.value}_${selectedMonth.value}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    toast.error(t('errors.exportFailed'))
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

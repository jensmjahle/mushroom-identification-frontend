<template>
  <div class="mt-6">
    <h3 class="text-lg font-semibold text-danger">
      {{ $t('settings.danger.title') }}
    </h3>
    <p class="text-sm text-text1 mb-2">
      {{ $t('settings.danger.description') }}
    </p>
    <BaseButton
        variant="2"
        @click="confirmDelete"
        class="bg-danger hover:bg-danger-hover text-text3 border border-danger-border"
    >
      {{ $t('settings.danger.button') }}
    </BaseButton>
  </div>
</template>


<script setup>
import BaseButton from "@/components/base/BaseButton.vue"
import { useI18n } from "vue-i18n"
import { useConfirmDialog } from "@/composables/useConfirmDialog"
import {deleteAdminAccount} from "@/services/adminService.js";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";

const { t } = useI18n()
const { showConfirm } = useConfirmDialog()
const toast = useToast()
const router = useRouter()

const confirmDelete = async () => {
  const confirmed = await showConfirm({
    title: t('settings.danger.confirmTitle'),
    message: t('settings.danger.confirm'),
    confirmText: t('buttons.confirm'),
    cancelText: t('buttons.cancel')
  })

  if (confirmed) {
    try {
      await deleteAdminAccount()
      sessionStorage.removeItem('jwt')
      await router.push({name: 'admin-login'})
      toast.success(t('settings.danger.success'))
    } catch (error) {
      toast.error(t('settings.danger.error'))
      console.error(error)
    }
  }
}
</script>

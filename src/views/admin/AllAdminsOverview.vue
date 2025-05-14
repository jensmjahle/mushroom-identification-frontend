<template>
  <div class="flex-grow p-2 sm:px-2 md:px-6 lg:px-8">
    <BaseList
        :items="admins"
        :columns="columns"
        :pagination="{ page, totalPages }"
        @next-page="nextPage"
        @prev-page="prevPage"
        :clickable="true"
        @item-click="handleClick"
    >
      <template #default="{ item }">
        <AdminRow :item="item" />
      </template>
    </BaseList>
  </div>


</template>




<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useToast} from 'vue-toastification'
import BaseList from '@/components/base/BaseList.vue'
import {deleteAdminAsSuperuser, getPaginatedAdmins} from '@/services/rest/adminService.js'
import AdminRow from "@/components/base/rows/AdminRow.vue";
import ConfirmDialog from "@/components/base/ConfirmDialog.vue";
import {useConfirmDialog} from '@/composables/useConfirmDialog'

const { showConfirm } = useConfirmDialog()
const toast = useToast()
const { t } = useI18n()
const page = ref(0)
const size = 20
const totalPages = ref(1)
const admins = ref([])



const columns = computed(() => [
  { label: t('admin.username'), key: 'username', class: 'col-span-2' },
  { label: t('admin.firstname'), key: 'firstname', class: 'col-span-2' },
  { label: t('admin.lastname'), key: 'lastname', class: 'col-span-2' },
  { label: t('admin.email'), key: 'email', class: 'col-span-3' },
  { label: t('admin.role'), key: 'role', class: 'col-span-2' }
])

const fetchAdmins = async () => {
  try {
    const result = await getPaginatedAdmins(page.value, size)
    admins.value = result.content
    totalPages.value = result.totalPages
  } catch (error) {
    console.error('Failed to load admins:', error)
    useToast().error(t('errors.loadAdmins'))
  }
}

onMounted(fetchAdmins)
watch(page, fetchAdmins)

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value++
}
const prevPage = () => {
  if (page.value > 0) page.value--
}

const handleClick = (admin) => {
  confirmDelete(admin)
}

const confirmDelete = async (admin) => {
  const confirmed = await showConfirm({
    title: t('admin.confirmDeleteTitle'),
    message: t('admin.confirmDeleteMessage', { username: admin.username }),
    confirmText: t('buttons.confirm'),
    cancelText: t('buttons.cancel')
  })

  if (confirmed) {
    try {
      await deleteAdminAsSuperuser(admin.username)
      toast.success(t('admin.deleted', { username: admin.username }))
      await fetchAdmins()
    } catch (error) {
      console.error('Failed to delete admin:', error)
      toast.error(t('errors.deleteAdmin'))
    }
  }
}


</script>

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
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BaseList from '@/components/base/BaseList.vue'
import RoleBadge from '@/components/badges/RoleBadge.vue'
import { getPaginatedAdmins } from '@/services/rest/adminService.js'
import AdminRow from "@/components/base/rows/AdminRow.vue";

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
  // Handle admin click event
  console.log('Admin clicked:', admin)
  useToast().info(`Clicked on ${admin.username}`)
}
</script>

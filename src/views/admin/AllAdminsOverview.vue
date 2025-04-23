<template>
  <div class="flex-grow p-2 sm:px-2 md:px-6 lg:px-8">
    <BaseList
        :items="admins"
        :columns="columns"
        :pagination="{ page, totalPages }"
        @next-page="nextPage"
        @prev-page="prevPage"
    >
      <template #default="{ item }">
        <!-- Desktop grid -->
        <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1">
          <p class="col-span-2">{{ item.username }}</p>
          <p class="col-span-2">{{ item.firstname }}</p>
          <p class="col-span-2">{{ item.lastname }}</p>
          <p class="col-span-3">{{ item.email }}</p>
          <div class="col-span-2">
            <RoleBadge :role="item.role" />
          </div>
        </div>

        <!-- Mobile stacked card -->
        <div class="sm:hidden bg-bg1 p-4 rounded-md shadow-sm text-sm text-text1 space-y-1">
          <p><span class="font-semibold">{{ t('admin.username') }}:</span> {{ item.username }}</p>
          <p><span class="font-semibold">{{ t('admin.firstname') }}:</span> {{ item.firstname }}</p>
          <p><span class="font-semibold">{{ t('admin.lastname') }}:</span> {{ item.lastname }}</p>
          <p><span class="font-semibold">{{ t('admin.email') }}:</span> {{ item.email }}</p>
          <p><span class="font-semibold">{{ t('admin.role') }}:</span> <RoleBadge :role="item.role" /></p>
        </div>
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
import { getPaginatedAdmins } from '@/services/adminService.js'

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
</script>

<template>
  <div class="main-admin-component">
    <BaseList
        :items="admins"
        :columns="columns"
        :pagination="{ page, totalPages }"
        @next-page="nextPage"
        @prev-page="prevPage"
    >
      <template #default="{ item }">
        <div class="grid grid-cols-12 gap-4 text-sm text-text2">
          <p class="col-span-2">{{ item.username }}</p>
          <p class="col-span-3">{{ item.email }}</p>
          <p class="col-span-2">{{ item.role }}</p>
          <p class="col-span-2">{{ item.firstname }}</p>
          <p class="col-span-2">{{ item.lastname }}</p>
        </div>
      </template>
    </BaseList>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPaginatedAdmins } from '@/services/adminService.js'
import BaseList from '@/components/base/BaseList.vue'

const page = ref(0)
const size = 10
const totalPages = ref(1)
const admins = ref([])

const columns = [
  { label: 'Username', key: 'username', class: 'col-span-2' },
  { label: 'Email', key: 'email', class: 'col-span-3' },
  { label: 'Role', key: 'role', class: 'col-span-2' },
  { label: 'First Name', key: 'firstname', class: 'col-span-2' },
  { label: 'Last Name', key: 'lastname', class: 'col-span-2' }
]

const fetchAdmins = async () => {
  try {
    const result = await getPaginatedAdmins(page.value, size)
    admins.value = result.content
    totalPages.value = result.totalPages
  } catch (error) {
    console.error('Failed to load admins:', error)
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

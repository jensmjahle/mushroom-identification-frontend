<template>
  <div class="main-admin-component">
    <BaseList
        :items="admins"
        :columns="columns"
        :pagination="{ page, totalPages }"
        @next-page="nextPage"
        @prev-page="prevPage"
    >
      <template #row="{ item }">
        <div class="grid grid-cols-5 gap-4 text-sm text-text1">
          <span>{{ item.username }}</span>
          <span>{{ item.email }}</span>
          <span>{{ item.role }}</span>
          <span>{{ item.firstname }}</span>
          <span>{{ item.lastname }}</span>
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
  { label: 'Username', key: 'username' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
  { label: 'First Name', key: 'firstname' },
  { label: 'Last Name', key: 'lastname' }
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

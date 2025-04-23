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
        <div class="grid grid-cols-12 gap-4 text-sm text-text1">
          <p class="col-span-2">{{ item.username }}</p>
          <p class="col-span-2">{{ item.firstname }}</p>
          <p class="col-span-2">{{ item.lastname }}</p>
          <p class="col-span-3">{{ item.email }}</p>
          <RoleBadge :role="item.role" />
        </div>
      </template>
    </BaseList>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPaginatedAdmins } from '@/services/adminService.js'
import BaseList from '@/components/base/BaseList.vue'
import {useToast} from "vue-toastification";
import RoleBadge from "@/components/badges/RoleBadge.vue";

const page = ref(0)
const size = 20
const totalPages = ref(1)
const admins = ref([])

const columns = [
  { label: 'Username', key: 'username', class: 'col-span-2' },
  { label: 'First Name', key: 'firstname', class: 'col-span-2' },
  { label: 'Last Name', key: 'lastname', class: 'col-span-2' },
  { label: 'Email', key: 'email', class: 'col-span-3' },
  { label: 'Role', key: 'role', class: 'col-span-2' }
  
]

const fetchAdmins = async () => {
  try {
    const result = await getPaginatedAdmins(page.value, size)
    admins.value = result.content
    totalPages.value = result.totalPages
  } catch (error) {
    console.error('Failed to load admins:', error)
    useToast().error('There was an error loading the admins. Please try again later.')
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

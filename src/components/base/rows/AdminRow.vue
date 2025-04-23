<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-12 gap-4 text-sm text-text1 px-1 bg-bg1 hover:bg-bg2 cursor-pointer transition rounded-md">
    <p class="col-span-2">{{ item.username }}</p>
    <p class="col-span-2">{{ item.firstname }}</p>
    <p class="col-span-2">{{ item.lastname }}</p>
    <p class="col-span-3">{{ item.email }}</p>
    <div class="col-span-3">
      <RoleBadge :role="item.role" />
    </div>
  </div>

  <!-- Mobile layout -->
  <div class="sm:hidden bg-bg1 p-4 rounded-md shadow-sm text-sm text-text1 space-y-1">
    <p><span class="font-semibold">{{ t('admin.username') }}:</span> {{ item.username }}</p>
    <p><span class="font-semibold">{{ t('admin.firstname') }}:</span> {{ item.firstname }}</p>
    <p><span class="font-semibold">{{ t('admin.lastname') }}:</span> {{ item.lastname }}</p>
    <p><span class="font-semibold">{{ t('admin.email') }}:</span> {{ item.email }}</p>
    <p><span class="font-semibold">{{ t('admin.role') }}:</span> <RoleBadge :role="item.role" /></p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import RoleBadge from '@/components/badges/RoleBadge.vue'

const { t } = useI18n()

defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

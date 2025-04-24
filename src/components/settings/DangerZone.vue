<template>
  <div class="mt-6">
    <h3 class="text-lg font-semibold text-red-600">Danger Zone</h3>
    <p class="text-sm text-text1 mb-2">This action is irreversible. Deleting your account will remove all your data.</p>
    <BaseButton variant="2" @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white">
      Delete Account
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue"

const confirmDelete = () => {
  if (confirm("Are you sure you want to delete your account?")) {
    // Delete account logic here
  }
}
</script>

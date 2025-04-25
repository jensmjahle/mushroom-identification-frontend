<template>
  <div v-if="visible" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div class="bg-bg1 text-text1 p-6 rounded-xl shadow-xl w-[90%] max-w-md">
      <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end gap-4">
        <BaseButton @click="cancel" variant="2">
          {{ cancelText }}
        </BaseButton>
        <BaseButton @click="confirm" variant="1">
          {{ confirmText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue"

const props = defineProps({
  title: { type: String, default: "Are you sure?" },
  message: { type: String, required: true },
  confirmText: { type: String, default: "Confirm" },
  cancelText: { type: String, default: "Cancel" },
  visible: Boolean
})

const emit = defineEmits(["confirm", "cancel"])

const confirm = () => emit("confirm")
const cancel = () => emit("cancel")
</script>

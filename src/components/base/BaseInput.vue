<script setup>
defineProps({
  id: String,
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  disabled: Boolean,
  modelValue: String,
  error: Boolean
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block mb-1 text-sm font-medium text-text1">
      {{ label }}
    </label>
    <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
        'w-full px-3 py-2 border rounded bg-bg1 text-text1 placeholder:text-text1-faded focus:outline-none focus:ring-2 transition',
        error ? 'border-danger focus:danger-hover' : 'border-border1 focus:ring-button1-border'
      ]"
    />
  </div>
</template>

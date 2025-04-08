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
        class="w-full px-3 py-2 border border-border1 rounded bg-bg1 text-text1 placeholder:text-text1-faded focus:outline-none focus:ring-2 focus:ring-button1-border transition"
    />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  disabled: Boolean,
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>




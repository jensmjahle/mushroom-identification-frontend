<template>
  <div class="input-wrapper">
    <label v-if="label" :for="name" class="input-label">{{ label }}</label>

    <div class="input-container" :class="{ 'input-error': error }">
      <slot name="icon" />
      <input
          :id="name"
          :name="name"
          :type="type"
          v-model="modelValue"
          :placeholder="placeholder"
          class="input-field"
          :autocomplete="autocomplete"
      />
    </div>

    <p v-if="error" class="input-error-text">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  name: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  error: String,
  autocomplete: {
    type: String,
    default: 'off'
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-wrapper {
  @apply flex flex-col gap-1 w-full;
}
.input-label {
  @apply text-sm font-medium text-text1;
}
.input-container {
  @apply flex items-center gap-2 bg-bg1 text-text1 border border-border2 rounded px-3 py-2 transition;
}
.input-container:focus-within {
  @apply border-button1-border shadow-md;
}
.input-field {
  @apply flex-1 bg-transparent outline-none placeholder-text1-faded;
}
.input-error {
  @apply border-danger;
}
.input-error-text {
  @apply text-xs text-danger mt-0.5;
}
</style>

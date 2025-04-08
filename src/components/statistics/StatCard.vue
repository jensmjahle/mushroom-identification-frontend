<template>
  <div class="bg-bg1 border border-border1 rounded-lg p-4 shadow text-center">
    <h3 class="text-text1-faded">{{ title }}</h3>
    <p class="text-xl font-bold text-text1">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number]
})
</script>

<script setup>
import { ref, watch } from 'vue'

const currentCursor = ref('default')

watch(currentCursor, (newVal) => {
  const body = document.body
  if (newVal === 'mushroom') {
    body.style.cursor = "url('/cursors/mushroom-cursor.png') 16 16, auto"
  } else {
    body.style.cursor = 'default'
  }
})

// Call this to change cursor
const switchCursor = () => {
  currentCursor.value = currentCursor.value === 'default' ? 'mushroom' : 'default'
}
</script>

<template>
  <button @click="switchCursor">Toggle Cursor</button>
</template>

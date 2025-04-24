<template>
  <div class="flex items-center justify-between bg-bg2 p-2 rounded">
    <div>
      <p class="text-lg font-semibold">{{ username }}</p>
      <span class="px-2 py-1 text-xs bg-button2 text-button2-meta rounded-full uppercase tracking-wide">
        {{ role }}
      </span>
    </div>
  </div>
</template>

<script setup>
const username = 'mushroomUser42' // replace with actual user data
const role = 'Expert' // or 'Admin', etc.
</script>

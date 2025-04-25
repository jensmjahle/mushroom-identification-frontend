<script setup>
import Footer from './components/Footer.vue';
import ConfirmDialog from "@/components/base/ConfirmDialog.vue";
import {useConfirmDialog} from "@/composables/useConfirmDialog.js";


const {
  isVisible,
  options,
  confirm,
  cancel
} = useConfirmDialog()
</script>

<template>
  <ConfirmDialog
      v-if="isVisible"
      :title="options.title"
      :message="options.message"
      :confirmText="options.confirmText"
      :cancelText="options.cancelText"
      :visible="isVisible"
      @confirm="confirm"
      @cancel="cancel"
  />
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />
  </div>
</template>


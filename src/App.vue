<script setup>
import Footer from './components/Footer.vue';
import ConfirmDialog from "@/components/base/ConfirmDialog.vue";
import {useConfirmDialog} from "@/composables/useConfirmDialog.js";

const dialog = useConfirmDialog()
</script>

<template>
  <ConfirmDialog
      v-if="dialog.isVisible"
      :title="dialog.options.title"
      :message="dialog.options.message"
      :confirmText="dialog.options.confirmText"
      :cancelText="dialog.options.cancelText"
      :visible="dialog.isVisible"
      @confirm="dialog.confirm"
      @cancel="dialog.cancel"
  />
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />
  </div>
</template>


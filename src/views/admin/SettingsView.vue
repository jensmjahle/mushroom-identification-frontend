<script setup>

import ThemeSelect from "@/components/settings/ThemeSelect.vue";
import LanguageSelect from "@/components/settings/LanguageSelect.vue";
import AdminInfoHeader from "@/components/settings/AdminInfoHeader.vue";
import PersonalSettingsForm from "@/components/settings/PersonalSettingsForm.vue";
import DangerZone from "@/components/settings/DangerZone.vue";
</script>

<template>
  <div class="main-view flex justify-center items-center">
    <div class="main-admin-component bg-bg2 max-w-xl w-full p-4">
      <AdminInfoHeader />

      <h2 class="text-text3 mt-4">{{ $t('settings.title') }}</h2>
      <hr class="my-4 border-border2" />

      <LanguageSelect />
      <ThemeSelect />

      <hr class="my-4 border-border3" />

      <PersonalSettingsForm />

      <hr class="my-4 border-border3" />

      <DangerZone />
    </div>
  </div>
</template>


<style scoped>

</style>
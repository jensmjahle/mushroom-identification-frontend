<script setup>

import ThemeSelect from "@/components/settings/ThemeSelect.vue";
import LanguageSelect from "@/components/settings/LanguageSelect.vue";
import AdminInfoHeader from "@/components/settings/AdminInfoHeader.vue";
import PersonalSettingsForm from "@/components/settings/PersonalSettingsForm.vue";
import DangerZone from "@/components/settings/DangerZone.vue";
</script>

<template>
  <div class="main-view flex justify-center items-center">
    <AdminInfoHeader />
    
    <div class="main-admin-component bg-bg2 max-w-3xl w-full p-4">
      <h2 class="text-text2">{{ $t('settings.title') }}</h2>
      
      <hr class="my-4 border-text2-faded" />

      <div class="flex flex-col md:flex-row gap-4 w-full">
        <div class="w-full">
          <LanguageSelect />
        </div>
        <div class="w-full">
          <ThemeSelect />
        </div>
      </div>

      <hr class="my-4 border-text2-faded" />

      <PersonalSettingsForm />

      <hr class="my-4 border-text2-faded" />

      <DangerZone />
    </div>
  </div>
</template>


<style scoped>

</style>
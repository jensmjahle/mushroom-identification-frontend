<template>
    <div>
      <LogoButton />
  
      <h2 class="text-xl font-semibold text-text4 text-center mb-4 mt-4">
        {{ $t('sideMenu.menuTitle') || 'Menu' }}
      </h2>
  
      <div class="space-y-2">
        <RouterLink to="/user" class="btn-2 block w-full text-center">
          {{ $t('sideMenu.home') }}
        </RouterLink>
  
        <RouterLink to="/user/new" class="btn-4 block w-full text-center">
          {{ $t('sideMenu.newRequest') }}
        </RouterLink>

        <RouterLink to="/user/login" class="btn-4 block w-full text-center">
          {{ $t('sideMenu.login') }}
        </RouterLink>
  
        <RouterLink to="/user/become-member" class="btn-4 block w-full text-center">
          {{ $t('sideMenu.membership') }}
        </RouterLink>
  
        <RouterLink to="/user/support" class="btn-4 block w-full text-center">
          {{ $t('sideMenu.support') }}
        </RouterLink>
      </div>
  
      <hr class="my-4 border-border2" />
  
      <LanguageSelect />
      <ThemeSelect />
    </div>
  </template>
  
  <script setup>
  import LogoButton from '@/components/LogoButton.vue'
  import LanguageSelect from '@/components/settings/LanguageSelect.vue'
  import ThemeSelect from '@/components/settings/ThemeSelect.vue'
  import { RouterLink } from 'vue-router'
  </script>
  
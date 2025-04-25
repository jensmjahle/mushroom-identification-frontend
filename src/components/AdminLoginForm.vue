<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4">
      <img src="/assets/logo-horizontal.svg" alt="Fleinsoppkontroll logo" class=" h-auto mb-4 w-52" />

    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-text1">{{ t("login.title") }}</h1>
      <p class="text-sm text-text2-faded">{{ t("login.subtitle") }}</p>
    </div>

    <div class="w-full max-w-md bg-bg2 p-6 rounded-lg shadow-md space-y-4">
      <BaseInput
          id="username"
          v-model="username"
          type="text"
          :label="t('login.username')"
          :placeholder="t('login.usernamePlaceholder')"
      />
      <BaseInput
          id="password"
          v-model="password"
          type="password"
          :label="t('login.password')"
          :placeholder="t('login.passwordPlaceholder')"
      />

      <BaseButton block @click="handleLogin">
        {{ t("login.submit") }}
      </BaseButton>

      <p v-if="errorMessage" class="text-red-500 text-sm text-center">
        {{ errorMessage }}
      </p>
    </div>

    <p class="mt-4 text-sm text-text1">
      {{ t("login.goToUserSite.question") }}
      <router-link
          to="/"
          class="text-button1 hover:underline font-medium"
      >
        {{ t("login.goToUserSite.link") }}
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const { t } = useI18n();

const props = defineProps(["onLogin"]);

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = t("login.fill_in_both_username_and_password");
    return;
  }

  try {
    await props.onLogin(username.value, password.value);
  } catch (error) {
    errorMessage.value = t("login.error");
  }
};
</script>

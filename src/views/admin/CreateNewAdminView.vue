<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-text1">{{ t("adminCreate.title") }}</h1>
      <p class="text-sm text-text2-faded">{{ t("adminCreate.subtitle") }}</p>
    </div>

    <form @submit.prevent="handleCreate" class="w-full max-w-md bg-bg2 p-6 rounded-lg shadow-md space-y-4">
      <BaseInput
          id="username"
          v-model="username"
          type="text"
          :label="t('adminCreate.username')"
          :placeholder="t('adminCreate.usernamePlaceholder')"
          :error="!!errorMessage"
      />

      <BaseInput
          id="password"
          v-model="password"
          type="password"
          :label="t('adminCreate.password')"
          :placeholder="t('adminCreate.passwordPlaceholder')"
          :error="!!errorMessage"
      />

      <BaseInput
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          :label="t('adminCreate.confirmPassword')"
          :placeholder="t('adminCreate.confirmPasswordPlaceholder')"
          :error="!!errorMessage"
      />

      <BaseInput
          id="email"
          v-model="email"
          type="email"
          :label="t('adminCreate.email')"
          :placeholder="t('adminCreate.emailPlaceholder')"
          :error="!!errorMessage"
      />

      <label for="role" class="block text-sm font-medium text-text1">{{ t("adminCreate.role") }}</label>
      <select
          id="role"
          v-model="role"
          class="w-full px-3 py-2 border rounded bg-bg1 text-text1 focus:outline-none focus:ring-2 border-border1 focus:ring-button1-border"
      >
        <option value="MODERATOR">MODERATOR</option>
        <option value="SUPERUSER">SUPERUSER</option>
      </select>

      <BaseButton block type="submit">
        {{ t("adminCreate.submit") }}
      </BaseButton>

      <p v-if="errorMessage" class="text-danger text-sm text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="text-success text-sm text-center">
        {{ successMessage }}
      </p>
    </form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { createAdmin } from "@/services/rest/adminService.js";

const { t } = useI18n();

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref("");
const role = ref("MODERATOR");

const errorMessage = ref("");
const successMessage = ref("");

const handleCreate = async () => {
errorMessage.value = "";
successMessage.value = "";

const uname = username.value.trim().toLowerCase();
const mail = email.value.trim().toLowerCase();

if (!uname || !password.value || !confirmPassword.value || !mail) {
errorMessage.value = t("adminCreate.fillInAllFields");
return;
}

const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
if (!emailRegex.test(mail)) {
errorMessage.value = t("adminCreate.invalidEmail");
return;
}

if (password.value.length < 8) {
errorMessage.value = t("adminCreate.passwordTooShort");
return;
}
if (password.value.length > 50) {
errorMessage.value = t("adminCreate.passwordTooLong");
return;
}
if (password.value.includes(" ")) {
errorMessage.value = t("adminCreate.passwordNoSpaces");
return;
}
if (!/\d/.test(password.value)) {
errorMessage.value = t("adminCreate.passwordNoNumber");
return;
}
if (!/[A-Z]/.test(password.value)) {
errorMessage.value = t("adminCreate.passwordNoUppercase");
return;
}

if (password.value !== confirmPassword.value) {
errorMessage.value = t("adminCreate.passwordsDontMatch");
return;
}

try {
await createAdmin({
username: uname,
password: password.value,
email: mail,
role: role.value
});
successMessage.value = t("adminCreate.success");
username.value = "";
password.value = "";
confirmPassword.value = "";
email.value = "";
role.value = "MODERATOR";
} catch (error) {
errorMessage.value = t("adminCreate.error");
console.error(error);
}
};
</script>
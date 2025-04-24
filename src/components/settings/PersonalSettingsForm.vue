<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">{{ $t('settings.personal.title') }}</h3>

    <div class="flex flex-col md:flex-row gap-4">
      <BaseInput
          id="firstName"
          :label="$t('settings.personal.firstName')"
          :placeholder="$t('settings.personal.firstNamePlaceholder')"
          v-model="firstName"
          class="w-full"
      />
      <BaseInput
          id="lastName"
          :label="$t('settings.personal.lastName')"
          :placeholder="$t('settings.personal.lastNamePlaceholder')"
          v-model="lastName"
          class="w-full"
      />
    </div>

    <BaseInput
        id="email"
        type="email"
        :label="$t('settings.personal.email')"
        :placeholder="$t('settings.personal.emailPlaceholder')"
        v-model="email"
        :error="emailError"
    />
    <p v-if="emailError" class="text-red-500 text-sm">{{ $t('errors.invalidEmail') }}</p>

    <h4 class="text-md font-medium mt-4">{{ $t('settings.personal.changePassword') }}</h4>

    <div class="flex flex-col md:flex-row gap-4">
      <BaseInput
          id="newPassword"
          type="password"
          :label="$t('settings.personal.newPassword')"
          :placeholder="$t('settings.personal.newPasswordPlaceholder')"
          v-model="newPassword"
          class="w-full"
      />
      <BaseInput
          id="confirmPassword"
          type="password"
          :label="$t('settings.personal.confirmPassword')"
          :placeholder="$t('settings.personal.confirmPasswordPlaceholder')"
          v-model="confirmPassword"
          :error="passwordMismatch"
          class="w-full"
      />
    </div>
    <p v-if="passwordMismatch" class="text-red-500 text-sm">{{ $t('errors.passwordMismatch') }}</p>

    <BaseButton :block="true" variant="1" @click="submitChanges">
      {{ $t('buttons.saveChanges') }}
    </BaseButton>
  </div>
</template>

<script setup>
import BaseInput from "@/components/base/BaseInput.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const newPassword = ref("")
const confirmPassword = ref("")

const emailError = computed(() => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && email.value.length > 0)
const passwordMismatch = computed(() => newPassword.value !== confirmPassword.value && confirmPassword.value.length > 0)

const submitChanges = () => {
  if (emailError.value || passwordMismatch.value) return
  // Submit logic
}
</script>

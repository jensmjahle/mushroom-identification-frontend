<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold">{{ $t('settings.personal.title') }}</h3>
      <p class="text-text2-faded">{{ $t('settings.personal.subtitle')}}</p>
    </div>
      
    <!-- Personal Info Section -->
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

    <BaseButton :block="true" variant="1" @click="submitPersonalInfo">
      {{ $t('buttons.savePersonalInfo') }}
    </BaseButton>

    <!-- Password Section -->
    <div>
      <h4 class="text-md font-medium">{{ $t('settings.personal.changePassword') }}</h4>
      <p class="text-text2-faded">{{ $t('settings.personal.changePasswordSubtitle') }}</p>
    </div>

    <div class="flex flex-col gap-4">
      <BaseInput
          id="oldPassword"
          type="password"
          :label="$t('settings.personal.oldPassword')"
          :placeholder="$t('settings.personal.oldPasswordPlaceholder')"
          v-model="oldPassword"
          :error="missingOldPassword"
          class="w-full"
      />

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
    </div>

    <p v-if="passwordMismatch" class="text-red-500 text-sm">{{ $t('errors.passwordMismatch') }}</p>
    <p v-if="missingOldPassword" class="text-red-500 text-sm">{{ $t('errors.missingOldPassword') }}</p>

    <BaseButton :block="true" variant="2" @click="submitPasswordChange">
      {{ $t('buttons.changePassword') }}
    </BaseButton>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import BaseButton from "@/components/base/BaseButton.vue"
import BaseInput from "@/components/base/BaseInput.vue"

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const oldPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")
const passwordAttempted = ref(false)

const emailError = computed(() =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && email.value.length > 0
)

const passwordMismatch = computed(() =>
    passwordAttempted.value &&
    newPassword.value !== confirmPassword.value &&
    confirmPassword.value.length > 0
)

const missingOldPassword = computed(() =>
    passwordAttempted.value &&
    newPassword.value.length > 0 &&
    !oldPassword.value
)

const submitPersonalInfo = () => {
  if (emailError.value) return
  // API call to update name and email
}

const submitPasswordChange = () => {
  passwordAttempted.value = true
  if (passwordMismatch.value || missingOldPassword.value) return
  // API call to update password
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold">{{ $t('settings.personal.title') }}</h3>
      <p class="text-text2-faded">{{ $t('settings.personal.subtitle')}}</p>
    </div>
      
    <!-- Personal Info Section -->
    <div class="flex flex-col md:flex-row gap-4">
      <BaseInput
          id="firstname"
          :label="$t('settings.personal.firstName')"
          :placeholder="$t('settings.personal.firstNamePlaceholder')"
          v-model="firstname"
          class="w-full"
      />
      <BaseInput
          id="lastname"
          :label="$t('settings.personal.lastName')"
          :placeholder="$t('settings.personal.lastNamePlaceholder')"
          v-model="lastname"
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
            :error="invalidPasswordFormat"
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

    <p v-if="passwordMismatch" class="text-danger text-sm">{{ $t('errors.passwordMismatch') }}</p>
    <p v-if="invalidPasswordFormat" class="text-danger text-sm">{{ $t('errors.invalidPasswordFormat') }}</p>
    <p v-if="missingOldPassword" class="text-danger text-sm">{{ $t('errors.missingOldPassword') }}</p>


    <BaseButton :block="true" variant="2" @click="submitPasswordChange">
      {{ $t('buttons.changePassword') }}
    </BaseButton>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import BaseButton from "@/components/base/BaseButton.vue"
import BaseInput from "@/components/base/BaseInput.vue"
import { updateAdminProfile, changeAdminPassword } from "@/services/adminService"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

// Reactive state
const firstname = ref("")
const lastname = ref("")
const email = ref("")
const oldPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")
const passwordAttempted = ref(false)

// Regex: 8–20 chars, at least one uppercase, one digit, no spaces
const passwordValidPattern = /^(?=.*[A-Z])(?=.*\d)[^\s]{8,20}$/

// Validation
const emailError = computed(() =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && email.value.length > 0
)

const passwordMismatch = computed(() =>
    passwordAttempted.value &&
    newPassword.value !== confirmPassword.value &&
    confirmPassword.value.length > 0
)

const invalidPasswordFormat = computed(() =>
    passwordAttempted.value &&
    !passwordValidPattern.test(newPassword.value) &&
    newPassword.value.length > 0
)

const missingOldPassword = computed(() =>
    passwordAttempted.value &&
    newPassword.value.length > 0 &&
    !oldPassword.value
)

// Submit handlers
const submitPersonalInfo = async () => {
  if (emailError.value) return

  try {
    await updateAdminProfile({
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value
    })
    alert(t('messages.profileUpdated'))
  } catch (error) {
    alert(t('errors.profileUpdateFailed'))
  }
}

const submitPasswordChange = async () => {
  passwordAttempted.value = true

  if (
      passwordMismatch.value ||
      missingOldPassword.value ||
      invalidPasswordFormat.value
  ) return

  try {
    await changeAdminPassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    })
    alert(t('messages.passwordChanged'))
    oldPassword.value = ""
    newPassword.value = ""
    confirmPassword.value = ""
    passwordAttempted.value = false
  } catch (error) {
    alert(t('errors.passwordChangeFailed'))
  }
}
</script>
